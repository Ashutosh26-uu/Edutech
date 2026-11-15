import { z } from "zod";
import { requireUser } from "@/server/auth";
import { addTrainer, removeTrainer } from "@/server/batches";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const id = async (params: Promise<Record<string, string>>) => {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Batch not found.");
  return id;
};

/** The batch owner gives a colleague (by email) trainer access to the batch. */
export const POST = route(async (req, { params }) => {
  const user = await requireUser(req);
  await rateLimit(`batch-trainer:${user.id}`, 30, 60 * 60_000);
  const { email } = await parseBody(req, z.object({ email: z.email("Enter a valid email.") }));
  await addTrainer(user, await id(params), email);
  return json({ ok: true });
});

export const DELETE = route(async (req, { params }) => {
  const user = await requireUser(req);
  const { email } = await parseBody(req, z.object({ email: z.string().max(200) }));
  await removeTrainer(user, await id(params), email);
  return json({ ok: true });
});
