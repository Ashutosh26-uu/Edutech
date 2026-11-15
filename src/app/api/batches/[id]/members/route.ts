import { z } from "zod";
import { requireUser } from "@/server/auth";
import { removeMember } from "@/server/batches";
import { HttpError, json, parseBody, route } from "@/server/http";

const Body = z.object({ userId: z.uuid() });

/** The trainer removes a student from the batch. */
export const DELETE = route(async (req, { params }) => {
  const user = await requireUser(req);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Batch not found.");
  const { userId } = await parseBody(req, Body);
  await removeMember(user, id, userId);
  return json({ ok: true });
});
