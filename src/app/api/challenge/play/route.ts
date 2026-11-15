import { z } from "zod";
import { requireUser } from "@/server/auth";
import { playChallenge } from "@/server/challenges";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({ id: z.string().max(20), answers: z.array(z.number().int().nullable()).max(50), seconds: z.number() });

/** Submits the user's one go at a challenge and returns the scores and the full review. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`challenge-play:${user.id}`, 60, 60 * 60_000);
  const { id, answers, seconds } = await parseBody(req, Body);
  return json(await playChallenge(user, id, answers, seconds));
});
