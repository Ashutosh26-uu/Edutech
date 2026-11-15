import { z } from "zod";
import { requireUser } from "@/server/auth";
import { batchDetail, deleteBatch, leaveBatch } from "@/server/batches";
import { HttpError, json, route } from "@/server/http";

const id = async (params: Promise<Record<string, string>>) => {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Batch not found.");
  return id;
};

/** The trainer's view of a batch: members and assigned tests. */
export const GET = route(async (req, { params }) => {
  const user = await requireUser(req);
  return json(await batchDetail(user, await id(params)), { headers: { "Cache-Control": "no-store" } });
});

/** The trainer deletes the batch; a member (?leave=1) leaves it. */
export const DELETE = route(async (req, { params }) => {
  const user = await requireUser(req);
  const batchId = await id(params);
  if (req.nextUrl.searchParams.get("leave") === "1") await leaveBatch(user, batchId);
  else await deleteBatch(user, batchId);
  return json({ ok: true });
});
