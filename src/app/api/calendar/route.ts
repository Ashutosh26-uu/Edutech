import { json, route } from "@/server/http";
import { upcomingEvents } from "@/server/content";

/** Upcoming exam dates (all, or ?exam=<id>). No login needed. */
export const GET = route(async (req) => {
  const exam = req.nextUrl.searchParams.get("exam") ?? undefined;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || undefined;
  return json(await upcomingEvents({ examId: exam && exam.length <= 64 ? exam : undefined, limit: limit && limit > 0 ? Math.min(limit, 300) : undefined }), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
});
