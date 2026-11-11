import { getUser } from "@/server/auth";
import { clientIp, HttpError, json, route } from "@/server/http";
import { weeklyBoard } from "@/server/leaderboard";
import { rateLimit } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

/** This week's leaderboard for an exam: top 50 opted-in users, plus the viewer's own rank. */
export const GET = route(async (req) => {
  await rateLimit("leaderboard:" + clientIp(req), 60, 60_000);
  const exam = req.nextUrl.searchParams.get("exam");
  if (!exam || exam.length > 64) throw new HttpError(400, "Choose an exam.");
  const user = await getUser(req).catch(() => null);
  return json(await weeklyBoard(exam, user), { headers: { "Cache-Control": "no-store" } });
});
