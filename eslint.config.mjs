import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    // These two files only feed prisma/seed.ts; the site reads from the database.
    files: ["src/app/**", "src/components/**", "src/lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: ["@/data/restaurantMenu", "@/data/cateringContent"] },
      ],
    },
  },
]);

export default eslintConfig;
