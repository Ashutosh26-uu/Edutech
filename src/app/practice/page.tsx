"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Quiz, type AnswerResult } from "@/components/Quiz";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { recordAnswers, recordMock } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

export default function PracticePage() {
  return (
    <Suspense>
      <PracticeView />
    </Suspense>
  );
}

const MOCK_SIZE = 25;
const PRACTICE_SIZE = 10;

function PracticeView() {
  const params = useSearchParams();
  const exam = EXAM_BY_ID.get(params.get("exam") ?? "");
  const isMock = params.get("mock") === "1";
  const topicIds = isMock && exam ? examTopicIds(exam) : (params.get("topics") ?? "").split(",").filter((t) => TOPIC_BY_ID.has(t));

  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [error, setError] = useState("");
  const [round, setRound] = useState(0);
  const key = topicIds.join(",");

  const loadQuestions = useCallback(async () => {
    setQuestions(null);
    setError("");
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicIds: key.split(","), count: isMock ? MOCK_SIZE : PRACTICE_SIZE }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error);
    else setQuestions(json.questions);
  }, [key, isMock]);

  useEffect(() => {
    if (key) loadQuestions();
  }, [key, loadQuestions, round]);

  const onFinish = (results: AnswerResult[]) => {
    recordAnswers(results.filter((r) => r.chosen !== null).map((r) => ({ topicId: r.question.topicId, correct: r.correct })));
    if (isMock && exam) {
      const correct = results.filter((r) => r.correct).length;
      const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
      recordMock({
        examId: exam.id,
        score: correct - wrong * exam.negativeMarking,
        maxScore: results.length,
        correct,
        wrong,
        skipped: results.length - correct - wrong,
        takenAt: Date.now(),
      });
    }
  };

  if (!topicIds.length) {
    return (
      <div className="card text-sm">
        Nothing to practise. <Link href="/exams" className="font-semibold text-brand-700">Choose an exam</Link> first.
      </div>
    );
  }

  const title = isMock ? `${exam?.name} mock test` : topicIds.length === 1 ? TOPIC_BY_ID.get(topicIds[0])!.name : `Practice: ${topicIds.length} topics`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        {exam && (
          <Link href={`/exams/${exam.id}`} className="text-sm text-brand-700">
            ← {exam.name} syllabus
          </Link>
        )}
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600">
          {isMock
            ? `${MOCK_SIZE} questions · ${MOCK_SIZE} minutes · answers revealed after you submit${exam?.negativeMarking ? ` · −${+exam.negativeMarking.toFixed(2)} per wrong answer` : ""}`
            : "Instant feedback with an explanation after every answer."}
        </p>
      </div>
      <div className="card">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !questions ? (
          <p className="text-sm text-slate-500">Preparing questions…</p>
        ) : (
          <Quiz
            key={round}
            questions={questions}
            mode={isMock ? "mock" : "practice"}
            negativeMarking={isMock ? exam?.negativeMarking : 0}
            timeLimitSec={isMock ? MOCK_SIZE * 60 : undefined}
            onFinish={onFinish}
            onRestart={() => setRound((r) => r + 1)}
          />
        )}
      </div>
    </div>
  );
}
