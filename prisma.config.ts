import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Same .env.local / .env lookup as Next, so the CLI and the app agree on DATABASE_URL.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Not prisma's env() helper: it throws when the variable is unset, and
    // `prisma generate` (run on every install) has to work without a database.
    url: process.env.DATABASE_URL ?? "",
  },
});
