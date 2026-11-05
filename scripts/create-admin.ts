// Admin accounts are only ever created here; the site has no sign-up.
//
//   npm run admin:create -- ivan          create, prompting for a password
//   npm run admin:create -- ivan --reset  change an existing account's password
//
// ADMIN_PASSWORD is read instead of prompting when set (used by the CI pipeline).

import { stdin, stdout } from "node:process";
import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());

const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_COST = 12;

function readHiddenLine(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      reject(new Error("No terminal to prompt on. Set ADMIN_PASSWORD instead."));
      return;
    }
    stdout.write(prompt);
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          stdout.write("\n");
          process.exit(130);
        } else if (char === "\r" || char === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        } else if (char === "\u007f") {
          value = value.slice(0, -1);
        } else {
          value += char;
        }
      }
    };
    stdin.on("data", onData);
  });
}

async function readPassword(): Promise<string> {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  const first = await readHiddenLine("Password: ");
  const second = await readHiddenLine("Repeat password: ");
  if (first !== second) throw new Error("The passwords do not match.");
  return first;
}

async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes("--reset");
  // Lowercased here and at login, so "Ivan" and "ivan" are the same account.
  const username = args.find((arg) => !arg.startsWith("--"))?.trim().toLowerCase();

  if (!username || !/^\S{3,40}$/.test(username)) {
    throw new Error("Usage: npm run admin:create -- username [--reset] (3 to 40 characters, no spaces)");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const existing = await db.adminUser.findUnique({ where: { username } });
    if (existing && !reset) {
      throw new Error(`${username} already exists. Pass --reset to change its password.`);
    }
    if (!existing && reset) {
      throw new Error(`${username} does not exist, so there is nothing to reset.`);
    }

    const password = await readPassword();
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    await db.adminUser.upsert({
      where: { username },
      create: { username, passwordHash },
      update: { passwordHash },
    });
    console.log(reset ? `Password changed for ${username}.` : `Created admin ${username}.`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
