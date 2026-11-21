import { z } from "zod";
import { requireUser } from "@/server/auth";
import { explainAiEnabled, explainQuestion } from "@/server/explainAi";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({
  questionId: z.string().min(1).max(120),
  chosen: z.number().int().min(0).max(3).nullable(),
  lang: z.enum(["en", "hi"]).default("en"),
});

/** Whether "Explain more" is on, so the button is only shown when it can work. */
export const GET = route(async () => json({ enabled: explainAiEnabled() }, { headers: { "Cache-Control": "no-store" } }));

/** A short AI explanation of one bank question (free model tiers; signed-in, verified users, 30 an hour). */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`explain-ai:${user.id}`, 6, 60_000);
  try {
    await rateLimit(`explain-ai-hour:${user.id}`, 30, 60 * 60_000);
  } catch (e) {
    if (e instanceof HttpError && e.status === 429) throw new HttpError(429, "You’ve used this hour’s AI explanations. Try again in a while; the answer key and explanation above still apply.", "rate_limited");
    throw e;
  }
  return json(await explainQuestion(user, await parseBody(req, Body, 2_000)));
});
