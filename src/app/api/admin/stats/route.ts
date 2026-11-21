import { requireAdmin } from "@/server/admin";
import { adminStats } from "@/server/stats";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

/** Funnel, retention and visitor stats for the last 7 or 30 days, for the admin screen. Admins only. */
export const GET = route(async (req) => {
  await requireAdmin(req);
  const days = req.nextUrl.searchParams.get("days") === "30" ? 30 : 7;
  return json(await adminStats(days), { headers: { "Cache-Control": "no-store" } });
});
