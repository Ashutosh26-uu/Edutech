import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { getProfile, setProfile } from "@/server/leaderboard";
import { rateLimit } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

/** The public leaderboard name and whether the user opted in. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json(await getProfile(user), { headers: { "Cache-Control": "no-store" } });
});

const Body = z.object({ displayName: z.string().max(40).nullable(), leaderboard: z.boolean() });

export const PUT = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`profile:${user.id}`, 20, 60 * 60_000);
  const { displayName, leaderboard } = await parseBody(req, Body);
  return json(await setProfile(user, displayName, leaderboard));
});
