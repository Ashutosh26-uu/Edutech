import type { TopicStat } from "./storage";

/**
 * Topic-level spaced revision. Every topic the student has marked Done/Revised or has practised
 * gets a next-revision date: 1, 3, 7, 15 then 30 days after the last practice or revision.
 * A revision session with at least 70% accuracy moves the topic one gap further out; under 50%
 * sends it back to the shortest gap; anything in between keeps the same gap.
 *
 * Accuracy for a session is measured from the topic's running totals: each entry keeps a
 * snapshot of `attempted` / `correct` taken when it was last scheduled, and the difference is
 * what was answered since. Everything here is pure, so it can be tested in Node.
 */

export type TopicStatus = "not-started" | "studying" | "done" | "revised";

export interface StatusEntry {
  s: TopicStatus;
  /** When the status was last changed (epoch ms) */
  at: number;
}

export interface RevisionEntry {
  /** Index into GAPS */
  step: number;
  /** Last practice or revision (epoch ms) */
  last: number;
  /** Running totals when this entry was last scheduled */
  attempted: number;
  correct: number;
}

export type RevisionPlan = Record<string, RevisionEntry>;

export const GAPS = [1, 3, 7, 15, 30] as const;
/** Fewer new answers than this are not judged yet: they wait to be combined with the next ones. */
export const MIN_SESSION = 3;
export const ADVANCE_AT = 0.7;
export const RESET_BELOW = 0.5;

const DAY = 86_400_000;

/** Local midnight of the day containing `t`. */
export function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Calendar days later, at local midnight (safe across daylight-saving changes). */
function addDaysAt(t: number, days: number): number {
  const d = new Date(startOfDay(t));
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/** The gap step after a session with this accuracy (0..1). */
export function nextStep(step: number, accuracy: number): number {
  if (accuracy >= ADVANCE_AT) return Math.min(GAPS.length - 1, step + 1);
  if (accuracy < RESET_BELOW) return 0;
  return step;
}

/** Local midnight of the day the topic is due for revision. */
export function dueAt(e: RevisionEntry): number {
  return addDaysAt(e.last, GAPS[Math.min(e.step, GAPS.length - 1)]);
}

/**
 * Brings the plan up to date with the latest practice totals and statuses. Returns the same
 * object when nothing changed, so callers can skip saving.
 */
export function syncPlan(plan: RevisionPlan, stats: Record<string, TopicStat>, statuses: Record<string, StatusEntry>, now = Date.now()): RevisionPlan {
  let out = plan;
  const set = (id: string, e: RevisionEntry | undefined) => {
    if (out === plan) out = { ...plan };
    if (e) out[id] = e;
    else delete out[id];
  };
  const ids = new Set([...Object.keys(plan), ...Object.keys(stats), ...Object.keys(statuses)]);
  for (const id of ids) {
    const e = plan[id];
    const st = stats[id];
    const status = statuses[id];
    const attempted = st?.attempted ?? 0;
    const correct = st?.correct ?? 0;
    const finished = status?.s === "done" || status?.s === "revised";

    if (!e) {
      if (attempted > 0) set(id, { step: 0, last: st?.lastPracticed ?? now, attempted, correct });
      else if (finished) set(id, { step: 0, last: status.at, attempted: 0, correct: 0 });
      continue;
    }
    // Reset to "not started" with nothing practised: drop it from the plan.
    if (status?.s === "not-started" && attempted === 0) {
      set(id, undefined);
      continue;
    }
    const dA = attempted - e.attempted;
    if (dA < 0) {
      // Progress was cleared: start the topic over from today's totals.
      set(id, { step: 0, last: st?.lastPracticed ?? now, attempted, correct });
      continue;
    }
    if (dA === 0) continue;
    const last = Math.max(e.last, st?.lastPracticed ?? now);
    if (dA < MIN_SESSION) {
      if (last !== e.last) set(id, { ...e, last });
      continue;
    }
    set(id, { step: nextStep(e.step, (correct - e.correct) / dA), last, attempted, correct });
  }
  return out;
}

/** The student says they revised a topic (notes, re-reading) without answering questions: one gap further. */
export function markRevised(plan: RevisionPlan, id: string, stat: TopicStat | undefined, now = Date.now()): RevisionPlan {
  const e = plan[id];
  const step = e ? Math.min(GAPS.length - 1, e.step + 1) : 1;
  return { ...plan, [id]: { step, last: now, attempted: stat?.attempted ?? e?.attempted ?? 0, correct: stat?.correct ?? e?.correct ?? 0 } };
}

export interface DueTopic {
  id: string;
  due: number;
  /** Whole days past the due day (0 = due today) */
  overdue: number;
  step: number;
}

/** Topics due today or earlier, most overdue first; optionally only the given topic ids. */
export function dueTopics(plan: RevisionPlan, now = Date.now(), only?: Iterable<string>): DueTopic[] {
  const allowed = only ? new Set(only) : null;
  const today = startOfDay(now);
  return Object.entries(plan)
    .filter(([id]) => !allowed || allowed.has(id))
    .map(([id, e]) => ({ id, due: dueAt(e), step: e.step, overdue: Math.round((today - dueAt(e)) / DAY) }))
    .filter((d) => d.due <= today)
    .sort((a, b) => a.due - b.due || a.step - b.step || a.id.localeCompare(b.id));
}

/** Upcoming revisions (after today), soonest first. */
export function upcomingTopics(plan: RevisionPlan, now = Date.now(), only?: Iterable<string>): DueTopic[] {
  const allowed = only ? new Set(only) : null;
  const today = startOfDay(now);
  return Object.entries(plan)
    .filter(([id]) => !allowed || allowed.has(id))
    .map(([id, e]) => ({ id, due: dueAt(e), step: e.step, overdue: Math.round((today - dueAt(e)) / DAY) }))
    .filter((d) => d.due > today)
    .sort((a, b) => a.due - b.due || a.id.localeCompare(b.id));
}

// ---------- Browser storage (wrapped: private mode or full storage just means nothing is kept) ----------

export const PLAN_KEY = "studyclip:revision:v1";
export const statusKey = (examId: string) => `studyclip:tracker:${examId}`;
export const PLAN_EVENT = "studyclip:revision";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : null;
    return v && typeof v === "object" ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(PLAN_EVENT));
  } catch {
    /* not kept */
  }
}

export const loadPlan = (): RevisionPlan => read<RevisionPlan>(PLAN_KEY, {});
export const savePlan = (p: RevisionPlan) => write(PLAN_KEY, p);
export const loadStatuses = (examId: string): Record<string, StatusEntry> => read<Record<string, StatusEntry>>(statusKey(examId), {});
export const saveStatuses = (examId: string, s: Record<string, StatusEntry>) => write(statusKey(examId), s);
