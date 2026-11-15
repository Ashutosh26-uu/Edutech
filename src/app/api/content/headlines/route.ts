import { requireEditor } from "@/server/content";
import { getHeadlines } from "@/server/headlines";
import { json, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

/** Editors: today's government press headlines (titles and links) to write the daily quiz from. */
export const GET = route(async (req) => {
  const user = await requireEditor(req);
  const fresh = req.nextUrl.searchParams.get("fresh") === "1";
  if (fresh) await rateLimit(`headlines:${user.id}`, 20, 60 * 60_000);
  return json(await getHeadlines(fresh), { headers: { "Cache-Control": "no-store" } });
});
