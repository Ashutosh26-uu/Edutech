"use client";

import { newMemory, review as fsrsReview, type Grade, type Memory } from "./fsrs";

/**
 * Per-browser progress storage. Prototype only: a real deployment would keep this in a
 * database tied to the user's account. Every write fires a `studyclip:update` event so
 * live widgets (XP, streak, due counts) refresh.
 */

export interface SavedVideo {
  videoId: string;
  title: string;
  chapters: number;
  savedAt: number;
}

export interface TopicStat {
  attempted: number;
  correct: number;
  lastPracticed?: number;
}

export interface MockResult {
  examId: string;
  score: number;
  maxScore: number;
  correct: number;
  wrong: number;
  skipped: number;
  takenAt: number;
}

export interface Flashcard extends Memory {
  id: string;
  front: string;
  back: string;
  topicId?: string;
  /** e.g. "Fundamental Rights" or a video title */
  source: string;
  videoId?: string;
  timestamp?: number;
  created: number;
}

export interface VideoNote {
  id: string;
  t: number;
  text: string;
}

interface Store {
  videos: SavedVideo[];
  topics: Record<string, TopicStat>;
  mocks: MockResult[];
  examId?: string;
  examDate?: string; // YYYY-MM-DD
  cards: Record<string, Flashcard>;
  xp: number;
  /** XP earned per local day, keyed YYYY-MM-DD */
  activity: Record<string, number>;
  dailyGoal: number;
  videoNotes: Record<string, VideoNote[]>;
  /** What was done each day: questions answered, cards reviewed, videos, mock tests */
  counts: Record<string, DayCounts>;
}

export interface DayCounts {
  questions: number;
  reviews: number;
  videos: number;
  mocks: number;
}

const KEY = "studyclip:v1";
const EMPTY: Store = { videos: [], topics: {}, mocks: [], cards: {}, xp: 0, activity: {}, dailyGoal: 50, videoNotes: {}, counts: {} };
export const UPDATE_EVENT = "studyclip:update";

export const XP = { correct: 10, wrong: 2, review: 5, video: 20, mock: 50 } as const;

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : structuredClone(EMPTY);
  } catch {
    return structuredClone(EMPTY);
  }
}

function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    /* storage unavailable (private mode); progress just isn't kept */
  }
}

function addXp(s: Store, amount: number, what: keyof DayCounts) {
  s.xp += amount;
  const k = dayKey();
  s.activity[k] = (s.activity[k] ?? 0) + amount;
  const c = (s.counts[k] ??= { questions: 0, reviews: 0, videos: 0, mocks: 0 });
  c[what]++;
}

export function today(s = load()): DayCounts {
  return s.counts[dayKey()] ?? { questions: 0, reviews: 0, videos: 0, mocks: 0 };
}

export function saveVideo(v: SavedVideo) {
  const s = load();
  const isNew = !s.videos.some((x) => x.videoId === v.videoId);
  s.videos = [v, ...s.videos.filter((x) => x.videoId !== v.videoId)].slice(0, 50);
  if (isNew) addXp(s, XP.video, "videos");
  save(s);
}

export function recordAnswers(results: { topicId?: string; correct: boolean }[]) {
  const s = load();
  for (const r of results) {
    addXp(s, r.correct ? XP.correct : XP.wrong, "questions");
    if (!r.topicId) continue;
    const t = (s.topics[r.topicId] ??= { attempted: 0, correct: 0 });
    t.attempted++;
    if (r.correct) t.correct++;
    t.lastPracticed = Date.now();
  }
  save(s);
}

export function recordMock(m: MockResult) {
  const s = load();
  s.mocks = [m, ...s.mocks].slice(0, 50);
  addXp(s, XP.mock, "mocks");
  save(s);
}

export function setExam(examId: string) {
  const s = load();
  if (s.examId === examId) return;
  s.examId = examId;
  save(s);
}

export function setExamDate(date: string | undefined) {
  const s = load();
  s.examDate = date || undefined;
  save(s);
}

export function setDailyGoal(goal: number) {
  const s = load();
  s.dailyGoal = goal;
  save(s);
}

// ---------- Flashcards ----------

export function addCards(cards: Omit<Flashcard, keyof Memory | "created">[]): number {
  const s = load();
  let added = 0;
  for (const c of cards) {
    if (s.cards[c.id]) continue;
    s.cards[c.id] = { ...c, ...newMemory(), created: Date.now() };
    added++;
  }
  save(s);
  return added;
}

export function deleteCard(id: string) {
  const s = load();
  delete s.cards[id];
  save(s);
}

export function gradeCard(id: string, grade: Grade) {
  const s = load();
  const c = s.cards[id];
  if (!c) return;
  s.cards[id] = { ...c, ...fsrsReview(c, grade) };
  addXp(s, XP.review, "reviews");
  save(s);
}

export function dueCards(s = load(), now = Date.now()): Flashcard[] {
  return Object.values(s.cards)
    .filter((c) => c.due <= now)
    .sort((a, b) => (a.reps === 0 ? 1 : 0) - (b.reps === 0 ? 1 : 0) || a.due - b.due);
}

// ---------- Video notes ----------

export function addVideoNote(videoId: string, t: number, text: string) {
  const s = load();
  const list = (s.videoNotes[videoId] ??= []);
  list.push({ id: Math.random().toString(36).slice(2), t, text });
  list.sort((a, b) => a.t - b.t);
  save(s);
}

export function deleteVideoNote(videoId: string, id: string) {
  const s = load();
  s.videoNotes[videoId] = (s.videoNotes[videoId] ?? []).filter((n) => n.id !== id);
  save(s);
}

// ---------- Streaks and levels ----------

/** Consecutive days with any XP, ending today (or yesterday, if today has none yet). */
export function streak(s = load()): number {
  const d = new Date();
  if (!s.activity[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (s.activity[dayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function level(xp: number): { level: number; into: number; span: number } {
  // Level n needs 50·n² XP in total.
  const lvl = Math.floor(Math.sqrt(xp / 50));
  const base = 50 * lvl * lvl;
  return { level: lvl + 1, into: xp - base, span: 50 * (lvl + 1) * (lvl + 1) - base };
}

export function clearAll() {
  save(structuredClone(EMPTY));
}
