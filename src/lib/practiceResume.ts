"use client";

import type { MCQ } from "./types";

/**
 * Untimed practice sets survive an accidental refresh or tab close: the questions, answers and
 * position are kept in sessionStorage under the practice URL for two hours, and cleared when the
 * set is finished. Timed tests are not kept here (the server keeps those).
 */

const PREFIX = "studyclip:resume:";
export const RESUME_TTL_MS = 2 * 60 * 60 * 1000;

export interface QuizProgress {
  idx: number;
  chosen: (number | null)[];
  revealed: boolean[];
  visited: boolean[];
}

export interface SavedSet {
  at: number;
  questions: MCQ[];
  progress: QuizProgress;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** True when the saved progress fits the questions it was saved with. */
function valid(s: SavedSet | null): s is SavedSet {
  if (!s || typeof s.at !== "number" || !Array.isArray(s.questions) || !s.questions.length || !s.progress) return false;
  const n = s.questions.length;
  const p = s.progress;
  return Number.isInteger(p.idx) && p.idx >= 0 && p.idx < n && p.chosen?.length === n && p.revealed?.length === n && p.visited?.length === n;
}

export function readResume(key: string, now = Date.now()): SavedSet | null {
  const st = storage();
  if (!st) return null;
  try {
    const s = JSON.parse(st.getItem(PREFIX + key) ?? "null") as SavedSet | null;
    if (valid(s) && now - s.at < RESUME_TTL_MS) return s;
    st.removeItem(PREFIX + key);
  } catch {
    /* unreadable: start fresh */
  }
  return null;
}

export function writeResume(key: string, questions: MCQ[], progress: QuizProgress) {
  const st = storage();
  if (!st) return;
  // Nothing done yet: nothing worth resuming.
  if (progress.idx === 0 && progress.chosen.every((c) => c === null)) return clearResume(key);
  try {
    st.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), questions, progress } satisfies SavedSet));
  } catch {
    /* storage full or blocked: the set just won't resume */
  }
}

export function clearResume(key: string) {
  try {
    storage()?.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
