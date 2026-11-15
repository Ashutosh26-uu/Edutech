import { z } from "zod";
import { grantEditor, listEditors, requireContentAdmin, revokeEditor } from "@/server/content";
import { json, parseBody, route } from "@/server/http";

const Body = z.object({ email: z.email("Enter a valid email."), organisation: z.string().trim().max(120).optional() });

/** Admin only: who may publish the daily quiz and the exam calendar. */
export const GET = route(async (req) => {
  await requireContentAdmin(req);
  return json({ editors: await listEditors() }, { headers: { "Cache-Control": "no-store" } });
});

export const POST = route(async (req) => {
  const admin = await requireContentAdmin(req);
  const { email, organisation } = await parseBody(req, Body);
  await grantEditor(admin, email, organisation);
  return json({ ok: true });
});

export const DELETE = route(async (req) => {
  await requireContentAdmin(req);
  const { email } = await parseBody(req, z.object({ email: z.string().max(200) }));
  await revokeEditor(email);
  return json({ ok: true });
});
