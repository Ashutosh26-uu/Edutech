import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { rewardInvite } from "@/server/referral";
import { submitTest } from "@/server/tests";

const Body = z.object({ attemptId: z.uuid(), answers: z.array(z.number().int().nullable()).max(250), times: z.array(z.number().nonnegative()).max(250).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  const { attemptId, answers, times } = await parseBody(req, Body);
  const result = await submitTest(user, attemptId, answers, times);
  // An invited account's first real test pays both sides of the invite, once (see server/referral.ts).
  // A failure here must not lose the submitted result.
  await rewardInvite(user, result.correct + result.wrong).catch((e) => console.error("rewardInvite failed", e));
  return json(result);
});
