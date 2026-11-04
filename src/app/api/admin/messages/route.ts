import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireAdmin } from "@/server/admin";
import { json, parseBody, route } from "@/server/http";

/** Contact-form messages, newest first, for the admin screen. */
export const GET = route(async (req) => {
  await requireAdmin(req);
  const status = req.nextUrl.searchParams.get("status");
  const rows = await db
    .select()
    .from(schema.contactMessages)
    .where(status === "open" || status === "answered" || status === "closed" ? eq(schema.contactMessages.status, status) : undefined)
    .orderBy(desc(schema.contactMessages.createdAt))
    .limit(200);
  return json({ messages: rows.map((m) => ({ ...m, createdAt: m.createdAt.getTime() })) });
});

const Body = z.object({ id: z.uuid(), status: z.enum(["open", "answered", "closed"]) });

export const PATCH = route(async (req) => {
  await requireAdmin(req);
  const { id, status } = await parseBody(req, Body);
  const rows = await db.update(schema.contactMessages).set({ status }).where(eq(schema.contactMessages.id, id)).returning({ id: schema.contactMessages.id });
  return json({ ok: rows.length > 0 });
});
