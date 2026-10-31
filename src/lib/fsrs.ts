/**
 * FSRS (Free Spaced Repetition Scheduler), v4.5 formulas with default parameters.
 * Each card tracks stability (days until recall drops to 90%) and difficulty (1–10).
 * Reference: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
 */

export type Grade = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export interface Memory {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  /** epoch ms of the last review; undefined for new cards */
  lastReview?: number;
  /** epoch ms when the card is next due */
  due: number;
}

const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const DECAY = -0.5;
const FACTOR = 19 / 81;
export const TARGET_RETENTION = 0.9;
const DAY = 86_400_000;
const MAX_INTERVAL = 365;

const clampD = (d: number) => Math.min(10, Math.max(1, d));

/** Probability of recalling the card after `days` days with the given stability. */
export function retrievability(days: number, stability: number): number {
  return Math.pow(1 + (FACTOR * days) / stability, DECAY);
}

function intervalDays(stability: number): number {
  const i = (stability / FACTOR) * (Math.pow(TARGET_RETENTION, 1 / DECAY) - 1);
  return Math.min(MAX_INTERVAL, Math.max(1, Math.round(i)));
}

const initDifficulty = (g: Grade) => clampD(W[4] - (g - 3) * W[5]);

function nextDifficulty(d: number, g: Grade): number {
  const next = d - W[6] * (g - 3);
  return clampD(W[7] * initDifficulty(4) + (1 - W[7]) * next); // mean reversion
}

function recallStability(d: number, s: number, r: number, g: Grade): number {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  return s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1);
}

function forgetStability(d: number, s: number, r: number): number {
  return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
}

export function newMemory(now = Date.now()): Memory {
  return { stability: 0, difficulty: 0, reps: 0, lapses: 0, due: now };
}

/** Returns the card's memory state after answering with `grade` at time `now`. */
export function review(m: Memory, grade: Grade, now = Date.now()): Memory {
  let stability: number;
  let difficulty: number;
  if (m.lastReview === undefined || m.reps === 0) {
    stability = W[grade - 1];
    difficulty = initDifficulty(grade);
  } else {
    const elapsed = Math.max(0, (now - m.lastReview) / DAY);
    const r = retrievability(elapsed, m.stability);
    difficulty = nextDifficulty(m.difficulty, grade);
    stability = grade === 1 ? forgetStability(m.difficulty, m.stability, r) : recallStability(m.difficulty, m.stability, r, grade);
  }
  // "Again" re-shows the card in 10 minutes; otherwise schedule by stability.
  const due = grade === 1 ? now + 10 * 60_000 : now + intervalDays(stability) * DAY;
  return { stability, difficulty, reps: m.reps + 1, lapses: m.lapses + (grade === 1 && m.reps > 0 ? 1 : 0), lastReview: now, due };
}

/** Human-readable preview of when each grade would schedule the card next. */
export function previewIntervals(m: Memory, now = Date.now()): Record<Grade, string> {
  const fmt = (due: number) => {
    const mins = Math.round((due - now) / 60_000);
    if (mins < 60) return `${mins}m`;
    const days = Math.round((due - now) / DAY);
    return days < 31 ? `${days}d` : days < 365 ? `${Math.round(days / 30)}mo` : `${(days / 365).toFixed(1)}y`;
  };
  return { 1: fmt(review(m, 1, now).due), 2: fmt(review(m, 2, now).due), 3: fmt(review(m, 3, now).due), 4: fmt(review(m, 4, now).due) };
}
