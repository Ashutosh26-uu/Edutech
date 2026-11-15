import { defineConfig } from "drizzle-kit";
import { migrationUrl } from "./scripts/migration-url.mjs";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Same rule as db:migrate: the direct url only when it is the same database as DATABASE_URL.
  dbCredentials: { url: migrationUrl() ?? "" },
});
