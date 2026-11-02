import type { Difficulty } from "./types";

export const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "hard", "very-hard"];

/** Every practice set has at least this many questions, so all four tiers fit in. */
export const MIN_SET_SIZE = 10;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: "Easy", moderate: "Moderate", hard: "Hard", "very-hard": "Very hard" };

/** Share of a set that each tier gets; the mix skews towards the harder end a little less than half. */
const SHARE: Record<Difficulty, number> = { easy: 0.3, moderate: 0.3, hard: 0.2, "very-hard": 0.2 };

/**
 * How many questions of each tier go into a set of `n`. Every tier gets at least one
 * (for n ≥ 4) and the counts add up to n exactly. For 10: 3 easy, 3 moderate, 2 hard, 2 very hard.
 */
export function tierQuota(n: number): Record<Difficulty, number> {
  const quota = Object.fromEntries(DIFFICULTIES.map((d) => [d, n >= DIFFICULTIES.length ? 1 : 0])) as Record<Difficulty, number>;
  let left = n - DIFFICULTIES.reduce((s, d) => s + quota[d], 0);
  const exact = DIFFICULTIES.map((d) => ({ d, want: n * SHARE[d] - quota[d] }));
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
