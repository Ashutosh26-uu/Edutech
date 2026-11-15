import { z } from "zod";
import { requireContentAdmin } from "@/server/content";
import { json, parseBody, route } from "@/server/http";
import { adminInstitutions, removeInstitution, setVerified } from "@/server/institutions";

/** Site admin: every institute page, to verify or remove. */
export const GET = route(async (req) => {
  await requireContentAdmin(req);
  return json({ institutes: await adminInstitutions() }, { headers: { "Cache-Control": "no-store" } });
});

export const PATCH = route(async (req) => {
  await requireContentAdmin(req);
  const { id, verified } = await parseBody(req, z.object({ id: z.uuid(), verified: z.boolean() }));
  await setVerified(id, verified);
  return json({ ok: true });
});

export const DELETE = route(async (req) => {
  await requireContentAdmin(req);
  const { id } = await parseBody(req, z.object({ id: z.uuid() }));
  await removeInstitution(id);
  return json({ ok: true });
});
