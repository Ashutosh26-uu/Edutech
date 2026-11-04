"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Results, type AnswerResult, type QuizSection } from "@/components/Quiz";
import { EXAM_BY_ID } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { useAccount } from "@/lib/account";
import type { MCQ } from "@/lib/types";

interface Attempt {
  examId: string;
  kind: "full" | "topic" | "section";
  negativeMarking: number;
  marks: number;
  questions: MCQ[];
  answers: (number | null)[];
  times: number[] | null;
  sections: QuizSection[] | null;
  submittedAt: number | null;
}

/** Full analysis of a submitted test (/tests?id=…): score, time, sections, topics and every answer. */
export default function TestAnalysisPage() {
  return (
    <Suspense>
      <TestAnalysis />
    </Suspense>
  );
}

function TestAnalysis() {
  const id = useSearchParams().get("id") ?? "";
  const account = useAccount();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account.ready) return;
    if (!account.user) return setError("Log in to see this test.");
    if (!id) return setError("Test not found.");
    fetch(`/api/tests/${id}`, { cache: "no-store" })
      .then(async (r) => (r.ok ? setAttempt(await r.json()) : setError((await r.json()).error ?? "Test not found.")))
      .catch(() => setError("Could not load this test."));
  }, [id, account.ready, account.user]);

  if (error) return <div className="card text-sm text-red-600">{error}</div>;
  if (!attempt) return <p className="text-sm text-slate-500">Loading…</p>;

  const exam = EXAM_BY_ID.get(attempt.examId);
  const results: AnswerResult[] = attempt.questions.map((q, i) => ({ question: q, chosen: attempt.answers[i] ?? null, correct: attempt.answers[i] === q.answer, seconds: attempt.times?.[i] }));
  const title = attempt.kind === "full" ? "Full mock test" : attempt.kind === "section" ? `${attempt.sections?.[0]?.name ?? "Section"} test` : `${attempt.questions[0]?.topicId ? (TOPIC_BY_ID.get(attempt.questions[0].topicId)?.name ?? "Topic") : "Topic"} test`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link href="/progress" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> My progress
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">
          {exam?.name ?? attempt.examId} · {title}
        </h1>
        {attempt.submittedAt && <p className="text-sm text-slate-600">Taken on {new Date(attempt.submittedAt).toLocaleString()}</p>}
      </div>
      <div className="card">
        <Results results={results} negativeMarking={attempt.negativeMarking} marks={attempt.marks} sections={attempt.sections ?? undefined} />
      </div>
    </div>
  );
}
