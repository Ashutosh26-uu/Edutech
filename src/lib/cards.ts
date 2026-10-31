import { QUESTION_BANK, TOPIC_BY_ID } from "@/data/topics";
import type { MCQ } from "./types";
import { formatTime } from "./youtube";
import type { Flashcard } from "./storage";

type NewCard = Omit<Flashcard, "stability" | "difficulty" | "reps" | "lapses" | "lastReview" | "due" | "created">;

/** Question-bank MCQs become question → answer cards (retrieval practice without the options to lean on). */
export function cardsForTopic(topicId: string): NewCard[] {
  const topic = TOPIC_BY_ID.get(topicId);
  return QUESTION_BANK.filter((q) => q.topicId === topicId).map((q) => ({
    id: `q:${q.id}`,
    front: q.question,
    back: `${q.options[q.answer]}\n\n${q.explanation}`,
    topicId,
    source: topic?.name ?? topicId,
  }));
}

/** Fill-in-the-blank video quiz questions become cloze cards linked back to their timestamp. */
export function cardsForVideo(videoId: string, title: string, quiz: MCQ[]): NewCard[] {
  return quiz.map((q) => ({
    id: `v:${videoId}:${q.timestamp ?? q.id}:${q.options[q.answer]}`,
    front: q.question.replace(/^Fill in the blank:\s*/, ""),
    back: `${q.options[q.answer]}${q.timestamp !== undefined ? `\n\nFrom the video at ${formatTime(q.timestamp)}.` : ""}`,
    source: title,
    videoId,
    timestamp: q.timestamp,
  }));
}

export function customCard(front: string, back: string, source = "My cards"): NewCard {
  return { id: `c:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, front, back, source };
}
