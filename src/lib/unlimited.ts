import { DIFFICULTIES, DIFFICULTY_LABEL } from "./difficulty";
import type { Difficulty } from "./types";

/**
 * Unlimited practice: sets made only of generated questions (see generators.ts), so a topic never
 * runs out. This file is deliberately light (no generator code), so pages that only link to the
 * mode do not download the generators. check:questions keeps the list in step with the generators.
 */
export const UNLIMITED_TOPIC_IDS: readonly string[] = [
  "quant-percentage",
  "quant-profit-loss",
  "quant-simple-interest",
  "quant-ci",
  "quant-ratio",
  "quant-average",
  "quant-time-work",
  "quant-tsd",
  "quant-number-system",
  "quant-mensuration",
  "quant-algebra-geometry",
  "quant-data-interpretation",
];

export const canUnlimited = (topicId: string) => UNLIMITED_TOPIC_IDS.includes(topicId);

/** One tier only, or "mixed": the usual set that starts easy and gets harder. */
export type UnlimitedLevel = Difficulty | "mixed";
export const UNLIMITED_LEVELS: readonly UnlimitedLevel[] = ["mixed", ...DIFFICULTIES];
export const UNLIMITED_LEVEL_LABEL: Record<UnlimitedLevel, string> = { mixed: "Mixed", ...DIFFICULTY_LABEL };
export const isUnlimitedLevel = (x: unknown): x is UnlimitedLevel => typeof x === "string" && (UNLIMITED_LEVELS as readonly string[]).includes(x);

/** Questions per unlimited set. */
export const UNLIMITED_SET_SIZE = 10;

/** The one-line promise shown beside every "Unlimited practice" button. */
export const UNLIMITED_HINT = "New numbers every time · also in हिंदी";

/** Link to the unlimited mode for one or more topics; topics without a generator are left out. */
export function unlimitedHref(topicIds: string | readonly string[], level?: UnlimitedLevel): string {
  const ids = (typeof topicIds === "string" ? [topicIds] : topicIds).filter(canUnlimited);
  return `/practice?topics=${ids.join(",")}&unlimited=1${level && level !== "mixed" ? `&level=${level}` : ""}`;
}

/** A short fingerprint of a question's text, for remembering which questions a session has already shown. */
export function questionKey(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `${(h >>> 0).toString(36)}.${text.length.toString(36)}`;
}

/** One tab's unlimited-practice session for a set of topics: the running tally and what has been shown. */
export interface UnlimitedSession {
  level: UnlimitedLevel;
  sets: number;
  correct: number;
  attempted: number;
  /** questionKey() of every question shown so far, oldest first. */
  seen: string[];
}

const SESSION_PREFIX = "studyclip:unlimited:";
const MAX_SEEN = 4000;

function sessionStore(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** The session kept in this tab for these topics (so a refresh keeps the tally and never repeats a question), or null. */
export function readUnlimitedSession(topicsKey: string): UnlimitedSession | null {
  try {
    const s = JSON.parse(sessionStore()?.getItem(SESSION_PREFIX + topicsKey) ?? "null") as UnlimitedSession | null;
    const count = (x: unknown) => Number.isInteger(x) && (x as number) >= 0;
    if (!s || !isUnlimitedLevel(s.level) || !count(s.sets) || !count(s.correct) || !count(s.attempted) || !Array.isArray(s.seen)) return null;
    return { level: s.level, sets: s.sets, correct: s.correct, attempted: s.attempted, seen: s.seen.filter((x) => typeof x === "string") };
  } catch {
    return null;
  }
}

export function writeUnlimitedSession(topicsKey: string, s: UnlimitedSession) {
  try {
    sessionStore()?.setItem(SESSION_PREFIX + topicsKey, JSON.stringify({ ...s, seen: s.seen.slice(-MAX_SEEN) }));
  } catch {
    /* storage full or blocked: the session simply lives in memory */
  }
}
