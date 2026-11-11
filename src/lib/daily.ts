import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { BANK_TOPIC_IDS, bankSize, loadTopicBank } from "./bank";
import type { MCQ } from "./types";

/**
 * Question of the day: one hard question per date and exam, the same for everyone. The date and
 * exam id seed a hash that picks a topic from the exam's syllabus and then a "hard" or
 * "very-hard" question from that topic's bank file. No server: every browser works it out alone.
 */

/** FNV-1a, 32-bit: small, stable across browsers and Node. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Topics the day's question can come from: the exam's topics that have bank questions, or every bank topic. */
export function dailyTopics(examId?: string): string[] {
  const exam = examId ? EXAM_BY_ID.get(examId) : undefined;
  const ids = exam ? examTopicIds(exam).filter((t) => bankSize(t) > 0) : [];
  return ids.length ? ids : [...BANK_TOPIC_IDS].sort();
}

/** The question for an India date (YYYY-MM-DD) and exam. Null only if no topic has a hard question. */
export async function questionOfTheDay(date: string, examId?: string): Promise<MCQ | null> {
  const topics = dailyTopics(examId);
  const seed = hash(`${date}|${examId ?? "general"}`);
  const pick = hash(`${seed}:q`);
  // Start at the seeded topic; if it has no hard questions, move on to the next one.
  for (let i = 0; i < topics.length; i++) {
    const qs = await loadTopicBank(topics[(seed + i) % topics.length]);
    const hard = qs.filter((q) => q.difficulty === "hard" || q.difficulty === "very-hard");
    if (hard.length) return hard[pick % hard.length];
  }
  return null;
}
