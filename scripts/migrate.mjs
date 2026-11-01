// Applies SQL migrations in ./drizzle to DATABASE_URL. Safe to run on every deploy.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
// Migrations need a direct (non-pooled) connection; DIRECT_DATABASE_URL is used when provided.
const sql = postgres(process.env.DIRECT_DATABASE_URL ?? url, { max: 1 });
await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
await sql.end();
console.log("Migrations applied");
