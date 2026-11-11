import { getUser } from "@/server/auth";
import { json, route } from "@/server/http";
import { weeklyOverview } from "@/server/weekly";

/** The Sunday All-India Mock: this week's window per exam, your attempt, and last week's leaderboard. Login optional. */
export const GET = route(async (req) => {
  const user = await getUser(req);
  return json(await weeklyOverview(user), { headers: { "Cache-Control": "no-store" } });
});
