import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * One connection pool per server instance. On serverless hosts each instance should hold very
 * few connections (DB_POOL_MAX=1–3) and DATABASE_URL should point at the provider's pooler
 * (Neon "-pooler" host or Supabase port 6543), which multiplexes thousands of clients onto a
 * small number of real Postgres connections. Prepared statements are off for pooler compatibility.
 */
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. See .env.example.");
  return postgres(url, {
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    // A stuck query or forgotten transaction can never hold a connection for long.
    connection: { statement_timeout: 10_000, idle_in_transaction_session_timeout: 15_000 },
  });
}

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
// Reuse the pool across hot reloads in development and across invocations of a warm instance.
export const sql = globalForDb.sql ?? createClient();
globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
export { schema };
