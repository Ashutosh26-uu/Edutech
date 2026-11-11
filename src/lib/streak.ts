/**
 * Streak arithmetic, kept free of storage and the DOM so it can be checked from a script
 * (scripts/test-habits.mjs). Days are "YYYY-MM-DD" keys; all date maths is done in UTC on
 * those keys, so the result never depends on the machine's time zone.
 */

export const FREEZE_EVERY = 7;
export const MAX_FREEZES = 2;

const DAY = 86_400_000;

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * DAY).toISOString().slice(0, 10);
}

/** Today's date in India (Asia/Kolkata, UTC+5:30, no daylight saving), as YYYY-MM-DD. */
export function istDayKey(now = Date.now()): string {
  return new Date(now + 330 * 60_000).toISOString().slice(0, 10);
}

export interface StreakInfo {
  /** Days in a row with any XP, ending today (or yesterday if today has none yet). Frozen days keep it alive but do not add to it. */
  count: number;
  /** Longest run ever seen, by the same rule. */
  best: number;
  /** Freezes held now (0..MAX_FREEZES). */
  freezes: number;
  /** Every missed day that a freeze covered, oldest first. */
  frozen: string[];
  /** Yesterday was missed and a freeze will cover it as soon as anything is studied today. */
  pendingFreeze: boolean;
}

/**
 * Replays the whole history day by day. A run of active days earns one freeze at every
 * FREEZE_EVERY-day milestone (held up to MAX_FREEZES). A single missed day between two active
 * days is bridged by spending a freeze; two missed days in a row end the run and spend nothing.
 * Days in `recorded` were frozen before and stay frozen, so a past decision never changes.
 */
export function computeStreak(activity: Record<string, number>, recorded: readonly string[], todayKey: string): StreakInfo {
  const active = (d: string) => (activity[d] ?? 0) > 0;
  const was = new Set(recorded);
  const keys = Object.keys(activity).filter(active).sort();
  const out: StreakInfo = { count: 0, best: 0, freezes: 0, frozen: [], pendingFreeze: false };
  if (!keys.length || keys[0] > todayKey) return out;

  let run = 0;
  for (let d = keys[0]; d <= todayKey; d = addDays(d, 1)) {
    if (active(d)) {
      run++;
      out.best = Math.max(out.best, run);
      if (run % FREEZE_EVERY === 0) out.freezes = Math.min(MAX_FREEZES, out.freezes + 1);
      continue;
    }
    if (d === todayKey) break; // today is not over yet
    const next = addDays(d, 1);
    if (run > 0 && was.has(d)) {
      out.freezes = Math.max(0, out.freezes - 1);
      out.frozen.push(d);
      continue;
    }
    if (run > 0 && out.freezes > 0 && !was.has(addDays(d, -1)) && !out.frozen.includes(addDays(d, -1))) {
      if (active(next)) {
        out.freezes--;
        out.frozen.push(d);
        continue;
      }
      if (next === todayKey) {
        out.pendingFreeze = true;
        continue;
      }
    }
    run = 0;
  }
  out.count = run;
  return out;
}

/** Consecutive days present in `days`, ending today or yesterday. */
export function consecutiveDays(days: Iterable<string>, todayKey: string): number {
  const set = new Set(days);
  let d = set.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let n = 0;
  while (set.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/** Longest run of consecutive days in `days`. */
export function longestRun(days: Iterable<string>): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}
