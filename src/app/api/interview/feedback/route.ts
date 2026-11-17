import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { interviewAiEnabled, interviewFeedback } from "@/server/interviewAi";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({
  sectionId: z.string().max(40),
  index: z.number().int().min(0).max(500),
  followUp: z.string().trim().max(300).nullish(),
  answer: z.string().trim().min(1, "Say or type an answer first.").max(4000, "That answer is too long."),
});

/** Whether AI feedback is on, so the page can say so before the interview starts. */
export const GET = route(async () => json({ enabled: interviewAiEnabled() }, { headers: { "Cache-Control": "no-store" } }));

/** AI feedback on one mock-interview answer (free model tiers; signed-in users with a daily limit). */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`interview-ai:${user.id}`, 12, 60_000);
  // About four full mock interviews a day, so the free tiers last for everyone.
  await rateLimit(`interview-ai-day:${user.id}`, 40, 24 * 60 * 60_000);
  return json(await interviewFeedback(user, await parseBody(req, Body, 20_000)));
});
