"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { Results, type AnswerResult, type QuizSection } from "@/components/Quiz";
import { EXAM_BY_ID } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { useAccount } from "@/lib/account";
import type { MCQ } from "@/lib/types";

interface Attempt {
  examId: string;
  kind: "full" | "topic" | "section" | "weekly";
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
      .catch(() => setError("Couldn’t reach StudyClip. Check your internet connection and try again."));
  }, [id, account.ready, account.user]);

  if (error)
    return (
      <div className="card mx-auto max-w-md space-y-3 text-sm" role="alert">
        <p className="font-semibold text-slate-900">{account.user ? "We couldn’t open this test" : "Log in to see this test"}</p>
        <p className="text-slate-600">{account.user ? error : "Your test results are saved to your account."}</p>
        <div className="flex flex-wrap gap-2">
          {account.user ? (
            <Link href="/progress" className="btn-primary">
              See all my tests
            </Link>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(`/tests?id=${id}`)}`} className="btn-primary">
              Log in
            </Link>
          )}
        </div>
      </div>
    );
  if (!attempt) return <PageSkeleton />;

  const exam = EXAM_BY_ID.get(attempt.examId);
  const results: AnswerResult[] = attempt.questions.map((q, i) => ({ question: q, chosen: attempt.answers[i] ?? null, correct: attempt.answers[i] === q.answer, seconds: attempt.times?.[i] }));
  const title = attempt.kind === "full" ? "Full mock test" : attempt.kind === "weekly" ? "Sunday All-India Mock" : attempt.kind === "section" ? `${attempt.sections?.[0]?.name ?? "Section"} test` : `${attempt.questions[0]?.topicId ? (TOPIC_BY_ID.get(attempt.questions[0].topicId)?.name ?? "Topic") : "Topic"} test`;

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
        <Results results={results} negativeMarking={attempt.negativeMarking} marks={attempt.marks} sections={attempt.sections ?? undefined} attemptId={id} share={{ title: `${exam?.name ?? attempt.examId} · ${title}`, examId: exam?.id }} />
      </div>
    </div>
  );
}
