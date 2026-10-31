"use client";

/**
 * Per-browser progress storage. Prototype only: a real deployment would keep this in a
 * database tied to the user's account.
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

interface Store {
  videos: SavedVideo[];
  topics: Record<string, TopicStat>;
  mocks: MockResult[];
  examId?: string;
}

const KEY = "studyclip:v1";
const EMPTY: Store = { videos: [], topics: {}, mocks: [] };

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable (private mode); progress just isn't kept */
  }
}

export function saveVideo(v: SavedVideo) {
  const s = load();
  s.videos = [v, ...s.videos.filter((x) => x.videoId !== v.videoId)].slice(0, 50);
  save(s);
}

export function recordAnswers(results: { topicId?: string; correct: boolean }[]) {
  const s = load();
  for (const r of results) {
    if (!r.topicId) continue;
    const t = (s.topics[r.topicId] ??= { attempted: 0, correct: 0 });
    t.attempted++;
    if (r.correct) t.correct++;
  }
  save(s);
}

export function recordMock(m: MockResult) {
  const s = load();
  s.mocks = [m, ...s.mocks].slice(0, 50);
  save(s);
}

export function setExam(examId: string) {
  const s = load();
  s.examId = examId;
  save(s);
}

export function clearAll() {
  save({ ...EMPTY });
}
