import "server-only";
import { and, eq, gte, inArray, isNull, ne, or, sql } from "drizzle-orm";
import webpush from "web-push";
import { db, schema } from "@/db";
import { EXAM_BY_ID } from "@/data/exams";
import { sendSlot } from "@/lib/reminders";

const t = schema.pushSubscriptions;

/** Rows claimed per database round trip, and pushes in flight at once. */
const CHUNK = 500;
const PARALLEL = 50;
/** A subscription is dropped after this many failed sends in a row. */
const MAX_FAILURES = 5;
/** Stop claiming new rows after this long so the request ends inside the function timeout; the caller calls again. */
const TIME_BUDGET_MS = 7_000;

export function pushConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

let vapidSet = false;
function setVapid() {
  if (vapidSet) return;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:support@example.com", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
  vapidSet = true;
}

function payload(examId: string | null): string {
  const exam = examId ? EXAM_BY_ID.get(examId) : undefined;
  return JSON.stringify({
    title: "StudyClip",
    body: exam ? `Today's ${exam.name} question is ready. 10 minutes keeps your streak going 🔥` : "Today's question is ready. 10 minutes keeps your streak going 🔥",
    url: "/today",
  });
}

export interface SendResult {
  hour: number;
  day: string;
  claimed: number;
  sent: number;
  removed: number;
  failed: number;
  /** True when the time budget ran out with rows possibly still due; call again. */
  more: boolean;
}

/**
 * Sends today's reminder to every subscription due this India hour. Each row is marked sent
 * (last_sent_on = today) in the same statement that claims it, before any push goes out, so a
 * retried or overlapping run never sends twice. Expired endpoints (404/410) are deleted; other
 * errors count as failures and the row is deleted after MAX_FAILURES in a row.
 */
export async function sendDueReminders(now = Date.now()): Promise<SendResult> {
  setVapid();
  const { hour, day } = sendSlot(now);
  const started = Date.now();
  const out: SendResult = { hour, day, claimed: 0, sent: 0, removed: 0, failed: 0, more: false };

  for (;;) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      out.more = true;
      break;
    }
    const due = db
      .select({ id: t.id })
      .from(t)
      .where(and(eq(t.hourIst, hour), or(isNull(t.lastSentOn), ne(t.lastSentOn, day))))
      .limit(CHUNK)
      .for("update", { skipLocked: true });
    const rows = await db
      .update(t)
      .set({ lastSentOn: day })
      .where(inArray(t.id, due))
      .returning({ id: t.id, endpoint: t.endpoint, p256dh: t.p256dh, auth: t.auth, examId: t.examId, failures: t.failures });
    if (!rows.length) break;
    out.claimed += rows.length;

    const gone: string[] = [];
    const failed: string[] = [];
    const ok: string[] = [];
    for (let i = 0; i < rows.length; i += PARALLEL) {
      await Promise.all(
        rows.slice(i, i + PARALLEL).map(async (r) => {
          try {
            await webpush.sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, payload(r.examId), { TTL: 4 * 3600, urgency: "normal", topic: "daily-reminder" });
            if (r.failures > 0) ok.push(r.id);
            out.sent++;
          } catch (e) {
            const status = (e as { statusCode?: number }).statusCode;
            if (status === 404 || status === 410) gone.push(r.id);
            else failed.push(r.id);
          }
        }),
      );
    }
    if (gone.length) await db.delete(t).where(inArray(t.id, gone));
    if (ok.length) await db.update(t).set({ failures: 0 }).where(inArray(t.id, ok));
    if (failed.length) {
      await db.update(t).set({ failures: sql`${t.failures} + 1` }).where(inArray(t.id, failed));
      const dropped = await db.delete(t).where(and(inArray(t.id, failed), gte(t.failures, MAX_FAILURES))).returning({ id: t.id });
      out.removed += dropped.length;
    }
    out.removed += gone.length;
    out.failed += failed.length;
    if (rows.length < CHUNK) break;
  }
  return out;
}
