import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { QUESTION_BANK, TOPIC_BY_ID } from "@/data/topics";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

/** Revision sheet for an exam. Without an active pass only the first topic's notes are sent. */
export async function getRevision(user: SessionUser | null, examId: string) {
  const exam = EXAM_BY_ID.get(examId);
  if (!exam) throw new HttpError(404, "Unknown exam.");
  let expiresAt: number | null = null;
  if (user) {
    const [pass] = await db
      .select({ expiresAt: schema.revisionPasses.expiresAt })
      .from(schema.revisionPasses)
      .where(and(eq(schema.revisionPasses.userId, user.id), eq(schema.revisionPasses.examId, examId), gt(schema.revisionPasses.expiresAt, new Date())))
      .limit(1);
    expiresAt = pass?.expiresAt.getTime() ?? null;
  }
  const unlocked = expiresAt !== null;
  const topicIds = examTopicIds(exam);
  const preview = topicIds[0];

  return {
    unlocked,
    expiresAt,
    subjects: exam.subjects
      .filter((s) => s.topicIds.length)
      .map((s) => ({
        name: s.name,
        topics: s.topicIds.map((id) => {
          const t = TOPIC_BY_ID.get(id)!;
          const open = unlocked || id === preview;
          return { id, name: t.name, keyPoints: open ? t.keyPoints : [], locked: !open, preview: !unlocked && id === preview };
        }),
      })),
    flashcards: unlocked ? QUESTION_BANK.filter((q) => q.topicId && topicIds.includes(q.topicId)) : [],
    totals: {
      topics: topicIds.length,
      keyPoints: topicIds.reduce((n, id) => n + (TOPIC_BY_ID.get(id)?.keyPoints.length ?? 0), 0),
      flashcards: QUESTION_BANK.filter((q) => q.topicId && topicIds.includes(q.topicId)).length,
    },
  };
}
