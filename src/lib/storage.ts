"use client";

import { newMemory, review as fsrsReview, type Grade, type Memory } from "./fsrs";
import { computeStreak, consecutiveDays, istDayKey, type StreakInfo } from "./streak";
import { mergeSync, type Bookmark, type SyncDoc } from "./sync";
import type { MCQ } from "./types";

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

export interface Store {
  videos: SavedVideo[];
  topics: Record<string, TopicStat>;
  mocks: MockResult[];
  /** The exam the student chose. Only changed when they pick it, never by just viewing an exam page. */
  examId?: string;
  /** The exam page the student looked at most recently (does not change their chosen exam). */
  lastViewedExamId?: string;
  examDate?: string; // YYYY-MM-DD
  cards: Record<string, Flashcard>;
  xp: number;
  /** XP earned per local day, keyed YYYY-MM-DD */
  activity: Record<string, number>;
  dailyGoal: number;
  videoNotes: Record<string, VideoNote[]>;
  /** What was done each day: questions answered, cards reviewed, videos, mock tests */
  counts: Record<string, DayCounts>;
  /** Paid test credits (one credit = one full mock or timed topic test) */
  credits: number;
  /** Full-syllabus revision access per exam: examId -> expiry (epoch ms) */
  revisionPasses: Record<string, number>;
  /** Exams whose one free mock test has been used */
  freeMockUsed: Record<string, boolean>;
  purchases: Purchase[];
  /** Questions saved to come back to, keyed by question id. */
  bookmarks: Record<string, Bookmark>;
  /** Deleted cards and bookmarks, so a sync does not bring them back (see lib/sync.ts). */
  deleted: Record<string, number>;
  /** Missed days a streak freeze covered (YYYY-MM-DD, local), so the streak is stable and no freeze is spent twice. */
  frozenDays: string[];
  /** Question of the day answers, keyed by India date (YYYY-MM-DD). */
  dailyQuestions: Record<string, DailyAnswer>;
  /** Badge ids already celebrated with a toast. Unset until the badges feature first runs. */
  announcedBadges?: string[];
}

export interface DailyAnswer {
  questionId: string;
  chosen: number;
  correct: boolean;
  at: number;
}

export interface Purchase {
  id: string;
  productId: string;
  examId?: string;
  amount: number; // rupees
  at: number;
  /** "demo" purchases grant access without taking payment */
  mode: "demo" | "live";
  paymentId?: string;
}

export interface DayCounts {
  questions: number;
  reviews: number;
  videos: number;
  mocks: number;
}

const KEY = "studyclip:v1";
const EMPTY: Store = { videos: [], topics: {}, mocks: [], cards: {}, xp: 0, activity: {}, dailyGoal: 50, videoNotes: {}, counts: {}, credits: 0, revisionPasses: {}, freeMockUsed: {}, purchases: [], bookmarks: {}, deleted: {}, frozenDays: [], dailyQuestions: {} };
export const UPDATE_EVENT = "studyclip:update";

export const XP = { correct: 10, wrong: 2, review: 5, video: 20, mock: 50 } as const;

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...structuredClone(EMPTY), ...JSON.parse(raw) } : structuredClone(EMPTY);
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
  // Studying today settles any freeze that bridges yesterday: write it down so it stays spent.
  s.frozenDays = streakInfo(s).frozen;
}

/** XP for study that isn't a question, card, video or mock (e.g. a focus-timer block). Counts toward the daily goal and streak. */
export function awardXp(amount: number) {
  if (!(amount > 0)) return;
  const s = load();
  s.xp += amount;
  const k = dayKey();
  s.activity[k] = (s.activity[k] ?? 0) + amount;
  s.frozenDays = streakInfo(s).frozen;
  save(s);
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

// Transcripts the user pasted, kept in this browser so a video opens again without pasting twice.
// They live under their own key: they are large, and never part of account sync.
const TRANSCRIPTS_KEY = "studyclip:transcripts";
const TRANSCRIPTS_KEPT = 12;
const TRANSCRIPT_MAX_CHARS = 300_000;

function loadTranscripts(): { videoId: string; text: string }[] {
  try {
    const list = JSON.parse(localStorage.getItem(TRANSCRIPTS_KEY) ?? "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pastedTranscript(videoId: string): string | undefined {
  return loadTranscripts().find((t) => t.videoId === videoId)?.text;
}

export function rememberTranscript(videoId: string, text: string) {
  if (text.length > TRANSCRIPT_MAX_CHARS) return;
  let list = [{ videoId, text }, ...loadTranscripts().filter((t) => t.videoId !== videoId)].slice(0, TRANSCRIPTS_KEPT);
  // If the browser's storage is full, drop the oldest transcripts until it fits.
  while (list.length) {
    try {
      localStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(list));
      return;
    } catch {
      list = list.slice(0, -1);
    }
  }
}

export function forgetTranscript(videoId: string) {
  try {
    localStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(loadTranscripts().filter((t) => t.videoId !== videoId)));
  } catch {}
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

/** Remembers which exam page was looked at last, without changing the chosen exam. */
export function setLastViewedExam(examId: string) {
  const s = load();
  if (s.lastViewedExamId === examId) return;
  s.lastViewedExamId = examId;
  save(s);
}

export function setExamDate(date: string | undefined) {
  const s = load();
  s.examDate = date || undefined;
  save(s);
}

/** Whole days from now until the exam date (0 on the day, negative once passed), or null if no date is set. */
export function daysUntilExam(examDate: string | undefined, now = Date.now()): number | null {
  return examDate ? Math.ceil((new Date(examDate + "T00:00:00").getTime() - now) / 86_400_000) : null;
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
  s.deleted[`card:${id}`] = Date.now();
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

// ---------- Saved questions ----------

export function isBookmarked(id: string, s = load()): boolean {
  return !!s.bookmarks[id];
}

/** Saves the question (with its answer) or removes it if already saved. Returns whether it is now saved. */
export function toggleBookmark(question: MCQ): boolean {
  const s = load();
  const on = !s.bookmarks[question.id];
  if (on) {
    s.bookmarks[question.id] = { id: question.id, question, savedAt: Date.now() };
    delete s.deleted[`bm:${question.id}`];
  } else {
    delete s.bookmarks[question.id];
    s.deleted[`bm:${question.id}`] = Date.now();
  }
  save(s);
  return on;
}

// ---------- Account sync ----------

export function syncDoc(s = load()): SyncDoc {
  return { cards: s.cards, bookmarks: s.bookmarks, deleted: s.deleted };
}

/** Takes in the account's copy, merged with anything this browser changed meanwhile. */
export function applySyncDoc(remote: SyncDoc) {
  const s = load();
  const merged = mergeSync(syncDoc(s), remote);
  s.cards = merged.cards;
  s.bookmarks = merged.bookmarks;
  s.deleted = merged.deleted;
  save(s);
}

/** Replaces this browser's cards and saved questions with the account's (a different person signed in). */
export function replaceSyncDoc(remote: SyncDoc) {
  const s = load();
  s.cards = remote.cards ?? {};
  s.bookmarks = remote.bookmarks ?? {};
  s.deleted = remote.deleted ?? {};
  save(s);
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

/** Consecutive days with any XP, ending today (or yesterday, if today has none yet). A single missed day is bridged by a streak freeze. */
export function streak(s = load()): number {
  return streakInfo(s).count;
}

/** The streak with its freezes: how many are held, which days they covered, and whether one is about to cover yesterday. */
export function streakInfo(s = load()): StreakInfo {
  return computeStreak(s.activity, s.frozenDays ?? [], dayKey());
}

// ---------- Question of the day ----------

/** Saves the answer to a day's question (India date). The first answer counts; later ones are ignored. */
export function recordDailyAnswer(date: string, question: MCQ, chosen: number): DailyAnswer {
  const s = load();
  const prev = (s.dailyQuestions ??= {})[date];
  if (prev) return prev;
  const a: DailyAnswer = { questionId: question.id, chosen, correct: chosen === question.answer, at: Date.now() };
  s.dailyQuestions[date] = a;
  addXp(s, a.correct ? XP.correct : XP.wrong, "questions");
  if (question.topicId) {
    const t = (s.topics[question.topicId] ??= { attempted: 0, correct: 0 });
    t.attempted++;
    if (a.correct) t.correct++;
    t.lastPracticed = Date.now();
  }
  save(s);
  return a;
}

/** Days in a row (India dates) the question of the day was answered, ending today or yesterday. */
export function dailyQuestionStreak(s = load()): number {
  return consecutiveDays(Object.keys(s.dailyQuestions ?? {}), istDayKey());
}

// ---------- Badges ----------

export function markBadgesAnnounced(ids: string[]) {
  const s = load();
  s.announcedBadges = [...new Set([...(s.announcedBadges ?? []), ...ids])];
  save(s);
}

export function level(xp: number): { level: number; into: number; span: number } {
  // Level n needs 50·n² XP in total.
  const lvl = Math.floor(Math.sqrt(xp / 50));
  const base = 50 * lvl * lvl;
  return { level: lvl + 1, into: xp - base, span: 50 * (lvl + 1) * (lvl + 1) - base };
}

// ---------- Purchases and access ----------

export function recordPurchase(p: Purchase, grant: { credits?: number; revisionExamId?: string; revisionDays?: number }) {
  const s = load();
  s.purchases = [p, ...s.purchases].slice(0, 100);
  if (grant.credits) s.credits += grant.credits;
  if (grant.revisionExamId && grant.revisionDays) {
    const from = Math.max(Date.now(), s.revisionPasses[grant.revisionExamId] ?? 0);
    s.revisionPasses[grant.revisionExamId] = from + grant.revisionDays * 86_400_000;
  }
  save(s);
}

export function hasRevisionPass(examId: string, s = load()): boolean {
  return (s.revisionPasses[examId] ?? 0) > Date.now();
}

/** Whether a timed test can start, and what it will use: the exam's free mock or a paid credit. */
export function testAccess(examId: string | undefined, s = load()): "free" | "credit" | "none" {
  if (examId && !s.freeMockUsed[examId]) return "free";
  return s.credits > 0 ? "credit" : "none";
}

/** Uses the free mock or one credit. Returns false if neither is available. */
export function consumeTestAccess(examId: string | undefined): boolean {
  const s = load();
  const access = testAccess(examId, s);
  if (access === "none") return false;
  if (access === "free") s.freeMockUsed[examId!] = true;
  else s.credits -= 1;
  save(s);
  return true;
}

/** XP for skill practice (speed drills, typing tests): adds to the total and today's activity, not to the question counts. */
export function awardSkillXp(amount: number) {
  const xp = Math.round(amount);
  if (!(xp > 0)) return;
  const s = load();
  s.xp += xp;
  const k = dayKey();
  s.activity[k] = (s.activity[k] ?? 0) + xp;
  s.frozenDays = streakInfo(s).frozen;
  save(s);
}

export function clearAll() {
  save(structuredClone(EMPTY));
}
