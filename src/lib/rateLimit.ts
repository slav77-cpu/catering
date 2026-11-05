import "server-only";
import { db } from "@/lib/db";

const WINDOW_MINUTES = 15;

// Per client IP, as the brief asks. X-Forwarded-For can be forged, so the
// per-username cap is what bounds a distributed or spoofed attack. It is higher
// because anyone who knows the username can spend it, which would lock the real
// admin out for the rest of the window.
const MAX_ATTEMPTS_PER_IP = 5;
const MAX_ATTEMPTS_PER_USERNAME = 20;

/**
 * Atomically counts one attempt and returns the new total. Counting before the
 * password check means parallel requests can't all slip past a stale count.
 */
async function consumeAttempt(key: string): Promise<number> {
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "LoginAttempt" ("key", "count", "windowStart")
    VALUES (${key}, 1, now())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "LoginAttempt"."windowStart" < now() - make_interval(mins => ${WINDOW_MINUTES}) THEN 1
        ELSE "LoginAttempt"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "LoginAttempt"."windowStart" < now() - make_interval(mins => ${WINDOW_MINUTES}) THEN now()
        ELSE "LoginAttempt"."windowStart"
      END
    RETURNING "count"
  `;
  return rows[0].count;
}

function ipKey(ip: string) {
  return `ip:${ip}`;
}

function usernameKey(username: string) {
  return `user:${username}`;
}

/** Records the attempt; returns false when this IP or username is over its limit. */
export async function allowLoginAttempt(ip: string, username: string): Promise<boolean> {
  const [byIp, byUsername] = await Promise.all([consumeAttempt(ipKey(ip)), consumeAttempt(usernameKey(username))]);
  return byIp <= MAX_ATTEMPTS_PER_IP && byUsername <= MAX_ATTEMPTS_PER_USERNAME;
}

/** Clears the counters after a successful login and drops expired rows. */
export async function resetLoginAttempts(ip: string, username: string): Promise<void> {
  await db.loginAttempt.deleteMany({
    where: {
      OR: [
        { key: { in: [ipKey(ip), usernameKey(username)] } },
        { windowStart: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });
}
