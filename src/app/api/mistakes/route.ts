import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { mistakesSet } from "@/server/progress";

const Body = z.object({ topicId: z.string().max(64).optional(), count: z.number().int().min(1).max(50).optional() });

/** A practice set made of the user's open mistakes. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  const { topicId, count } = await parseBody(req, Body);
  return json({ questions: await mistakesSet(user, topicId, count) });
});
