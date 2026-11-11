// Pure maths behind the deeper mock analysis, the exam-mode palette and the error coach.
// No browser APIs here, so scripts/test-analysis.mjs can run it under Node.
import type { Difficulty } from "./types";

/** One answered (or skipped) question of a test, as the analysis needs it. */
export interface AnalysisItem {
  chosen: number | null;
  correct: boolean;
  /** Seconds spent on the question, on timed tests. */
  seconds?: number;
  difficulty?: Difficulty;
}

export interface AnalysisSection {
  name: string;
  from: number;
  count: number;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const round2 = (x: number) => Math.round(x * 100) / 100;
const isWrong = (r: AnalysisItem) => r.chosen !== null && !r.correct;

/** Marks for a set of answers: +marks per correct, −negative×marks per wrong, 0 for skipped. */
export function scoreOf(items: AnalysisItem[], negative: number, marks = 1): number {
  const c = items.filter((r) => r.correct).length;
  const w = items.filter(isWrong).length;
  return round2((c - w * negative) * marks);
}

/** Average seconds per question over the whole paper (the same figure the time analysis shows). */
export function averageSeconds(items: AnalysisItem[]): number {
  return items.length ? sum(items.map((r) => r.seconds ?? 0)) / items.length : 0;
}

export interface AttemptStrategy {
  /** Average seconds per question. */
  avg: number;
  /** Wrong answers that took more than `factor`× the average: time better spent elsewhere. */
  shouldSkip: number[];
  /** Seconds that went into the `shouldSkip` questions. */
  wastedSeconds: number;
  /** Easy or moderate questions left blank: marks that were there for the taking. */
  missedEasy: number[];
}

export function attemptStrategy(items: AnalysisItem[], factor = 2): AttemptStrategy {
  const avg = averageSeconds(items);
  const shouldSkip = avg > 0 ? items.flatMap((r, i) => (isWrong(r) && (r.seconds ?? 0) > factor * avg ? [i] : [])) : [];
  const missedEasy = items.flatMap((r, i) => (r.chosen === null && (r.difficulty === "easy" || r.difficulty === "moderate") ? [i] : []));
  return { avg, shouldSkip, wastedSeconds: sum(shouldSkip.map((i) => items[i].seconds ?? 0)), missedEasy };
}

export interface GuessCost {
  /** Wrong answers given in under `fastSec` seconds: likely guesses. */
  fastWrong: number[];
  /** Marks those guesses lost to negative marking. */
  cost: number;
  score: number;
  /** The score had those questions been left blank. */
  scoreWithout: number;
}

/** "If you had skipped the wrong guesses": the negative-marking cost of quick wrong answers. */
export function guessCost(items: AnalysisItem[], negative: number, marks = 1, fastSec = 15): GuessCost {
  const fastWrong = items.flatMap((r, i) => (isWrong(r) && r.seconds !== undefined && r.seconds < fastSec ? [i] : []));
  const cost = round2(fastWrong.length * negative * marks);
  const score = scoreOf(items, negative, marks);
  return { fastWrong, cost, score, scoreWithout: round2(score + cost) };
}

export interface SectionTimeRow {
  name: string;
  score: number;
  max: number;
  seconds: number;
  /** Marks earned per minute spent in the section (0 when no time was spent). */
  perMin: number;
}

/** Per-section time vs marks, with a one-line suggestion on which section to open with. */
export function sectionTimes(items: AnalysisItem[], sections: AnalysisSection[], negative: number, marks = 1): { rows: SectionTimeRow[]; suggestion: string } {
  const rows = sections.map((s) => {
    const rs = items.slice(s.from, s.from + s.count);
    const score = scoreOf(rs, negative, marks);
    const seconds = sum(rs.map((r) => r.seconds ?? 0));
    return { name: s.name, score, max: rs.length * marks, seconds, perMin: seconds > 0 ? round2(score / (seconds / 60)) : 0 };
  });
  const timed = rows.filter((r) => r.seconds > 0);
  if (timed.length < 2) return { rows, suggestion: "" };
  const best = timed.reduce((a, b) => (b.perMin > a.perMin ? b : a));
  const worst = timed.reduce((a, b) => (b.perMin < a.perMin ? b : a));
  const suggestion =
    best.perMin <= 0
      ? "No section paid off for the time spent: answer only the questions you are sure of on the first pass."
      : `Start with ${best.name} next time: highest marks per minute (${best.perMin}).${worst !== best && worst.seconds > best.seconds ? ` ${worst.name} took the most time for the least return.` : ""}`;
  return { rows, suggestion };
}

// ---------- Exam-mode palette ----------

export type PaletteState = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";
export const PALETTE_STATES: PaletteState[] = ["answered", "not-answered", "not-visited", "marked", "answered-marked"];
export const PALETTE_LABEL: Record<PaletteState, string> = {
  "not-visited": "Not visited",
  "not-answered": "Not answered",
  answered: "Answered",
  marked: "Marked for review",
  "answered-marked": "Answered & marked for review",
};

export function paletteState(visited: boolean, answered: boolean, marked: boolean): PaletteState {
  if (marked) return answered ? "answered-marked" : "marked";
  if (answered) return "answered";
  return visited ? "not-answered" : "not-visited";
}

export function paletteCounts(states: PaletteState[]): Record<PaletteState, number> {
  const out: Record<PaletteState, number> = { "not-visited": 0, "not-answered": 0, answered: 0, marked: 0, "answered-marked": 0 };
  for (const s of states) out[s]++;
  return out;
}

// ---------- Error coach ----------

export type MistakeTag = "silly" | "concept" | "time" | "misread" | "guess";
export const MISTAKE_TAGS: MistakeTag[] = ["silly", "concept", "time", "misread", "guess"];
export const MISTAKE_LABEL: Record<MistakeTag, string> = {
  silly: "Silly mistake",
  concept: "Didn’t know the concept",
  time: "Ran out of time",
  misread: "Misread the question",
  guess: "Guessed",
};
const MISTAKE_NOUN: Record<MistakeTag, string> = {
  silly: "silly mistakes",
  concept: "concept gaps",
  time: "time pressure",
  misread: "misreading the question",
  guess: "guesses",
};
export const MISTAKE_TIP: Record<MistakeTag, string> = {
  silly: "slow down on the last step: recheck the arithmetic and the option you mark before moving on.",
  concept: "revise the topic before doing more questions: read the explanation and turn it into a flashcard.",
  time: "practise timed sets and move on from any question that takes over twice your average.",
  misread: "underline NOT, EXCEPT, units and what is actually asked before you start solving.",
  guess: "guess only when you can rule out two options; blind guesses lose marks to negative marking.",
};

export interface MistakePattern {
  counts: Record<MistakeTag, number>;
  total: number;
  dominant: MistakeTag | null;
  /** Share of the dominant category, 0–100. */
  pct: number;
  /** e.g. "38% of your mistakes are silly mistakes: slow down on the last step…" */
  line: string;
}

export function mistakePattern(tags: MistakeTag[]): MistakePattern {
  const counts: Record<MistakeTag, number> = { silly: 0, concept: 0, time: 0, misread: 0, guess: 0 };
  for (const t of tags) if (t in counts) counts[t]++;
  const total = sum(Object.values(counts));
  if (!total) return { counts, total, dominant: null, pct: 0, line: "" };
  // Ties go to the earlier category in MISTAKE_TAGS order.
  const dominant = MISTAKE_TAGS.reduce((a, b) => (counts[b] > counts[a] ? b : a));
  const pct = Math.round((counts[dominant] / total) * 100);
  const verb = dominant === "silly" || dominant === "guess" || dominant === "concept" ? "are" : "come from";
  return { counts, total, dominant, pct, line: `${pct}% of your mistakes ${verb} ${MISTAKE_NOUN[dominant]}: ${MISTAKE_TIP[dominant]}` };
}
