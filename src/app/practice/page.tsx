"use client";

import { ArrowLeft, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TestPaywall } from "@/components/Paywall";
import { Quiz, type AnswerResult } from "@/components/Quiz";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { testAccessFor, useAccount } from "@/lib/account";
import { topicWeights } from "@/lib/adaptive";
import { api } from "@/lib/api";
import { consumeTestAccess, load, recordAnswers, recordMock } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

export default function PracticePage() {
  return (
    <Suspense>
      <PracticeView />
    </Suspense>
  );
}

const MOCK_SIZE = 25;
const TOPIC_TEST_SIZE = 15;
const PRACTICE_SIZE = 10;

type Phase = "start" | "paywall" | "running";

interface ServerTest {
  attemptId: string;
  deadline: number;
}

async function postJson(path: string, body: object) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

function PracticeView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const account = useAccount();
  const server = account.mode === "server";

  const exam = EXAM_BY_ID.get(params.get("exam") ?? "");
  const isTimed = params.get("mock") === "1";
  const isSmart = params.get("smart") === "1";
  const requestedTopics = (params.get("topics") ?? "").split(",").filter((t) => TOPIC_BY_ID.has(t));
  // A timed test covers the chosen topics, or the whole exam syllabus if none were chosen.
  const isTopicTest = isTimed && requestedTopics.length > 0;
  const topicIds = isTopicTest ? requestedTopics : (isTimed || isSmart) && exam ? examTopicIds(exam) : requestedTopics;
  const size = isTopicTest ? TOPIC_TEST_SIZE : isTimed ? MOCK_SIZE : PRACTICE_SIZE;

  const [phase, setPhase] = useState<Phase>(isTimed ? "start" : "running");
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [serverTest, setServerTest] = useState<ServerTest | null>(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [round, setRound] = useState(0);
  const key = topicIds.join(",");

  // Untimed practice (and timed tests on the static build) load questions directly.
  const loadQuestions = useCallback(async () => {
    setQuestions(null);
    setError("");
    const { ok, json } = await api("practice", {
      topicIds: key.split(","),
      count: size,
      weights: isSmart ? topicWeights(key.split(","), load().topics) : undefined,
    });
    if (!ok) setError(json.error);
    else setQuestions(json.questions);
  }, [key, size, isSmart]);

  useEffect(() => {
    if (key && phase === "running" && !(isTimed && server)) loadQuestions();
  }, [key, loadQuestions, round, phase, isTimed, server]);

  const loginFirst = () => router.push(`/login?next=${encodeURIComponent(path + location.search)}`);

  const start = async () => {
    setError("");
    if (!server) {
      if (!consumeTestAccess(exam?.id)) return setPhase("paywall");
      setPhase("running");
      setRound((r) => r + 1);
      return;
    }
    if (!account.user) return loginFirst();
    setStarting(true);
    const { status, data } = await postJson("/api/tests/start", { examId: exam?.id, topicIds: isTopicTest ? requestedTopics : undefined });
    setStarting(false);
    if (status === 401) return loginFirst();
    if (status === 402) return setPhase("paywall");
    if (status !== 201) return setError(data.error ?? "Could not start the test.");
    // The server keeps the answers until submission; the browser only gets questions and options.
    setQuestions(data.questions.map((q: MCQ) => ({ ...q, answer: -1, explanation: "" })));
    setServerTest({ attemptId: data.attemptId, deadline: data.deadline });
    setPhase("running");
    setRound((r) => r + 1);
    account.refresh();
  };

  const submitToServer = async (chosen: (number | null)[]): Promise<MCQ[]> => {
    const { status, data } = await postJson("/api/tests/submit", { attemptId: serverTest!.attemptId, answers: chosen });
    if (status !== 200) throw new Error(data.error ?? "Could not submit the test.");
    return data.questions;
  };

  const onFinish = (results: AnswerResult[]) => {
    recordAnswers(results.filter((r) => r.chosen !== null).map((r) => ({ topicId: r.question.topicId, correct: r.correct })));
    if (isTimed && !isTopicTest && exam) {
      const correct = results.filter((r) => r.correct).length;
      const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
      recordMock({ examId: exam.id, score: correct - wrong * (exam.negativeMarking ?? 0), maxScore: results.length, correct, wrong, skipped: results.length - correct - wrong, takenAt: Date.now() });
    }
  };

  if (!topicIds.length || (isTimed && server && !exam)) {
    return (
      <div className="card text-sm">
        Nothing to practise here yet.{" "}
        <Link href="/exams" className="font-medium text-brand-700">
          Choose an exam
        </Link>{" "}
        with practice topics.
      </div>
    );
  }

  const topicName = requestedTopics.length === 1 ? TOPIC_BY_ID.get(requestedTopics[0])!.name : `${requestedTopics.length} topics`;
  const title = isTopicTest ? `${topicName}: timed test` : isTimed ? `${exam?.name} full mock test` : isSmart ? `${exam?.name} smart practice` : requestedTopics.length === 1 ? topicName : `Practice: ${topicName}`;
  const marking = exam?.negativeMarking ? ` · −${+exam.negativeMarking.toFixed(2)} per wrong answer` : "";
  const count = questions?.length ?? size;
  const timeLimit = serverTest ? Math.max(30, Math.round((serverTest.deadline - Date.now()) / 1000)) : count * 60;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        {exam && (
          <Link href={`/exams/${exam.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> {exam.name} syllabus
          </Link>
        )}
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-slate-600">
          {isTimed
            ? `Up to ${size} questions · 1 minute per question · answers revealed after you submit${marking}`
            : isSmart
              ? "Adaptive: weak and unseen topics come up more often, mixed together for better long-term recall."
              : "Instant feedback with an explanation after every answer."}
        </p>
      </div>
      <div className="card">
        {phase === "start" ? (
          !account.ready ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : server && !account.user ? (
            <div className="mx-auto max-w-sm space-y-4 py-6 text-center">
              <h2 className="text-lg font-semibold">Log in to take timed tests</h2>
              <p className="text-sm text-slate-600">Your first test for every exam is free. Your score and progress are saved to your account.</p>
              <button className="btn-primary w-full py-2.5" onClick={loginFirst}>
                Log in or sign up
              </button>
            </div>
          ) : (
            <StartScreen access={testAccessFor(account, exam?.id)} credits={account.credits} onStart={start} onPaywall={() => setPhase("paywall")} busy={starting} error={error} />
          )
        ) : phase === "paywall" ? (
          <TestPaywall used={exam && account.freeTestsUsed.includes(exam.id) ? "free-used" : "no-credits"} onUnlocked={() => setPhase("start")} />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !questions ? (
          <p className="text-sm text-slate-500">Preparing questions…</p>
        ) : (
          <Quiz
            key={round}
            questions={questions}
            mode={isTimed ? "mock" : "practice"}
            negativeMarking={isTimed ? (exam?.negativeMarking ?? 0) : 0}
            timeLimitSec={isTimed ? timeLimit : undefined}
            submit={isTimed && serverTest ? submitToServer : undefined}
            onFinish={onFinish}
            onRestart={() => {
              setServerTest(null);
              if (isTimed) setPhase("start");
              else setRound((r) => r + 1);
            }}
          />
        )}
      </div>
    </div>
  );
}

function StartScreen({ access, credits, onStart, onPaywall, busy, error }: { access: "free" | "credit" | "none"; credits: number; onStart: () => void; onPaywall: () => void; busy: boolean; error: string }) {
  useEffect(() => {
    if (access === "none") onPaywall();
  }, [access, onPaywall]);
  return (
    <div className="mx-auto max-w-sm space-y-4 py-6 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-600">
        <Timer className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-lg font-semibold">Ready when you are</h2>
        <p className="mt-1 text-sm text-slate-600">
          The timer starts as soon as you begin. {access === "free" ? "This uses your free test for this exam." : `This uses 1 of your ${credits} test credit${credits === 1 ? "" : "s"}.`}
        </p>
      </div>
      <button className="btn-primary w-full py-2.5" onClick={onStart} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Start test
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
