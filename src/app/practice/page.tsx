"use client";

import { ArrowLeft, ArrowRight, BookOpen, Info, Infinity as InfinityIcon, Loader2, Sparkles, Timer } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChallengeBox, readChallenge } from "@/components/Challenge";
import { ExamModeSwitch, PaletteLegend, useExamModePref } from "@/components/ExamMode";
import { TestPaywall } from "@/components/Paywall";
import { Quiz, type AnswerResult, type QuizSection } from "@/components/Quiz";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { mockPlan, totalMinutes, totalQuestions } from "@/data/patterns";
import { TOPIC_BY_ID } from "@/data/topics";
import { testAccessFor, useAccount } from "@/lib/account";
import { topicWeights } from "@/lib/adaptive";
import { api, IS_STATIC, postJson, request } from "@/lib/api";
import { DIFFICULTIES } from "@/lib/difficulty";
import { clearResume, readResume, writeResume, type QuizProgress } from "@/lib/practiceResume";
import { enterFullscreen, exitFullscreen } from "@/lib/questionNotes";
import { consumeTestAccess, load, recordAnswers, recordMock, type TopicStat } from "@/lib/storage";
import type { MCQ } from "@/lib/types";
import { shuffleOptions } from "@/lib/ai/local";
import { findQuestions } from "@/lib/bank";
import { shuffle } from "@/lib/nlp";
import { track } from "@/lib/track";
import { canUnlimited, isUnlimitedLevel, questionKey, readUnlimitedSession, UNLIMITED_HINT, UNLIMITED_LEVEL_LABEL, UNLIMITED_LEVELS, UNLIMITED_SET_SIZE, writeUnlimitedSession, type UnlimitedLevel } from "@/lib/unlimited";
import { useStore } from "@/lib/useStore";
import { isWeeklyExam } from "@/lib/weekly";

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
const TIMED_SET_SIZE = 20;

type Phase = "start" | "paywall" | "running";

interface ServerTest {
  attemptId: string;
  deadline: number;
  sections: QuizSection[] | null;
  sectional: boolean;
  marks: number;
  negativeMarking: number;
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
  // A free timed practice set: smart practice on a clock. It never uses the free test or credits.
  const isTimedSet = isSmart && !isTimed && params.get("timed") === "1";
  // A friend's challenge link: the same questions they answered, plus their score.
  const challenge = readChallenge(params);
  const section = params.get("section") ?? "";
  const requestedTopics = (params.get("topics") ?? "").split(",").filter((t) => TOPIC_BY_ID.has(t));
  // Unlimited practice: generated Quant questions only, ten at a time, for as long as the student likes.
  const wantsUnlimited = params.get("unlimited") === "1" && !isTimed && !isSmart && !isMistakes && !isSaved && !challenge;
  const unlimitedTopics = requestedTopics.filter(canUnlimited);
  const isUnlimited = wantsUnlimited && unlimitedTopics.length > 0;
  const plan = exam ? mockPlan(exam) : null;
  const planSection = section && plan ? plan.sections.find((s) => s.subject === section) : undefined;
  // A timed test covers one paper section, the chosen topics, or the whole exam syllabus.
  const isSectionTest = isTimed && !!planSection;
  const isTopicTest = isTimed && !isSectionTest && requestedTopics.length > 0;
  const isFullMock = isTimed && !isSectionTest && !isTopicTest;
  // The Sunday All-India Mock: a full mock on the week's shared paper, free, one attempt a week.
  const isWeekly = isFullMock && params.get("weekly") === "1" && !!exam && isWeeklyExam(exam.id);
  const topicIds = isUnlimited ? unlimitedTopics : isSectionTest ? planSection!.topicIds : isTopicTest ? requestedTopics : (isTimed || isSmart) && exam ? examTopicIds(exam) : requestedTopics;
  const size = isUnlimited ? UNLIMITED_SET_SIZE : isSectionTest ? planSection!.questions : isTopicTest ? TOPIC_TEST_SIZE : isFullMock ? (plan ? totalQuestions(plan.sections) : MOCK_SIZE) : isTimedSet ? TIMED_SET_SIZE : PRACTICE_SIZE;

  const [phase, setPhase] = useState<Phase>(isTimed || isUnlimited ? "start" : "running");
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [serverTest, setServerTest] = useState<ServerTest | null>(null);
  const [localSections, setLocalSections] = useState<QuizSection[] | null>(null);
  const [previous, setPrevious] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState("");
  // False when the "error" is really an empty list (no saved questions, nothing in the notebook): retrying won't help.
  const [retryable, setRetryable] = useState(true);
  const [starting, setStarting] = useState(false);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState<AnswerResult[] | null>(null);
  // Exam mode (CBT-style full-screen layout) for timed tests; the choice is remembered.
  const [examMode, setExamMode] = useExamModePref();
  const key = topicIds.join(",");
  // Untimed sets are kept in this tab per URL, so a refresh or reopened tab resumes them.
  // An unlimited session keeps one set in progress per topic choice, whatever the level in the link.
  const resumeKey = isUnlimited ? `${path}?topics=${key}&unlimited=1` : !isTimed && !isTimedSet ? `${path}?${params.toString()}` : null;
  const [resumed, setResumed] = useState<QuizProgress | null>(null);
  const skipResume = useRef(false);
  // Unlimited practice: the level, the session tally and the questions already shown (never repeated in a session).
  const levelParam = params.get("level");
  const [level, setLevel] = useState<UnlimitedLevel>(isUnlimitedLevel(levelParam) ? levelParam : "mixed");
  const [tally, setTally] = useState({ sets: 0, correct: 0, attempted: 0 });
  const [recycled, setRecycled] = useState(false);
  const seen = useRef<Set<string>>(new Set());
  // The tally is also kept in a ref, so saving the session never writes a stale count from an older render.
  const tallyRef = useRef(tally);
  const saveSession = (l: UnlimitedLevel, t?: { sets: number; correct: number; attempted: number }) => {
    if (t) {
      tallyRef.current = t;
      setTally(t);
    }
    writeUnlimitedSession(key, { level: l, ...tallyRef.current, seen: [...seen.current] });
  };

  // A refresh or reopened tab picks the unlimited session up again: tally, level, seen questions and any set in progress.
  useEffect(() => {
    if (!isUnlimited) return;
    const s = readUnlimitedSession(key);
    seen.current = new Set(s?.seen ?? []);
    tallyRef.current = s ? { sets: s.sets, correct: s.correct, attempted: s.attempted } : { sets: 0, correct: 0, attempted: 0 };
    setTally(tallyRef.current);
    setRecycled(false);
    if (s && !isUnlimitedLevel(levelParam)) setLevel(s.level);
    setPhase(readResume(`${path}?topics=${key}&unlimited=1`) ? "running" : "start");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlimited, key]);

  // Full screen is requested on the Start click; leave it if the test didn't start after all.
  useEffect(() => {
    if (phase !== "running" || error) exitFullscreen();
  }, [phase, error]);

  // Smart practice weights come from the account's progress when signed in, else this browser's.
  const statsForWeights = useCallback(async (): Promise<Record<string, TopicStat>> => {
    if (server && account.user) {
      const res = await request("/api/progress", { cache: "no-store" }).catch(() => null);
      if (res?.ok) return ((await res.json()) as { topics: Record<string, TopicStat> }).topics;
    }
    return load().topics;
  }, [server, account.user]);

  // Untimed practice (and timed tests on the static build) load questions directly.
  const loadQuestions = useCallback(async () => {
    setQuestions(null);
    setError("");
    setRetryable(true);
    const nothing = (msg: string) => {
      setRetryable(false);
      setError(msg);
    };
    setFinished(null);
    setResumed(null);
    if (resumeKey) {
      const saved = skipResume.current ? null : readResume(resumeKey);
      skipResume.current = false;
      if (saved) {
        setResumed(saved.progress);
        return setQuestions(saved.questions);
      }
    }
    if (challenge) {
      const found = await findQuestions(challenge.ids);
      const qs = challenge.ids.flatMap((id) => (found.has(id) ? [shuffleOptions(found.get(id)!)] : []));
      if (!qs.length) return nothing("This challenge link doesn’t match any questions. Ask your friend to send it again.");
      return setQuestions(qs);
    }
    if (isSaved) {
      const saved = Object.values(load().bookmarks)
        .map((b) => b.question)
        .filter((q) => !requestedTopics.length || (q.topicId && requestedTopics.includes(q.topicId)));
      if (!saved.length) return nothing("No saved questions yet. Tap ☆ Save on any question after answering it.");
      return setQuestions(shuffle(saved).slice(0, 20).map((q) => shuffleOptions(q)));
    }
    if (isMistakes) {
      if (!server) return nothing("The mistake notebook needs an account. Log in on the full site to use it.");
      if (!account.user) return router.push(`/login?next=${encodeURIComponent(path + location.search)}`);
      const { status, data } = await postJson("/api/mistakes", { topicId: requestedTopics[0], count: 20 });
      if (status !== 200) return setError(data.error ?? "Could not load your mistakes.");
      if (!data.questions.length) return nothing("Nothing in your mistake notebook for this yet. Wrong answers in practice and tests land here.");
      return setQuestions(data.questions);
    }
    if (isUnlimited) {
      // Generated questions only. Anything this session has already shown is dropped and replaced by a
      // fresh question of the same difficulty, so the set keeps its shape and nothing repeats.
      const picked: MCQ[] = [];
      let need: MCQ["difficulty"][] | null = null;
      let spare: MCQ[] = [];
      for (let attempt = 0; attempt < 4 && (need === null || need.length > 0); attempt++) {
        const { ok, json } = await api("practice", { topicIds: key.split(","), count: UNLIMITED_SET_SIZE, generated: true, level });
        if (!ok) return setError(json.error);
        const got = json.questions as MCQ[];
        const fresh = got.filter((q) => !seen.current.has(questionKey(q.question)) && !picked.some((p) => p.question === q.question));
        spare = got.filter((q) => !picked.some((p) => p.question === q.question));
        if (need === null) {
          picked.push(...fresh);
          need = got.filter((q) => !fresh.includes(q)).map((q) => q.difficulty);
        } else {
          for (const q of fresh) {
            const i = need.indexOf(q.difficulty);
            if (i < 0) continue;
            need.splice(i, 1);
            picked.push(q);
          }
        }
      }
      if (need?.length) {
        // Every variation at this level has been shown: start the cycle again rather than run dry.
        seen.current.clear();
        for (const q of spare) if (picked.length < UNLIMITED_SET_SIZE && !picked.some((p) => p.question === q.question)) picked.push(q);
        setRecycled(true);
      }
      if (!picked.length) return setError("Could not make new questions just now.");
      for (const q of picked) seen.current.add(questionKey(q.question));
      saveSession(level);
      const rank = (q: MCQ) => DIFFICULTIES.indexOf(q.difficulty ?? "moderate");
      return setQuestions(picked.map((q, i) => ({ q, i })).sort((a, b) => rank(a.q) - rank(b.q) || a.i - b.i).map(({ q }) => q));
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
  }, [key, size, isSmart, isMistakes, isSaved, isFullMock, isUnlimited, level, server, account.user, account.ready, params, resumeKey]);

  useEffect(() => {
    if (!account.ready) return;
    if ((key || isMistakes || isSaved || challenge) && phase === "running" && !(isTimed && server)) {
      loadQuestions();
      track(isTimed ? "mock_start" : "practice_start");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    request("/api/tests", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { attempts: { examId: string; kind: string; score: number; total: number; marks: number }[] } | null) => {
        const kind = isWeekly ? "weekly" : isSectionTest ? "section" : isTopicTest ? "topic" : "full";
        const last = d?.attempts.find((a) => a.examId === exam?.id && a.kind === kind);
        setPrevious(last ? { score: last.score * last.marks, total: last.total * last.marks } : null);
      })
      .catch(() => setPrevious(null));
    const { status, data } = await postJson("/api/tests/start", { examId: exam?.id, topicIds: isTopicTest ? requestedTopics : undefined, section: isSectionTest ? section : undefined, weekly: isWeekly || undefined });
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
    track("mock_start");
  };

  const submitToServer = async (chosen: (number | null)[], times: number[]): Promise<MCQ[]> => {
    const { status, data } = await postJson("/api/tests/submit", { attemptId: serverTest!.attemptId, answers: chosen, times });
    if (status !== 200) throw new Error(data.error ?? "Could not submit the test.");
    track("mock_submit");
    return data.questions;
  };

  const onFinish = (results: AnswerResult[]) => {
    if (resumeKey) clearResume(resumeKey);
    setResumed(null);
    if (!isTimed) setFinished(results);
    const answered = results.filter((r) => r.chosen !== null);
    if (isUnlimited) {
      const t = tallyRef.current;
      saveSession(level, { sets: t.sets + 1, correct: t.correct + results.filter((r) => r.correct).length, attempted: t.attempted + answered.length });
    }
    recordAnswers(answered.map((r) => ({ topicId: r.question.topicId, correct: r.correct })));
    // Timed tests are recorded by the server on submit; untimed practice posts its answers so
    // progress and the mistake notebook follow the account.
    if (!isTimed && server && account.user) {
      postJson("/api/progress", { answers: answered.filter((r) => r.question.topicId).map((r) => ({ questionId: r.question.id, topicId: r.question.topicId!, correct: r.correct, chosenText: r.chosen === null ? null : (r.question.options[r.chosen] ?? null) })) }).catch(() => {});
    }
    if (isFullMock && exam) {
      const correct = results.filter((r) => r.correct).length;
      const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
      const marks = serverTest?.marks ?? plan?.pattern.marks ?? 1;
      const neg = serverTest?.negativeMarking ?? plan?.pattern.negative ?? exam.negativeMarking ?? 0;
      recordMock({ examId: exam.id, score: (correct - wrong * neg) * marks, maxScore: results.length * marks, correct, wrong, skipped: results.length - correct - wrong, takenAt: Date.now() });
    }
  };

  if (wantsUnlimited && !isUnlimited) return <UnlimitedUnavailable topicId={requestedTopics[0]} />;
  if (!topicIds.length && !isMistakes && !isSaved && !challenge) return <PickPractice />;
  if (isTimed && server && !exam) {
    return <div className="card text-sm">Timed tests belong to an exam. <Link href="/exams" className="font-medium text-brand-700">Choose an exam</Link> first.</div>;
  }

  const topicName = requestedTopics.length === 1 ? TOPIC_BY_ID.get(requestedTopics[0])!.name : `${requestedTopics.length} topics`;
  const title = challenge
    ? `${challenge.by} challenged you`
    : isUnlimited
    ? `Unlimited practice: ${unlimitedTopics.length === 1 ? TOPIC_BY_ID.get(unlimitedTopics[0])!.name : `${unlimitedTopics.length} Quant topics`}`
    : isSaved
    ? "My saved questions"
    : isMistakes
    ? `My mistakes${requestedTopics.length === 1 ? `: ${topicName}` : ""}`
    : isWeekly
    ? `${exam?.name} · Sunday All-India Mock`
    : isSectionTest
      ? `${exam?.name} · ${section} section test`
      : isTopicTest
        ? `${topicName}: timed test`
        : isFullMock
          ? `${exam?.name} full mock test${plan ? ` (${plan.pattern.paper} pattern)` : ""}`
          : isTimedSet
            ? `${exam?.name} timed practice set`
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

  const weeklyNote = isWeekly ? "Same paper for every student this week · free · one attempt · " : "";
  const description = challenge
    ? `${challenge.ids.length} questions · ${challenge.by} scored ${challenge.score}/${challenge.ids.length}. Answer them all, then compare.`
    : isUnlimited
    ? `${UNLIMITED_HINT}. ${UNLIMITED_SET_SIZE} questions at a time, with the answer and working after each one. Free, with no daily limit.`
    : isSaved
    ? "Questions you starred to revise, up to 20 at a time in a new order."
    : isMistakes
    ? "Questions you got wrong before. Answer one correctly and it leaves your notebook."
    : isSectionTest
      ? `${planSection!.questions} questions · ${planSection!.minutes} minutes, as in the ${plan!.pattern.paper} paper${marking} · answers revealed after you submit`
      : isFullMock && plan
        ? `${weeklyNote}${totalQuestions(plan.sections)} questions · ${totalMinutes(plan.sections)} minutes · ${plan.sections.map((s) => `${s.subject} ${s.questions}`).join(", ")}${plan.pattern.sectional ? " · sectional timing" : ""}${marking}`
        : isTimed
          ? `Up to ${size} questions from easy to very hard · 1 minute per question · answers revealed after you submit${marking}`
          : isTimedSet
            ? `Free: doesn’t use your free test or credits · ${size} adaptive questions · 1 minute per question · answers revealed after you submit`
          : isSmart
            ? `${size} questions picked for you, more from topics you find hard or haven’t tried yet. They start easy and get harder. You see the answer and an explanation after each one.`
            : `${size} questions that start easy and get harder. You see the answer and an explanation after each one.`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        {isWeekly ? (
          <Link href="/mock-sunday" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Sunday All-India Mock
          </Link>
        ) : exam ? (
          <Link href={`/exams/${exam.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> {exam.name} syllabus
          </Link>
        ) : isUnlimited ? (
          <Link href={unlimitedTopics.length === 1 ? `/topics/${unlimitedTopics[0]}` : "/drills#unlimited"} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> {unlimitedTopics.length === 1 ? TOPIC_BY_ID.get(unlimitedTopics[0])!.name : "Unlimited Quant questions"}
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
      {isUnlimited && phase === "running" && (
        <div className="flex flex-wrap items-center gap-2 text-sm" role="status" aria-label="This session">
          <span className="chip bg-brand-50 text-brand-800">
            <InfinityIcon className="h-3.5 w-3.5" aria-hidden /> {UNLIMITED_LEVEL_LABEL[level]}
          </span>
          <span className="chip bg-slate-100 text-slate-700">Sets done: {tally.sets}</span>
          <span className="chip bg-slate-100 text-slate-700">
            Correct: {tally.correct}/{tally.attempted}
            {tally.attempted > 0 && ` (${Math.round((tally.correct * 100) / tally.attempted)}%)`}
          </span>
          <button
            type="button"
            className="min-h-10 px-1 font-medium text-brand-700 underline underline-offset-2"
            onClick={() => {
              if (resumeKey) clearResume(resumeKey);
              setQuestions(null);
              setFinished(null);
              setPhase("start");
            }}
          >
            Change level
          </button>
        </div>
      )}
      <div className="card">
        {phase === "start" && isUnlimited ? (
          <UnlimitedStart
            level={level}
            setLevel={setLevel}
            tally={tally}
            onStart={() => {
              saveSession(level);
              setPhase("running");
              setRound((r) => r + 1);
            }}
          />
        ) : phase === "start" ? (
          !account.ready ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : isWeekly && !server ? (
            <div className="mx-auto max-w-sm space-y-3 py-6 text-center">
              <h2 className="text-lg font-semibold">Available on the full site</h2>
              <p className="text-sm text-slate-600">The Sunday All-India Mock ranks you against every student who takes it, so it needs an account on the full StudyClip site.</p>
              <Link href="/mock-sunday" className="btn-ghost">
                Sunday mock schedule
              </Link>
            </div>
          ) : server && !account.user ? (
            <div className="mx-auto max-w-sm space-y-4 py-6 text-center">
              <h2 className="text-lg font-semibold">{isWeekly ? "Log in to take the All-India mock" : "Log in to take timed tests"}</h2>
              <p className="text-sm text-slate-600">{isWeekly ? "It’s free and doesn’t use your free test or credits. Your rank is saved to your account." : "Your first test for every exam is free. Your score, time analysis and mistakes are saved to your account."}</p>
              <button className="btn-primary w-full py-2.5" onClick={loginFirst}>
                Log in or sign up
              </button>
            </div>
          ) : (
            <StartScreen rules={{ questions: isFullMock && plan ? totalQuestions(plan.sections) : isSectionTest ? planSection!.questions : size, upTo: !(isFullMock && plan) && !isSectionTest, minutes: isFullMock && plan ? totalMinutes(plan.sections) : isSectionTest ? planSection!.minutes : size, marks, negative: negative * marks }} access={isWeekly ? "weekly" : testAccessFor(account, exam?.id)} credits={account.credits} sectional={isFullMock && !!plan?.pattern.sectional} examMode={examMode} setExamMode={setExamMode} onStart={start} onPaywall={() => setPhase("paywall")} busy={starting} error={error} />
          )
        ) : phase === "paywall" ? (
          <TestPaywall used={exam && account.freeTestsUsed.includes(exam.id) ? "free-used" : "no-credits"} onUnlocked={() => setPhase("start")} />
        ) : error ? (
          <div className="space-y-3 py-2 text-sm" role={retryable ? "alert" : "status"}>
            <p className="font-semibold text-slate-900">{retryable ? "Couldn’t load the questions" : "Nothing to show here yet"}</p>
            <p className="text-slate-600">{error}</p>
            <div className="flex flex-wrap gap-2">
              {retryable && (
                <button type="button" className="btn-primary" onClick={() => setRound((r) => r + 1)}>
                  Try again
                </button>
              )}
              <Link href={exam ? `/exams/${exam.id}` : isSaved ? "/saved" : isMistakes ? "/mistakes" : "/topics"} className={retryable ? "btn-ghost" : "btn-primary"}>
                {exam ? `Back to ${exam.name}` : isSaved ? "Saved questions" : isMistakes ? "Mistake notebook" : "Choose a topic"}
              </Link>
            </div>
          </div>
        ) : !questions ? (
          <p className="text-sm text-slate-500">Preparing questions…</p>
        ) : (
          <>
          {recycled && isUnlimited && (
            <p className="-mx-1 mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
              You have now seen every question this level can make for {unlimitedTopics.length === 1 ? "this topic" : "these topics"}, so some will come round again. Try another level for new ones.
            </p>
          )}
          {resumed && (
            <div className="-mx-1 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900" role="status">
              <span>Resumed where you left off</span>
              <button
                type="button"
                className="min-h-10 font-medium text-brand-700 underline underline-offset-2"
                onClick={() => {
                  if (resumeKey) clearResume(resumeKey);
                  skipResume.current = true;
                  setRound((r) => r + 1);
                }}
              >
                Start fresh
              </button>
            </div>
          )}
          <Quiz
            key={round}
            questions={questions}
            initial={resumed}
            onProgress={resumeKey ? (p) => writeResume(resumeKey, questions, p) : undefined}
            mode={isTimed || isTimedSet ? "mock" : "practice"}
            negativeMarking={isTimed ? negative : 0}
            marks={isTimed ? marks : 1}
            timeLimitSec={isTimed ? timeLimit : isTimedSet ? count * 60 : undefined}
            sections={isTimed ? sections : undefined}
            sectional={isTimed && sectional}
            previous={isTimed ? previous : null}
            submit={isTimed && serverTest ? submitToServer : undefined}
            attemptId={isTimed ? serverTest?.attemptId : undefined}
            onFinish={onFinish}
            share={{ title: challenge ? "Challenge set" : title, examId: exam?.id }}
            examMode={isTimed && examMode}
            candidate={account.user?.name ?? undefined}
            restartLabel={isUnlimited ? `Next ${UNLIMITED_SET_SIZE} questions` : undefined}
            restartFirst={isUnlimited}
            onRestart={() => {
              setServerTest(null);
              setLocalSections(null);
              if (isTimed) setPhase("start");
              else setRound((r) => r + 1);
            }}
          />
          </>
        )}
      </div>
      {finished && !isTimed && !isMistakes && !isUnlimited && <ChallengeBox results={finished} challenge={challenge} />}
      {IS_STATIC && isTimed && <p className="text-xs text-slate-500">Demo build: scores stay in this browser.</p>}
    </div>
  );
}

const LEVEL_NOTE: Record<UnlimitedLevel, string> = {
  mixed: "Starts easy and gets harder, like a normal practice set.",
  easy: "Direct, one-step questions to learn the method.",
  moderate: "Standard exam questions.",
  hard: "Two-step questions that need a little more thought.",
  "very-hard": "The hardest questions, at topper level.",
};

/** The first screen of unlimited practice: choose a level, then start. */
function UnlimitedStart({ level, setLevel, tally, onStart }: { level: UnlimitedLevel; setLevel: (l: UnlimitedLevel) => void; tally: { sets: number; correct: number; attempted: number }; onStart: () => void }) {
  return (
    <div className="mx-auto max-w-md space-y-4 py-4 text-center sm:py-6">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-700">
        <InfinityIcon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <h2 className="text-lg font-semibold">Choose a level</h2>
        <p className="mt-1 text-sm text-slate-600">{UNLIMITED_HINT}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Difficulty level">
        {UNLIMITED_LEVELS.map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={level === l}
            onClick={() => setLevel(l)}
            className={`chip min-h-10 px-3.5 text-sm ${level === l ? "bg-ink text-on-ink" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {UNLIMITED_LEVEL_LABEL[l]}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-600">{LEVEL_NOTE[level]}</p>
      <button type="button" className="btn-primary w-full py-2.5" onClick={onStart}>
        {tally.sets > 0 ? `Next ${UNLIMITED_SET_SIZE} questions` : `Start: ${UNLIMITED_SET_SIZE} questions`} <ArrowRight className="h-4 w-4" />
      </button>
      <p className="text-xs text-slate-500">
        {tally.sets > 0 ? `This session: ${tally.sets} set${tally.sets === 1 ? "" : "s"} done · ${tally.correct}/${tally.attempted} correct. ` : ""}
        Every set is new, and no question repeats in a session. No login needed.
      </p>
    </div>
  );
}

/** An unlimited link for a topic that has no question generator: say so and offer what does work. */
function UnlimitedUnavailable({ topicId }: { topicId?: string }) {
  const topic = topicId ? TOPIC_BY_ID.get(topicId) : undefined;
  return (
    <div className="card mx-auto max-w-xl space-y-3 text-sm">
      <h1 className="text-lg font-semibold text-slate-900">Unlimited practice is for Quant topics</h1>
      <p className="text-slate-600">Questions with new numbers every time can only be made for the 12 Quantitative Aptitude topics.{topic ? ` ${topic.name} has its own question bank instead.` : ""}</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/drills#unlimited" className="btn-primary">
          See the 12 Quant topics
        </Link>
        {topic && (
          <Link href={`/practice?topics=${topic.id}`} className="btn-ghost">
            Practise {topic.name}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * /practice with nothing chosen (an old link, or the address typed in): offer the student's own
 * exam in one tap instead of a dead end, or the exam list when none is chosen yet.
 */
function PickPractice() {
  const store = useStore();
  const mine = EXAM_BY_ID.get(store?.examId ?? "");
  const options = mine
    ? [
        { href: `/practice?exam=${mine.id}&smart=1`, icon: Sparkles, title: "Start practice", text: `10 ${mine.name} questions, picked for you, with an answer and explanation after each one.` },
        { href: `/exams/${mine.id}`, icon: BookOpen, title: "Pick one topic", text: `Choose a single ${mine.name} topic to practise.` },
        { href: `/practice?exam=${mine.id}&mock=1`, icon: Timer, title: "Take a mock test", text: "A full timed paper, like the real exam." },
      ]
    : [
        { href: "/exams", icon: Sparkles, title: "Choose your exam", text: "Pick the exam you are preparing for. Practice sets follow its syllabus." },
        { href: "/topics", icon: BookOpen, title: "Browse all topics", text: "Practise any topic without choosing an exam." },
      ];
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Practice</h1>
        <p className="text-sm text-slate-600">{mine ? `What would you like to do for ${mine.name}?` : "Choose what to practise first."}</p>
      </div>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <Link key={o.href} href={o.href} className={`group flex items-center gap-3 rounded-xl p-4 transition-[opacity,border-color,background-color] ${i === 0 ? "bg-ink text-on-ink hover:opacity-90" : "border border-slate-200 bg-surface text-slate-900 hover:border-slate-300 hover:bg-slate-50"}`}>
            <o.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{o.title}</span>
              <span className={`block text-xs ${i === 0 ? "text-on-ink/70" : "text-slate-500"}`}>{o.text}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  );
}

interface TestRules {
  questions: number;
  /** Topic tests and demo mocks may come up a little short of the target count. */
  upTo: boolean;
  minutes: number;
  /** Marks for a right answer, and marks lost for a wrong one (0 when there is no negative marking). */
  marks: number;
  negative: number;
}

/** "How this test works": time, marking, moving around, the palette colours and when answers show. */
function HowItWorks({ rules, sectional, examMode }: { rules: TestRules; sectional: boolean; examMode: boolean }) {
  const n = (x: number) => +x.toFixed(2);
  const plural = (x: number, w: string) => `${n(x)} ${w}${x === 1 ? "" : "s"}`;
  return (
    <section aria-labelledby="how-heading" className="rounded-xl border border-slate-200 p-4 text-left text-sm text-slate-700">
      <h3 id="how-heading" className="flex items-center gap-1.5 font-semibold text-slate-900">
        <Info className="h-4 w-4 text-brand-600" /> How this test works
      </h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5">
        <li>
          <b>{rules.upTo ? "Up to " : ""}{rules.questions} questions in {rules.minutes} minutes.</b> The clock starts when you tap Start. When time is up, the test submits itself.
        </li>
        <li>
          Right answer: <b className="text-emerald-700">+{plural(rules.marks, "mark")}</b>.{" "}
          {rules.negative > 0 ? (
            <>
              Wrong answer: <b className="text-red-600">−{plural(rules.negative, "mark")}</b>. Left blank: 0. If you are only guessing, it is safer to skip.
            </>
          ) : (
            <>Wrong or blank: 0. There is no negative marking, so answer every question.</>
          )}
        </li>
        {sectional && <li>Each section has its own clock and closes when its time ends. You can’t go back to a closed section.</li>}
        <li>Tap a question number to jump to it. Use <b>Mark for review</b> to come back to a question before you submit.</li>
        <li>Answers and explanations appear after you submit.</li>
      </ul>
      <p className="mt-3 mb-1.5 text-xs font-medium text-slate-500">Question number colours</p>
      <PaletteLegend examMode={examMode} />
    </section>
  );
}

function StartScreen({ rules, access, credits, sectional, examMode, setExamMode, onStart, onPaywall, busy, error }: { rules: TestRules; access: "free" | "credit" | "none" | "weekly"; credits: number; sectional: boolean; examMode: boolean; setExamMode: (on: boolean) => void; onStart: () => void; onPaywall: () => void; busy: boolean; error: string }) {
  useEffect(() => {
    if (access === "none") onPaywall();
  }, [access, onPaywall]);
  return (
    <div className="mx-auto max-w-md space-y-4 py-4 text-center sm:py-6">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-600">
        <Timer className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-lg font-semibold">Ready when you are</h2>
        <p className="mt-1 text-sm text-slate-600">
          {access === "weekly" ? "This mock is free and you get one attempt this week, so finish it in one sitting. It closes at 10 pm India time." : access === "free" ?"This uses your free test for this exam." : `This uses 1 of your ${credits} test credit${credits === 1 ? "" : "s"}.`}
        </p>
      </div>
      <HowItWorks rules={rules} sectional={sectional} examMode={examMode} />
      <ExamModeSwitch on={examMode} onChange={setExamMode} />
      <button
        className="btn-primary w-full py-2.5"
        onClick={() => {
          // Full screen needs the click itself, so it is asked for here rather than once the test loads.
          if (examMode) enterFullscreen();
          onStart();
        }}
        disabled={busy}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Start test
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
