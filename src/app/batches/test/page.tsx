"use client";

import { ArrowLeft, CheckCircle2, Clock, ListChecks, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BatchGate } from "@/components/BatchGate";
import { Quiz, type AnswerResult, type ScoredPaper } from "@/components/Quiz";
import { PageSkeleton } from "@/components/Skeleton";
import { useAccount } from "@/lib/account";
import { postJson } from "@/lib/api";
import { batchApi, fmtDate } from "@/lib/batches";
import { recordAnswers } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

interface Info {
  id: string;
  title: string;
  batch: string;
  total: number;
  minutes: number;
  dueAt: number | null;
  marks: number;
  negativeMarking: number;
  isTrainer: boolean;
  attempt: { id: string; submitted: boolean; inProgress: boolean } | null;
}
interface Started {
  attemptId: string;
  deadline: number;
  marks: number;
  negativeMarking: number;
  questions: MCQ[];
}

export default function BatchTestPage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={0} />}>
      <BatchGate>
        <BatchTest />
      </BatchGate>
    </Suspense>
  );
}

function BatchTest() {
  const testId = useSearchParams().get("id") ?? "";
  const account = useAccount();
  const [info, setInfo] = useState<Info | null>(null);
  const [run, setRun] = useState<Started | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    batchApi<Info>(`/tests/${testId}`).then((r) => (r.data ? setInfo(r.data) : setError(r.error ?? "")));
  }, [testId]);

  async function start() {
    setBusy(true);
    setError("");
    const { status, data } = await postJson<Started>(`/api/batches/tests/${testId}/start`, {});
    setBusy(false);
    if (status !== 201) return setError(data.error ?? "Could not start the test.");
    // The server keeps the answers until submission; the browser only gets questions and options.
    setRun({ ...data, questions: data.questions.map((q) => ({ ...q, answer: -1, explanation: "" })) });
  }

  const submit = async (chosen: (number | null)[], times: number[]): Promise<ScoredPaper> => {
    const { status, data } = await postJson<ScoredPaper>("/api/tests/submit", { attemptId: run!.attemptId, answers: chosen, times });
    if (status !== 200) throw new Error(data.error ?? "Could not submit the test.");
    return data;
  };

  if (error && !info) return <p className="card text-sm text-red-700">{error}</p>;
  if (!info) return <PageSkeleton tiles={0} />;

  if (run)
    return (
      <div className="card">
        <Quiz
          questions={run.questions}
          mode="mock"
          negativeMarking={run.negativeMarking}
          marks={run.marks}
          timeLimitSec={Math.max(30, Math.floor((run.deadline - Date.now()) / 1000))}
          submit={submit}
          attemptId={run.attemptId}
          share={{ title: info.title }}
          candidate={account.user?.name ?? undefined}
          onFinish={(results: AnswerResult[]) => recordAnswers(results.filter((r) => r.chosen !== null && !r.hidden).map((r) => ({ topicId: r.question.topicId, correct: r.correct })))}
        />
      </div>
    );

  const closed = !!info.dueAt && info.dueAt < Date.now();
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Link href="/batches" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Batches
      </Link>
      <div className="card space-y-4">
        <div>
          <p className="eyebrow">{info.batch}</p>
          <h1 className="mt-1 text-2xl font-semibold">{info.title}</h1>
        </div>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-slate-400" /> {info.total} questions, {info.marks} mark{info.marks === 1 ? "" : "s"} each{info.negativeMarking ? `, −${info.negativeMarking * info.marks} for a wrong answer` : ", no negative marking"}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" /> {info.minutes} minutes{info.dueAt ? ` · due ${fmtDate(info.dueAt)}` : ""}
          </li>
        </ul>
        {info.isTrainer ? (
          <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">You assigned this test. Students take it from their Batches page; see their scores on the results page.</p>
        ) : info.attempt?.submitted ? (
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> You’ve submitted this test.
            </p>
            <Link href={`/tests?id=${info.attempt.id}`} className="btn-primary">
              Review answers
            </Link>
          </div>
        ) : closed ? (
          <p className="text-sm text-slate-600">This test has closed.</p>
        ) : (
          <>
            <p className="text-sm text-slate-600">{info.attempt?.inProgress ? "Your test is in progress. Resume to continue with the time that’s left." : "You can take this test once. The timer starts when you press Start and keeps running if you leave the page."}</p>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button className="btn-primary" onClick={start} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : info.attempt?.inProgress ? "Resume test" : "Start test"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
