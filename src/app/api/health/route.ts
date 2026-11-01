import { sql } from "@/db";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

/** Liveness and database check for uptime monitors. */
export const GET = route(async () => {
  const started = Date.now();
  await sql`select 1`;
  return json({ ok: true, db: "up", dbLatencyMs: Date.now() - started }, { headers: { "Cache-Control": "no-store" } });
});
