import "server-only";
import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { allowLoginAttempt, resetLoginAttempts } from "@/lib/rateLimit";

export const RATE_LIMITED_ERROR = "RATE_LIMITED";

// Compared against when the username is unknown, so the response time doesn't
// reveal which usernames have an account. A real bcrypt hash at the same cost
// as scripts/create-admin.ts, of a random string nobody holds.
const DUMMY_PASSWORD_HASH = "$2b$12$s1o3QRjaZhnvq9SbBqFZV.yficuDoP5SXUs7OnveSKRkxWTiRVhre";

function clientIp(headers: Record<string, unknown> | undefined): string {
  const forwarded = headers?.["x-forwarded-for"];
  const first = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";
  return first || "unknown";
}

export const authOptions: NextAuthOptions = {
  // The session is a signed JWT in an httpOnly, SameSite=Lax cookie, Secure over HTTPS.
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Потребителско име", type: "text" },
        password: { label: "Парола", type: "password" },
      },
      async authorize(credentials, request) {
        const username = credentials?.username?.trim().toLowerCase();
        const password = credentials?.password;
        if (!username || !password) return null;

        const ip = clientIp(request?.headers);
        if (!(await allowLoginAttempt(ip, username))) {
          throw new Error(RATE_LIMITED_ERROR);
        }

        const user = await db.adminUser.findUnique({ where: { username } });
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
        if (!user || !valid) return null;

        await resetLoginAttempts(ip, username);
        return { id: user.id, name: user.username };
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
};

/**
 * The signed-in admin, or null. Also checks the account still exists, so
 * removing an admin takes effect at once instead of when their JWT expires.
 */
export const getAdmin = cache(async () => {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) return null;
  return db.adminUser.findUnique({ where: { id }, select: { id: true, username: true } });
});

/** For admin pages and their data reads: sends anyone not signed in to the login page. */
export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/login");
  return admin;
}
