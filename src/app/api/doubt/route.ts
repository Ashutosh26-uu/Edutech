import { z } from "zod";
import { requireUser } from "@/server/auth";
import { doubtEnabled, solveDoubt } from "@/server/doubt";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({ question: z.string().trim().min(8, "Type the full question.").max(3000, "That is too long. Paste one question at a time.") });

/** Whether the AI doubt solver is on, so the page can show or hide it. */
export const GET = route(async () => json({ enabled: doubtEnabled() }));

/** Solves one pasted question with Claude (signed-in users, daily limit). */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`doubt:${user.id}`, 5, 60_000);
  const { question } = await parseBody(req, Body);
  return json(await solveDoubt(user, question));
});
