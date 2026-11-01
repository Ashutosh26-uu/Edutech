"use client";

import { ArrowLeft, Timer } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TestPaywall } from "@/components/Paywall";
import { Quiz, type AnswerResult } from "@/components/Quiz";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { topicWeights } from "@/lib/adaptive";
import { api } from "@/lib/api";
import { consumeTestAccess, load, recordAnswers, recordMock, testAccess } from "@/lib/storage";
import type { MCQ } from "@/lib/types";
import { useStore } from "@/lib/useStore";

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

function PracticeView() {
  const params = useSearchParams();
  const exam = EXAM_BY_ID.get(params.get("exam") ?? "");
  const isTimed = params.get("mock") === "1";
  const isSmart = params.get("smart") === "1";
  const requestedTopics = (params.get("topics") ?? "").split(",").filter((t) => TOPIC_BY_ID.has(t));
  // A timed test covers the chosen topics, or the whole exam syllabus if none were chosen.
  const isTopicTest = isTimed && requestedTopics.length > 0;
  const topicIds = isTopicTest ? requestedTopics : (isTimed || isSmart) && exam ? examTopicIds(exam) : requestedTopics;
  const size = isTopicTest ? TOPIC_TEST_SIZE : isTimed ? MOCK_SIZE : PRACTICE_SIZE;

  const store = useStore();
  const [phase, setPhase] = useState<Phase>(isTimed ? "start" : "running");
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [error, setError] = useState("");
  const [round, setRound] = useState(0);
  const key = topicIds.join(",");

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
    if (key && phase === "running") loadQuestions();
  }, [key, loadQuestions, round, phase]);

  const start = () => {
    if (!consumeTestAccess(exam?.id)) {
      setPhase("paywall");
      return;
    }
    setPhase("running");
    setRound((r) => r + 1);
  };

  const onFinish = (results: AnswerResult[]) => {
    recordAnswers(results.filter((r) => r.chosen !== null).map((r) => ({ topicId: r.question.topicId, correct: r.correct })));
    if (isTimed && !isTopicTest && exam) {
      const correct = results.filter((r) => r.correct).length;
      const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
      recordMock({
        examId: exam.id,
        score: correct - wrong * (exam.negativeMarking ?? 0),
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
            ? `${size} questions · ${size} minutes · answers revealed after you submit${marking}`
            : isSmart
              ? "Adaptive: weak and unseen topics come up more often, mixed together for better long-term recall."
              : "Instant feedback with an explanation after every answer."}
        </p>
      </div>
      <div className="card">
        {phase === "start" && store ? (
          <StartScreen access={testAccess(exam?.id, store)} credits={store.credits} onStart={start} onPaywall={() => setPhase("paywall")} size={size} />
        ) : phase === "paywall" ? (
          <TestPaywall used={exam && store?.freeMockUsed[exam.id] ? "free-used" : "no-credits"} onUnlocked={() => setPhase("start")} />
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
            timeLimitSec={isTimed ? size * 60 : undefined}
            onFinish={onFinish}
            onRestart={() => (isTimed ? setPhase("start") : setRound((r) => r + 1))}
          />
        )}
      </div>
    </div>
  );
}

function StartScreen({ access, credits, onStart, onPaywall, size }: { access: "free" | "credit" | "none"; credits: number; onStart: () => void; onPaywall: () => void; size: number }) {
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
          {size} minutes start as soon as you begin.{" "}
          {access === "free" ? "This uses your free test for this exam." : `This uses 1 of your ${credits} test credit${credits === 1 ? "" : "s"}.`}
        </p>
      </div>
      <button className="btn-primary w-full py-2.5" onClick={onStart}>
        Start test
      </button>
    </div>
  );
}
