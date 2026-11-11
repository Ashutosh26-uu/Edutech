import { requireAdmin } from "@/server/admin";
import { statsFor } from "@/server/events";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

/** Visitor stats for the last 7 or 30 days, for the admin screen. */
export const GET = route(async (req) => {
  await requireAdmin(req);
  const days = req.nextUrl.searchParams.get("days") === "30" ? 30 : 7;
  return json(await statsFor(days), { headers: { "Cache-Control": "no-store" } });
});
