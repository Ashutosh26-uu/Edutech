// Applies SQL migrations in ./drizzle to DATABASE_URL. Safe to run on every deploy.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { describeTarget, migrationUrl } from "./migration-url.mjs";

const url = migrationUrl();
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
// Always say where the migrations go, so a wrong target is visible before anything changes.
console.log(`Migrating ${describeTarget(url)}`);
const sql = postgres(url, { max: 1 });
await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
await sql.end();
console.log("Migrations applied");
