"use client";

import { ArrowLeft, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TestPaywall } from "@/components/Paywall";
import { Quiz, type AnswerResult, type QuizSection } from "@/components/Quiz";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { mockPlan, totalMinutes, totalQuestions } from "@/data/patterns";
import { TOPIC_BY_ID } from "@/data/topics";
import { testAccessFor, useAccount } from "@/lib/account";
import { topicWeights } from "@/lib/adaptive";
import { api, IS_STATIC } from "@/lib/api";
import { consumeTestAccess, load, recordAnswers, recordMock, type TopicStat } from "@/lib/storage";
import type { MCQ } from "@/lib/types";
import { shuffleOptions } from "@/lib/ai/local";
import { shuffle } from "@/lib/nlp";

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
  sections: QuizSection[] | null;
  sectional: boolean;
  marks: number;
  negativeMarking: number;
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
  const isMistakes = params.get("mistakes") === "1";
  const isSaved = params.get("saved") === "1";
  const section = params.get("section") ?? "";
  const requestedTopics = (params.get("topics") ?? "").split(",").filter((t) => TOPIC_BY_ID.has(t));
  const plan = exam ? mockPlan(exam) : null;
  const planSection = section && plan ? plan.sections.find((s) => s.subject === section) : undefined;
  // A timed test covers one paper section, the chosen topics, or the whole exam syllabus.
  const isSectionTest = isTimed && !!planSection;
  const isTopicTest = isTimed && !isSectionTest && requestedTopics.length > 0;
  const isFullMock = isTimed && !isSectionTest && !isTopicTest;
  const topicIds = isSectionTest ? planSection!.topicIds : isTopicTest ? requestedTopics : (isTimed || isSmart) && exam ? examTopicIds(exam) : requestedTopics;
  const size = isSectionTest ? planSection!.questions : isTopicTest ? TOPIC_TEST_SIZE : isFullMock ? (plan ? totalQuestions(plan.sections) : MOCK_SIZE) : PRACTICE_SIZE;

  const [phase, setPhase] = useState<Phase>(isTimed ? "start" : "running");
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [serverTest, setServerTest] = useState<ServerTest | null>(null);
  const [localSections, setLocalSections] = useState<QuizSection[] | null>(null);
  const [previous, setPrevious] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [round, setRound] = useState(0);
  const key = topicIds.join(",");

  // Smart practice weights come from the account's progress when signed in, else this browser's.
  const statsForWeights = useCallback(async (): Promise<Record<string, TopicStat>> => {
    if (server && account.user) {
      const res = await fetch("/api/progress", { cache: "no-store" }).catch(() => null);
      if (res?.ok) return ((await res.json()) as { topics: Record<string, TopicStat> }).topics;
    }
    return load().topics;
  }, [server, account.user]);

  // Untimed practice (and timed tests on the static build) load questions directly.
  const loadQuestions = useCallback(async () => {
    setQuestions(null);
    setError("");
    if (isSaved) {
      const saved = Object.values(load().bookmarks)
        .map((b) => b.question)
        .filter((q) => !requestedTopics.length || (q.topicId && requestedTopics.includes(q.topicId)));
      if (!saved.length) return setError("No saved questions yet. Tap ☆ Save on any question after answering it.");
      return setQuestions(shuffle(saved).slice(0, 20).map(shuffleOptions));
    }
    if (isMistakes) {
      if (!server) return setError("The mistake notebook needs an account. Log in on the full site to use it.");
      if (!account.user) return router.push(`/login?next=${encodeURIComponent(path + location.search)}`);
      const { status, data } = await postJson("/api/mistakes", { topicId: requestedTopics[0], count: 20 });
      if (status !== 200) return setError(data.error ?? "Could not load your mistakes.");
      if (!data.questions.length) return setError("Nothing in your mistake notebook for this yet. Wrong answers in practice and tests land here.");
      return setQuestions(data.questions);
    }
    if (isFullMock && plan) {
      // Demo build: the pattern mock is built section by section, as the server does.
      const all: MCQ[] = [];
      const built: QuizSection[] = [];
      for (const s of plan.sections) {
        const { ok, json } = await api("practice", { topicIds: s.topicIds, count: s.questions });
        if (!ok) return setError(json.error);
        const qs = (json.questions as MCQ[]).filter((q) => !all.some((x) => x.question === q.question));
        if (!qs.length) continue;
        built.push({ name: s.subject, from: all.length, count: qs.length, minutes: qs.length >= s.questions ? s.minutes : Math.max(1, Math.round((s.minutes * qs.length) / s.questions)) });
        all.push(...qs);
      }
      setLocalSections(built);
      return setQuestions(all);
    }
    const { ok, json } = await api("practice", {
      topicIds: key.split(","),
      count: size,
      weights: isSmart ? topicWeights(key.split(","), await statsForWeights()) : undefined,
    });
    if (!ok) setError(json.error);
    else setQuestions(json.questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, size, isSmart, isMistakes, isSaved, isFullMock, server, account.user, account.ready]);

  useEffect(() => {
    if (!account.ready) return;
    if ((key || isMistakes || isSaved) && phase === "running" && !(isTimed && server)) loadQuestions();
  }, [key, isMistakes, isSaved, loadQuestions, round, phase, isTimed, server, account.ready]);

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
    // The previous score of the same kind of test gives the "vs your last test" line.
    fetch("/api/tests", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { attempts: { examId: string; kind: string; score: number; total: number; marks: number }[] } | null) => {
        const kind = isSectionTest ? "section" : isTopicTest ? "topic" : "full";
        const last = d?.attempts.find((a) => a.examId === exam?.id && a.kind === kind);
        setPrevious(last ? { score: last.score * last.marks, total: last.total * last.marks } : null);
      })
      .catch(() => setPrevious(null));
    const { status, data } = await postJson("/api/tests/start", { examId: exam?.id, topicIds: isTopicTest ? requestedTopics : undefined, section: isSectionTest ? section : undefined });
    setStarting(false);
    if (status === 401) return loginFirst();
    if (status === 402) return setPhase("paywall");
    if (status !== 201) return setError(data.error ?? "Could not start the test.");
    // The server keeps the answers until submission; the browser only gets questions and options.
    setQuestions(data.questions.map((q: MCQ) => ({ ...q, answer: -1, explanation: "" })));
    setServerTest({ attemptId: data.attemptId, deadline: data.deadline, sections: data.sections, sectional: data.sectional, marks: data.marks, negativeMarking: data.negativeMarking });
    setPhase("running");
    setRound((r) => r + 1);
    account.refresh();
  };

  const submitToServer = async (chosen: (number | null)[], times: number[]): Promise<MCQ[]> => {
    const { status, data } = await postJson("/api/tests/submit", { attemptId: serverTest!.attemptId, answers: chosen, times });
    if (status !== 200) throw new Error(data.error ?? "Could not submit the test.");
    return data.questions;
  };

  const onFinish = (results: AnswerResult[]) => {
    const answered = results.filter((r) => r.chosen !== null);
    recordAnswers(answered.map((r) => ({ topicId: r.question.topicId, correct: r.correct })));
    // Timed tests are recorded by the server on submit; untimed practice posts its answers so
    // progress and the mistake notebook follow the account.
    if (!isTimed && server && account.user) {
      postJson("/api/progress", { answers: answered.filter((r) => r.question.topicId).map((r) => ({ questionId: r.question.id, topicId: r.question.topicId!, correct: r.correct })) }).catch(() => {});
    }
    if (isFullMock && exam) {
      const correct = results.filter((r) => r.correct).length;
      const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
      const marks = serverTest?.marks ?? plan?.pattern.marks ?? 1;
      const neg = serverTest?.negativeMarking ?? plan?.pattern.negative ?? exam.negativeMarking ?? 0;
      recordMock({ examId: exam.id, score: (correct - wrong * neg) * marks, maxScore: results.length * marks, correct, wrong, skipped: results.length - correct - wrong, takenAt: Date.now() });
    }
  };

  if (!topicIds.length && !isMistakes && !isSaved) {
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
  if (isTimed && server && !exam) {
    return <div className="card text-sm">Timed tests belong to an exam. <Link href="/exams" className="font-medium text-brand-700">Choose an exam</Link> first.</div>;
  }

  const topicName = requestedTopics.length === 1 ? TOPIC_BY_ID.get(requestedTopics[0])!.name : `${requestedTopics.length} topics`;
  const title = isSaved
    ? "My saved questions"
    : isMistakes
    ? `My mistakes${requestedTopics.length === 1 ? `: ${topicName}` : ""}`
    : isSectionTest
      ? `${exam?.name} · ${section} section test`
      : isTopicTest
        ? `${topicName}: timed test`
        : isFullMock
          ? `${exam?.name} full mock test${plan ? ` (${plan.pattern.paper} pattern)` : ""}`
          : isSmart
            ? `${exam?.name} smart practice`
            : requestedTopics.length === 1
              ? topicName
              : `Practice: ${topicName}`;
  const marks = serverTest?.marks ?? plan?.pattern.marks ?? 1;
  const negative = serverTest?.negativeMarking ?? (isTimed ? (plan?.pattern.negative ?? exam?.negativeMarking ?? 0) : 0);
  const marking = negative ? ` · −${+(negative * marks).toFixed(2)} mark${negative * marks === 1 ? "" : "s"} per wrong answer` : "";
  const count = questions?.length ?? size;
  const timeLimit = serverTest ? Math.max(30, Math.round((serverTest.deadline - Date.now()) / 1000)) : isSectionTest ? planSection!.minutes * 60 : localSections ? localSections.reduce((n, s) => n + s.minutes, 0) * 60 : count * 60;
  const sections = serverTest?.sections ?? localSections ?? undefined;
  const sectional = serverTest?.sectional ?? (!!localSections && !!plan?.pattern.sectional);

  const description = isSaved
    ? "Questions you starred to revise, up to 20 at a time in a new order."
    : isMistakes
    ? "Questions you got wrong before. Answer one correctly and it leaves your notebook."
    : isSectionTest
      ? `${planSection!.questions} questions · ${planSection!.minutes} minutes, as in the ${plan!.pattern.paper} paper${marking} · answers revealed after you submit`
      : isFullMock && plan
        ? `${totalQuestions(plan.sections)} questions · ${totalMinutes(plan.sections)} minutes · ${plan.sections.map((s) => `${s.subject} ${s.questions}`).join(", ")}${plan.pattern.sectional ? " · sectional timing" : ""}${marking}`
        : isTimed
          ? `Up to ${size} questions from easy to very hard · 1 minute per question · answers revealed after you submit${marking}`
          : isSmart
            ? "Adaptive: weak and unseen topics come up more often, mixed together for better long-term recall. Every set ramps from easy to very hard."
            : `${size} questions, ramping from easy to very hard · instant feedback with an explanation after every answer.`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        {exam ? (
          <Link href={`/exams/${exam.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> {exam.name} syllabus
          </Link>
        ) : isSaved ? (
          <Link href="/saved" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Saved questions
          </Link>
        ) : isMistakes ? (
          <Link href="/mistakes" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Mistake notebook
          </Link>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="card">
        {phase === "start" ? (
          !account.ready ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : server && !account.user ? (
            <div className="mx-auto max-w-sm space-y-4 py-6 text-center">
              <h2 className="text-lg font-semibold">Log in to take timed tests</h2>
              <p className="text-sm text-slate-600">Your first test for every exam is free. Your score, time analysis and mistakes are saved to your account.</p>
              <button className="btn-primary w-full py-2.5" onClick={loginFirst}>
                Log in or sign up
              </button>
            </div>
          ) : (
            <StartScreen access={testAccessFor(account, exam?.id)} credits={account.credits} sectional={isFullMock && !!plan?.pattern.sectional} onStart={start} onPaywall={() => setPhase("paywall")} busy={starting} error={error} />
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
            negativeMarking={isTimed ? negative : 0}
            marks={isTimed ? marks : 1}
            timeLimitSec={isTimed ? timeLimit : undefined}
            sections={isTimed ? sections : undefined}
            sectional={isTimed && sectional}
            previous={isTimed ? previous : null}
            submit={isTimed && serverTest ? submitToServer : undefined}
            onFinish={onFinish}
            onRestart={() => {
              setServerTest(null);
              setLocalSections(null);
              if (isTimed) setPhase("start");
              else setRound((r) => r + 1);
            }}
          />
        )}
      </div>
      {IS_STATIC && isTimed && <p className="text-xs text-slate-500">Demo build: scores stay in this browser.</p>}
    </div>
  );
}

function StartScreen({ access, credits, sectional, onStart, onPaywall, busy, error }: { access: "free" | "credit" | "none"; credits: number; sectional: boolean; onStart: () => void; onPaywall: () => void; busy: boolean; error: string }) {
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
        {sectional && <p className="mt-2 text-sm text-amber-700">Sectional timing: each section has its own clock and closes when it ends. You can’t go back to a closed section.</p>}
      </div>
      <button className="btn-primary w-full py-2.5" onClick={onStart} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Start test
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
