import { EXAM_BY_ID } from "@/data/exams";
import { mockPlan } from "@/data/patterns";
import type { Exam } from "./types";

/**
 * The Sunday All-India Mock: one shared paper per exam per week, free, open on Sunday from
 * 10 am to 10 pm India time. Weeks are ISO weeks (Monday to Sunday) on the India calendar, so a
 * week's mock is on its last day. Everything here is plain date maths, safe in the browser,
 * on the server and in scripts.
 */

/** Exams that get a Sunday mock. Each needs a paper pattern (data/patterns.ts). */
export const WEEKLY_EXAM_IDS = ["ssc-cgl", "ibps-po", "rrb-ntpc", "upsc-prelims"];
/** Opening and closing hour on Sunday, India time (24-hour clock). */
export const WEEKLY_OPEN_HOUR = 10;
export const WEEKLY_CLOSE_HOUR = 22;

const IST_OFFSET = 330 * 60_000; // UTC+5:30, no daylight saving
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export const WEEKLY_EXAMS: Exam[] = WEEKLY_EXAM_IDS.flatMap((id) => {
  const e = EXAM_BY_ID.get(id);
  return e && mockPlan(e) ? [e] : [];
});
export const isWeeklyExam = (examId: string) => WEEKLY_EXAMS.some((e) => e.id === examId);

export type WeeklyStatus = "upcoming" | "live" | "closed";

export interface WeekWindow {
  /** ISO week on the India calendar, e.g. "2026-W46". */
  week: string;
  opensAt: number;
  closesAt: number;
}

/** The ISO week (India time) that an instant falls in. */
export function istWeek(at: number): string {
  const d = new Date(at + IST_OFFSET); // its UTC fields read as India wall-clock time
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  const thursday = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day + 3);
  const year = new Date(thursday).getUTCFullYear();
  const week = 1 + Math.floor((thursday - Date.UTC(year, 0, 1)) / (7 * DAY));
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Sunday's opening and closing instants for an ISO week. */
export function windowOf(week: string): WeekWindow {
  const m = /^(\d{4})-W(\d{2})$/.exec(week);
  if (!m) throw new Error(`Bad week: ${week}`);
  const year = Number(m[1]);
  const jan4 = Date.UTC(year, 0, 4); // always in week 1
  const monday = jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * DAY + (Number(m[2]) - 1) * 7 * DAY;
  const sunday = monday + 6 * DAY - IST_OFFSET; // midnight India time, as a real instant
  return { week, opensAt: sunday + WEEKLY_OPEN_HOUR * HOUR, closesAt: sunday + WEEKLY_CLOSE_HOUR * HOUR };
}

export const shiftWeek = (week: string, by: number) => istWeek(windowOf(week).opensAt + by * 7 * DAY);

export const statusAt = (w: WeekWindow, now: number): WeeklyStatus => (now < w.opensAt ? "upcoming" : now < w.closesAt ? "live" : "closed");

/** The mock to show next: this week's until it closes, then next week's. */
export function nextWindow(now: number): WeekWindow {
  const w = windowOf(istWeek(now));
  return now < w.closesAt ? w : windowOf(shiftWeek(w.week, 1));
}

/** The most recent mock that has closed: results and the final leaderboard come from it. */
export function lastClosedWindow(now: number): WeekWindow {
  const w = windowOf(istWeek(now));
  return now >= w.closesAt ? w : windowOf(shiftWeek(w.week, -1));
}

/** The window a weekly attempt started in belongs to the week of its start time. */
export const windowAt = (at: number) => windowOf(istWeek(at));

/** Seed for a week's paper: the same week and exam always give the same paper. */
export const weeklySeed = (week: string, examId: string) => `${week}:${examId}`;

/** 32-bit FNV-1a hash of a string. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A seeded random number generator (mulberry32) in [0, 1). */
export function seededRandom(seed: string): () => number {
  let a = hashString(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** "Sun 16 Nov, 10:00 am" in India time. */
export const istDateTime = (at: number) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(at);

/** "2d 4h", "3h 12m", "4m 05s": time left until an instant. */
export function countdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}
