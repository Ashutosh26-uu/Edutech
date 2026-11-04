import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { submitTest } from "@/server/tests";

const Body = z.object({ attemptId: z.uuid(), answers: z.array(z.number().int().nullable()).max(250), times: z.array(z.number().nonnegative()).max(250).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  const { attemptId, answers, times } = await parseBody(req, Body);
  return json(await submitTest(user, attemptId, answers, times));
});
