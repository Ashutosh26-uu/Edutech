import { sql } from "@/db";
import { clientIp, json, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

/** Liveness and database check for uptime monitors. */
export const GET = route(async (req) => {
  await rateLimit("health:" + clientIp(req), 30, 60_000);
  const started = Date.now();
  await sql`select 1`;
  return json({ ok: true, db: "up", dbLatencyMs: Date.now() - started }, { headers: { "Cache-Control": "no-store" } });
});
