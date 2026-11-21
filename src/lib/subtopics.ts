import { SUBTOPICS, type Subtopic } from "../data/subtopics";
import type { TopicStat } from "./storage";

/**
 * Sub-topic accuracy: one level finer than a topic ("Percentage → successive change"). Stats are
 * kept in the browser's store under `subtopics`, keyed `<topicId>/<slug>`, next to (never inside)
 * the per-topic stats, so everything that sums `store.topics` is unchanged.
 */

/** Below this many answers a sub-topic's accuracy is too noisy to call it weak. */
export const MIN_SUBTOPIC_ATTEMPTS = 3;

export const subtopicKey = (topicId: string, slug: string) => `${topicId}/${slug}`;

export function splitSubtopicKey(key: string): { topicId: string; slug: string } | null {
  const i = key.indexOf("/");
  return i > 0 ? { topicId: key.slice(0, i), slug: key.slice(i + 1) } : null;
}

export const subtopicsOf = (topicId: string): readonly Subtopic[] => SUBTOPICS[topicId] ?? [];

export const isSubtopic = (topicId: string | undefined, slug: string | undefined): boolean => !!topicId && !!slug && subtopicsOf(topicId).some((s) => s.slug === slug);

export const subtopicLabel = (topicId: string, slug: string): string => subtopicsOf(topicId).find((s) => s.slug === slug)?.label ?? slug;

/** Adds answers to sub-topic stats (in place) and returns them. Answers without a known sub-topic are skipped. */
export function addSubtopicAnswers(stats: Record<string, TopicStat>, results: { topicId?: string; subtopic?: string; correct: boolean }[], now = Date.now()): Record<string, TopicStat> {
  for (const r of results) {
    if (!isSubtopic(r.topicId, r.subtopic)) continue;
    const s = (stats[subtopicKey(r.topicId!, r.subtopic!)] ??= { attempted: 0, correct: 0 });
    s.attempted++;
    if (r.correct) s.correct++;
    s.lastPracticed = now;
  }
  return stats;
}

export interface WeakSubtopic {
  key: string;
  topicId: string;
  slug: string;
  label: string;
  attempted: number;
  correct: number;
  /** Accuracy, 0-100, rounded. */
  pct: number;
}

/**
 * The weakest sub-topics, worst accuracy first (more attempts first on a tie). Only sub-topics with
 * at least `min` answers count; `topicId` limits it to one topic; `below` drops those at or above
 * that accuracy (in %). Unknown keys (a slug since removed, a malformed entry) are ignored.
 */
export function weakestSubtopics(stats: Record<string, TopicStat> | undefined, opts: { n?: number; min?: number; topicId?: string; below?: number } = {}): WeakSubtopic[] {
  const { n = 5, min = MIN_SUBTOPIC_ATTEMPTS, topicId, below = Infinity } = opts;
  const out: WeakSubtopic[] = [];
  for (const [key, s] of Object.entries(stats ?? {})) {
    const k = splitSubtopicKey(key);
    if (!k || (topicId && k.topicId !== topicId) || !isSubtopic(k.topicId, k.slug)) continue;
    const attempted = Number(s?.attempted) || 0;
    const correct = Number(s?.correct) || 0;
    if (attempted < min) continue;
    const pct = Math.round((correct / attempted) * 100);
    if (pct >= below) continue;
    out.push({ key, ...k, label: subtopicLabel(k.topicId, k.slug), attempted, correct, pct });
  }
  return out.sort((a, b) => a.correct / a.attempted - b.correct / b.attempted || b.attempted - a.attempted).slice(0, n);
}

/** Practice link for one sub-topic (the practice page falls back to the whole topic if too few questions are tagged). */
export const subtopicPracticeHref = (topicId: string, slug: string, examId?: string) =>
  `/practice?${examId ? `exam=${encodeURIComponent(examId)}&` : ""}topics=${encodeURIComponent(topicId)}&subtopic=${encodeURIComponent(slug)}`;
