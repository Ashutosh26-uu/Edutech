import { z } from "zod";
import { requireUser } from "@/server/auth";
import { createBatch, myBatches } from "@/server/batches";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

/** Batches the user runs as a trainer, and batches they joined with their assigned tests. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json(await myBatches(user), { headers: { "Cache-Control": "no-store" } });
});

const Body = z.object({ name: z.string().trim().min(2, "Give the batch a name.").max(80), institution: z.string().trim().max(120).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`batch-create:${user.id}`, 10, 60 * 60_000);
  return json(await createBatch(user, await parseBody(req, Body)), 201);
});
