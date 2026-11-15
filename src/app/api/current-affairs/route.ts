import { json, route } from "@/server/http";
import { publicQuiz } from "@/server/content";

/** The day's current-affairs quiz (or ?day=YYYY-MM-DD) and the list of recent days. No login needed. */
export const GET = route(async (req) => {
  const day = req.nextUrl.searchParams.get("day") ?? undefined;
  const valid = day && /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : undefined;
  return json(await publicQuiz(valid), { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
});
