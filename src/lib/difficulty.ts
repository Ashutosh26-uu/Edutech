import type { Difficulty } from "./types";

export const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "hard", "very-hard"];

/** Every practice set has at least this many questions, so all four tiers fit in. */
export const MIN_SET_SIZE = 10;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: "Easy", moderate: "Moderate", hard: "Hard", "very-hard": "Very hard" };

/** Share of a set that each tier gets: sets are pitched well above exam level, 85% hard or very
 * hard and 60% of every set very hard. The one easy and one moderate question are the warm-up. */
const SHARE: Record<Difficulty, number> = { easy: 0.05, moderate: 0.1, hard: 0.25, "very-hard": 0.6 };

/**
 * How many questions of each tier go into a set of `n`. Every tier gets at least one
 * (for n ≥ 4) and the counts add up to n exactly. For 10: 1 easy, 1 moderate, 2 hard, 6 very hard;
 * for 15: 1/1/4/9; for 25: 1/3/6/15.
 */
export function tierQuota(n: number): Record<Difficulty, number> {
  const quota = Object.fromEntries(DIFFICULTIES.map((d) => [d, n >= DIFFICULTIES.length ? 1 : 0])) as Record<Difficulty, number>;
  let left = n - DIFFICULTIES.reduce((s, d) => s + quota[d], 0);
  const exact = DIFFICULTIES.map((d) => ({ d, want: Math.max(0, n * SHARE[d] - quota[d]) }));
  for (const { d, want } of exact) {
    const take = Math.min(left, Math.max(0, Math.floor(want)));
    quota[d] += take;
    left -= take;
  }
  // Leftovers go to the tiers that were rounded down the most.
  for (const { d } of exact.sort((a, b) => b.want - Math.floor(b.want) - (a.want - Math.floor(a.want)))) {
    if (left <= 0) break;
    quota[d]++;
    left--;
  }
  return quota;
}
