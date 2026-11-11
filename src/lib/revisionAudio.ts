import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { NOTES_LOADERS } from "@/data/notes";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import type { Store } from "./storage";

/**
 * Audio revision (/listen): which topics to read aloud and the lines to read for each. The
 * speaking itself is done by the browser's speechSynthesis in components/AudioRevision.tsx.
 */

export interface Track {
  topicId: string;
  name: string;
  lines: string[];
}

export type PlaylistSource = "weak" | "exam" | "starter";

const MIN_ATTEMPTS = 5;
const MAX_TRACKS = 12;

/** Weakest topics first (lowest accuracy, at least 5 questions tried), then topics of flashcards due now. */
export function weakTopicIds(store: Store, now = Date.now()): string[] {
  const weak = Object.entries(store.topics)
    .filter(([id, s]) => s.attempted >= MIN_ATTEMPTS && TOPIC_BY_ID.has(id))
    .sort(([, a], [, b]) => a.correct / a.attempted - b.correct / b.attempted)
    .map(([id]) => id);
  const due = Object.values(store.cards)
    .filter((c) => c.due <= now && c.topicId && TOPIC_BY_ID.has(c.topicId))
    .map((c) => c.topicId!);
  return [...new Set([...weak, ...due])].slice(0, MAX_TRACKS);
}

export function examTopicList(store: Store): string[] {
  const exam = store.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  return exam ? examTopicIds(exam).filter((id) => TOPIC_BY_ID.has(id)) : [];
}

/** A general-studies starter list for someone with no exam chosen and no practice yet. */
export const STARTER_TOPICS = TOPICS.filter((t) => /^(polity|history|geo|eco|sci|gk)-/.test(t.id))
  .slice(0, MAX_TRACKS)
  .map((t) => t.id);

/** Tidies text written for the eye so it reads well aloud. */
export function speakable(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_`#]/g, "")
    .replace(/\s*[→⇒]\s*/g, " leads to ")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/×/g, " times ")
    .replace(/≈/g, " about ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lines for one topic: a title, the summary, key points, then each notes heading with its points. */
export async function trackFor(topicId: string, position: number, total: number): Promise<Track | null> {
  const topic = TOPIC_BY_ID.get(topicId);
  if (!topic) return null;
  const lines = [`Topic ${position} of ${total}: ${topic.name}.`, topic.summary, "Key points.", ...topic.keyPoints];
  const notes = await NOTES_LOADERS[topicId]?.()
    .then((m) => m.default)
    .catch(() => undefined);
  for (const s of notes?.sections ?? []) lines.push(`${s.heading}.`, ...s.points);
  if (notes?.traps?.length) lines.push("Common mistakes.", ...notes.traps);
  return { topicId, name: topic.name, lines: lines.map(speakable).filter(Boolean) };
}

export async function buildPlaylist(ids: string[]): Promise<Track[]> {
  const list = ids.slice(0, MAX_TRACKS);
  const tracks = await Promise.all(list.map((id, i) => trackFor(id, i + 1, list.length)));
  return tracks.filter((t): t is Track => !!t);
}
