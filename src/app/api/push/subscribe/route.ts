import type { NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { EXAM_BY_ID } from "@/data/exams";
import { isReminderHour } from "@/lib/reminders";
import { getUser } from "@/server/auth";
import { clientIp, HttpError, json, route } from "@/server/http";
import { pushConfigured } from "@/server/push";
import { rateLimit } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BODY = 4096;
/**
 * Browser push services. The cron job POSTs to every stored endpoint, so any other host would let
 * anyone make our server send requests wherever they like.
 */
const PUSH_HOSTS = ["fcm.googleapis.com", "push.services.mozilla.com", "notify.windows.com", "push.apple.com"];
const b64url = (max: number) => z.string().min(8).max(max).regex(/^[A-Za-z0-9_-]+=*$/, "Invalid subscription keys.");
const Endpoint = z
  .string()
  .max(1000)
  .refine((s) => {
    try {
      const u = new URL(s);
      return u.protocol === "https:" && PUSH_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
    } catch {
      return false;
    }
  }, "This browser's push service isn't supported.");

const Subscribe = z.object({
  endpoint: Endpoint,
  keys: z.object({ p256dh: b64url(200), auth: b64url(100) }),
  hour: z.number().int().refine(isReminderHour, "Pick one of the listed reminder times."),
  examId: z.string().max(80).nullish(),
});
const Unsubscribe = z.object({ endpoint: Endpoint });

/** Reads a small JSON body: rejects anything over MAX_BODY bytes before parsing. */
async function smallBody<T extends z.ZodType>(req: NextRequest, schema: T): Promise<z.infer<T>> {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) throw new HttpError(413, "Request too large.");
  const text = await req.text();
  if (text.length > MAX_BODY) throw new HttpError(413, "Request too large.");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new HttpError(400, "Request body must be JSON.");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid request.");
  return parsed.data;
}

/** A reminder linked to an account can only be changed or removed from that account's session. */
async function assertOwner(endpoint: string, userId: string | null) {
  const [row] = await db.select({ userId: schema.pushSubscriptions.userId }).from(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.endpoint, endpoint)).limit(1);
  if (row?.userId && row.userId !== userId) throw new HttpError(403, "Log in to the account this reminder belongs to.");
}

/** Turns on (or updates) the daily reminder for this browser. Signed-in users get it linked to their account. */
export const POST = route(async (req: NextRequest) => {
  if (!pushConfigured()) throw new HttpError(404, "Reminders are not available.");
  await rateLimit("push:" + clientIp(req), 20, 60 * 60_000);
  const { endpoint, keys, hour, examId } = await smallBody(req, Subscribe);
  const user = await getUser(req).catch(() => null);
  const exam = examId && EXAM_BY_ID.has(examId) ? examId : null;
  const t = schema.pushSubscriptions;
  await assertOwner(endpoint, user?.id ?? null);
  await db
    .insert(t)
    .values({ endpoint, p256dh: keys.p256dh, auth: keys.auth, userId: user?.id ?? null, examId: exam, hourIst: hour })
    .onConflictDoUpdate({
      target: t.endpoint,
      set: { p256dh: keys.p256dh, auth: keys.auth, examId: exam, hourIst: hour, failures: 0, userId: sql`coalesce(excluded.user_id, ${t.userId})` },
    });
  return json({ ok: true, hour }, 201);
});

/** Turns the reminder off for this browser. */
export const DELETE = route(async (req: NextRequest) => {
  await rateLimit("push:" + clientIp(req), 20, 60 * 60_000);
  const { endpoint } = await smallBody(req, Unsubscribe);
  await assertOwner(endpoint, (await getUser(req).catch(() => null))?.id ?? null);
  await db.delete(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.endpoint, endpoint));
  return new Response(null, { status: 204 });
});
