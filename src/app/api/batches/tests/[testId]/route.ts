import { z } from "zod";
import { requireUser } from "@/server/auth";
import { batchTestInfo, deleteBatchTest } from "@/server/batches";
import { HttpError, json, route } from "@/server/http";

const id = async (params: Promise<Record<string, string>>) => {
  const { testId } = await params;
  if (!z.uuid().safeParse(testId).success) throw new HttpError(404, "Test not found.");
  return testId;
};

/** Title, size, time and the user's attempt, for the page before starting. */
export const GET = route(async (req, { params }) => {
  const user = await requireUser(req);
  return json(await batchTestInfo(user, await id(params)), { headers: { "Cache-Control": "no-store" } });
});

export const DELETE = route(async (req, { params }) => {
  const user = await requireUser(req);
  await deleteBatchTest(user, await id(params));
  return json({ ok: true });
});
