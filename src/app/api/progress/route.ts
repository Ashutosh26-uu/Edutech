import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { getProgress, recordPractice } from "@/server/progress";
import { recordPicks } from "@/server/quality";

const Body = z.object({
  answers: z.array(z.object({ questionId: z.string().max(80), topicId: z.string().max(64), correct: z.boolean(), chosenText: z.string().max(2000).nullable().optional() })).max(100),
});

/** Account progress: per-topic accuracy and open mistakes. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json(await getProgress(user));
});

/** Untimed practice posts its answers here so progress follows the account, not the browser. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`progress:${user.id}`, 60, 60_000);
  const { answers } = await parseBody(req, Body);
  await recordPractice(user, answers);
  await recordPicks(answers.map((a) => ({ questionId: a.questionId, chosenText: a.chosenText ?? null }))).catch((e) => console.error("recordPicks failed", e));
  return json({ ok: true });
});
