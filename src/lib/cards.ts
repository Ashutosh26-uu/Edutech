import { TOPIC_BY_ID } from "@/data/topics";
import { loadTopicBank } from "./bank";
import type { MCQ } from "./types";
import { formatTime } from "./youtube";
import type { Flashcard } from "./storage";

export type NewCard = Omit<Flashcard, "stability" | "difficulty" | "reps" | "lapses" | "lastReview" | "due" | "created">;

/** Question-bank MCQs become question → answer cards (retrieval practice without the options to lean on). */
export async function cardsForTopic(topicId: string): Promise<NewCard[]> {
  const topic = TOPIC_BY_ID.get(topicId);
  return (await loadTopicBank(topicId)).map((q) => ({
    id: `q:${q.id}`,
    front: q.question,
    back: `${q.options[q.answer]}\n\n${q.explanation}`,
    topicId,
    source: topic?.name ?? topicId,
  }));
}

/** Specific bank questions (a test's wrong answers, say) as question → answer cards. */
export function cardsForQuestions(questions: MCQ[]): NewCard[] {
  return questions.map((q) => ({
    id: `q:${q.id}`,
    front: q.question,
    back: `${q.options[q.answer]}

${q.explanation}`,
    topicId: q.topicId,
    source: (q.topicId && TOPIC_BY_ID.get(q.topicId)?.name) || "Mistakes",
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
