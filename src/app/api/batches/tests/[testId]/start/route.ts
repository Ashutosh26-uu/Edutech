import { z } from "zod";
import { requireUser } from "@/server/auth";
import { startBatchTest } from "@/server/batches";
import { HttpError, json, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

/** Starts (or resumes) the user's attempt at an assigned test. Submit with /api/tests/submit. */
export const POST = route(async (req, { params }) => {
  const user = await requireUser(req);
  const { testId } = await params;
  if (!z.uuid().safeParse(testId).success) throw new HttpError(404, "Test not found.");
  await rateLimit(`test-start:${user.id}`, 20, 60_000);
  return json(await startBatchTest(user, testId), 201);
});
