import type { Q } from "./topics";

/**
 * Previous-year questions (PYQs) that you add yourself, keyed by topic id (see topics.ts).
 *
 * Only add questions you have the right to publish: for example from an official paper you
 * have checked can be reused, or content you have licensed. Do not paste questions copied from
 * coaching websites or apps; that content belongs to them.
 *
 * Each entry is [question, options, answer index (0-based), explanation, difficulty, source].
 * `source` is required and is shown on a “PYQ” chip, e.g. "UPSC Prelims 2021" or
 * "SSC CGL 2023 · Tier I". PYQs are drawn first when a set is built, like exam favourites.
 *
 * Example:
 *   "polity-preamble": [
 *     ["Question text…", ["Option A", "Option B", "Option C", "Option D"], 2, "Why C is right.", "hard", "UPSC Prelims 2021"],
 *   ],
 */
export const YOUR_PYQS: Record<string, Q[]> = {};
