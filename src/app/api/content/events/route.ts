import { z } from "zod";
import { deleteEvent, editorEvents, requireEditor, upsertEvent } from "@/server/content";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.");
const Body = z.object({
  id: z.uuid().optional(),
  examId: z.string().max(64).nullable(),
  kind: z.enum(["notification", "apply-start", "apply-end", "admit-card", "exam", "result", "other"]),
  title: z.string().trim().min(3, "Give the event a title.").max(160),
  day: Day,
  endDay: Day.nullable().optional(),
  link: z.string().trim().max(500).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
});

export const GET = route(async (req) => {
  await requireEditor(req);
  return json({ events: await editorEvents() }, { headers: { "Cache-Control": "no-store" } });
});

export const POST = route(async (req) => {
  const user = await requireEditor(req);
  await rateLimit(`content:${user.id}`, 120, 60 * 60_000);
  return json(await upsertEvent(user, await parseBody(req, Body)));
});

export const DELETE = route(async (req) => {
  await requireEditor(req);
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Event not found.");
  await deleteEvent(id);
  return json({ ok: true });
});
