import { z } from "zod";
import { requireUser } from "@/server/auth";
import { createBatchTest, LIMITS } from "@/server/batches";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({
  title: z.string().trim().min(2, "Give the test a title.").max(100),
  examId: z.string().max(64),
  topicIds: z.array(z.string().max(64)).max(80).optional(),
  count: z.number().int().min(LIMITS.minQuestions).max(LIMITS.maxQuestions),
  minutes: z.number().int().min(LIMITS.minMinutes).max(LIMITS.maxMinutes),
  dueAt: z.number().int().positive().nullable().optional(),
});

/** The trainer assigns a new test (a fixed paper) to the batch. */
export const POST = route(async (req, { params }) => {
  const user = await requireUser(req);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Batch not found.");
  await rateLimit(`batch-test:${user.id}`, 30, 60 * 60_000);
  return json(await createBatchTest(user, id, await parseBody(req, Body)), 201);
});
