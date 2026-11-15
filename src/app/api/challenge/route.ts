import { z } from "zod";
import { getUser, requireUser } from "@/server/auth";
import { createChallenge, getChallenge, myChallenges } from "@/server/challenges";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({ examId: z.string().max(60), topicIds: z.array(z.string().max(80)).max(40).optional() });

/** A challenge by its link code (login optional: logged-out visitors see who challenged them), or ?mine=1 for the user's list. */
export const GET = route(async (req) => {
  const params = req.nextUrl.searchParams;
  if (params.get("mine")) return json({ challenges: await myChallenges(await requireUser(req)) }, { headers: { "Cache-Control": "no-store" } });
  const id = params.get("id");
  if (!id) throw new HttpError(400, "Missing challenge code.");
  return json(await getChallenge(await getUser(req), id), { headers: { "Cache-Control": "no-store" } });
});

/** Makes a new 10-question challenge from an exam's topics. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`challenge:${user.id}`, 30, 24 * 60 * 60_000);
  const { examId, topicIds } = await parseBody(req, Body);
  return json(await createChallenge(user, examId, topicIds), 201);
});
