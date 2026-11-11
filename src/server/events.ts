import "server-only";
import { desc, gte, sql } from "drizzle-orm";
import { db, schema } from "@/db";

const IST_MS = 330 * 60_000;

/** Today's date in Asia/Kolkata as YYYY-MM-DD, `back` days ago. */
export function istDay(back = 0, now = Date.now()) {
  return new Date(now + IST_MS - back * 24 * 60 * 60_000).toISOString().slice(0, 10);
}

const UUIDISH = /^[0-9a-f]{8}-[0-9a-f-]{20,}$/i;

/**
 * Keeps the counter table small and free of personal data: no query string or hash, ids
 * replaced by ":id", at most four segments, and only plain URL characters. Null if unusable.
 */
export function cleanPath(raw: string): string | null {
  const p = raw.split(/[?#]/)[0].toLowerCase();
  if (!p.startsWith("/") || p.length > 200) return null;
  const segs = p.split("/").filter(Boolean);
  if (segs.length > 4 || segs.some((s) => !/^[a-z0-9._-]{1,60}$/.test(s))) return null;
  const out = "/" + segs.map((s) => (UUIDISH.test(s) || /^\d{4,}$/.test(s) ? ":id" : s)).join("/");
  return out;
}

export async function countEvent(name: string, path: string) {
  await db
    .insert(schema.eventCounts)
    .values({ day: istDay(), name, path, count: 1 })
    .onConflictDoUpdate({ target: [schema.eventCounts.day, schema.eventCounts.name, schema.eventCounts.path], set: { count: sql`${schema.eventCounts.count} + 1` } });
}

/** Views per day, top pages and event totals over the last `days` days (today included). */
export async function statsFor(days: number) {
  const since = istDay(days - 1);
  const e = schema.eventCounts;
  const total = sql<number>`sum(${e.count})`.mapWith(Number);
  const [perDay, topPages, events] = await Promise.all([
    db.select({ day: e.day, views: total }).from(e).where(sql`${e.day} >= ${since} and ${e.name} = 'page_view'`).groupBy(e.day).orderBy(e.day),
    db.select({ path: e.path, views: total }).from(e).where(sql`${e.day} >= ${since} and ${e.name} = 'page_view'`).groupBy(e.path).orderBy(desc(total)).limit(25),
    db.select({ name: e.name, count: total }).from(e).where(gte(e.day, since)).groupBy(e.name).orderBy(desc(total)),
  ]);
  // Fill in days with no views so the chart has one bar per day.
  const byDay = new Map(perDay.map((d) => [d.day, d.views]));
  const series = Array.from({ length: days }, (_, i) => {
    const day = istDay(days - 1 - i);
    return { day, views: byDay.get(day) ?? 0 };
  });
  return { since, days: series, topPages, events };
}
