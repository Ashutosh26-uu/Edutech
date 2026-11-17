"use client";

import { ArrowRight, Check, ChevronDown, Loader2, Mic, MicOff, RotateCcw, Sparkles, Square, Timer, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { INTERVIEW } from "@/data/interview";
import { useAccount } from "@/lib/account";
import { IS_STATIC, postJson, request } from "@/lib/api";
import { pickQuestions, roundOf, type AiFeedback, type PickedQuestion } from "@/lib/interviewAiShared";
import { analyse, scorecard, type Analysis, type Round } from "@/lib/interviewCoach";

const ROUNDS: { id: Round; label: string; hint: string }[] = [
  { id: "mixed", label: "Full interview", hint: "Intro, HR, behavioural and technical, like a real panel" },
  { id: "hr", label: "HR round", hint: "About you, strengths, goals, salary" },
  { id: "behavioural", label: "Behavioural", hint: "Situations, answered with STAR" },
  { id: "technical", label: "Technical", hint: "OOP, DSA, DBMS, OS, networks, programming" },
  { id: "project", label: "Project", hint: "Explaining your project and internship" },
];
const HISTORY_KEY = "studyclip:mock-interviews";

interface Answer {
  q: PickedQuestion;
  text: string;
  seconds: number | null;
  analysis: Analysis;
  ai?: AiFeedback & { provider?: string };
  aiError?: string;
  followUp?: { question: string; text: string; analysis: Analysis; ai?: AiFeedback; aiError?: string };
}
interface Past {
  at: number;
  round: Round;
  count: number;
  overall: number;
  ai: number | null;
}

const itemOf = (q: PickedQuestion) => INTERVIEW.find((s) => s.id === q.sectionId)!.items[q.index];
const sectionOf = (q: PickedQuestion) => INTERVIEW.find((s) => s.id === q.sectionId)!;

function loadHistory(): Past[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.slice(0, 20) : [];
  } catch {
    return [];
  }
}
function saveHistory(p: Past) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([p, ...loadHistory()].slice(0, 20)));
  } catch {
    /* storage blocked: history is a convenience */
  }
}

// ---------- Speech (browser built-in, free) ----------

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};
const recognitionCtor = (): (new () => Recognition) | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

/** Speech-to-text into a text box: keeps what was already typed, and restarts when the browser stops on a pause. */
function useDictation(onText: (t: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const rec = useRef<Recognition | null>(null);
  const want = useRef(false);
  const base = useRef("");
  const finals = useRef("");
  const startedAt = useRef<number | null>(null);
  const spoken = useRef(0);

  useEffect(() => setSupported(!!recognitionCtor()), []);

  const stop = useCallback(() => {
    want.current = false;
    rec.current?.stop();
    if (startedAt.current) spoken.current += (Date.now() - startedAt.current) / 1000;
    startedAt.current = null;
    setListening(false);
  }, []);

  const start = useCallback(
    (current: string) => {
      const Ctor = recognitionCtor();
      if (!Ctor) return;
      setError("");
      base.current = current.trim() ? current.trim() + " " : "";
      finals.current = "";
      const r = new Ctor();
      r.lang = "en-IN";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finals.current += res[0].transcript + " ";
          else interim += res[0].transcript;
        }
        onText((base.current + finals.current + interim).replace(/\s+/g, " ").trimStart());
      };
      r.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          want.current = false;
          setError("Microphone permission was refused. Allow it in the browser, or type your answer.");
        }
      };
      r.onend = () => {
        // Chrome stops after a pause; carry on until the student presses Stop.
        if (want.current) {
          base.current = base.current + finals.current;
          finals.current = "";
          try {
            r.start();
          } catch {
            /* already started */
          }
        } else setListening(false);
      };
      rec.current = r;
      want.current = true;
      startedAt.current = Date.now();
      try {
        r.start();
        setListening(true);
      } catch {
        setError("Could not start the microphone. Type your answer instead.");
      }
    },
    [onText],
  );

  const takeSeconds = () => {
    const s = spoken.current + (startedAt.current ? (Date.now() - startedAt.current) / 1000 : 0);
    spoken.current = 0;
    startedAt.current = listening ? Date.now() : null;
    return s > 0 ? Math.round(s) : null;
  };

  useEffect(() => () => {
    want.current = false;
    rec.current?.abort();
  }, []);

  return { supported, listening, error, start, stop, takeSeconds };
}

function say(text: string, on: boolean) {
  if (!on || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/`/g, ""));
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang === "en-IN") ?? window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
  if (voice) u.voice = voice;
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

// ---------- Page ----------

export default function MockInterviewPage() {
  const account = useAccount();
  const [phase, setPhase] = useState<"setup" | "question" | "feedback" | "done">("setup");
  const [round, setRound] = useState<Round>("mixed");
  const [count, setCount] = useState(6);
  const [minutes, setMinutes] = useState(2);
  const [voice, setVoice] = useState(true);
  const [questions, setQuestions] = useState<PickedQuestion[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [text, setText] = useState("");
  const [left, setLeft] = useState(0);
  const [followUpOf, setFollowUpOf] = useState<number | null>(null);
  const [aiOn, setAiOn] = useState<boolean | null>(null);
  const [history, setHistory] = useState<Past[]>([]);
  const dictation = useDictation(setText);

  useEffect(() => setHistory(loadHistory()), []);
  useEffect(() => {
    if (IS_STATIC) return setAiOn(false);
    request("/api/interview/feedback", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => setAiOn(!!d.enabled))
      .catch(() => setAiOn(false));
  }, []);
  const canAi = !!aiOn && !!account.user;

  const current = questions[i];
  const askedText = followUpOf !== null ? answers[followUpOf]?.ai?.followUp ?? "" : current ? itemOf(current).q : "";

  // Read each question aloud (the clock is set when the question is opened).
  useEffect(() => {
    if (phase !== "question" || !askedText) return;
    say(askedText, voice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, askedText]);

  const submit = useCallback(() => {
    if (!current) return;
    dictation.stop();
    window.speechSynthesis?.cancel();
    const seconds = dictation.takeSeconds();
    const item = itemOf(current);
    const r = roundOf(current.sectionId);
    if (followUpOf !== null) {
      const a = analyse({ answer: text, question: askedText, modelAnswer: "", round: r, speakingSeconds: seconds });
      setAnswers((xs) => xs.map((x, k) => (k === followUpOf ? { ...x, followUp: { question: askedText, text, analysis: a } } : x)));
      if (canAi && text.trim()) aiFeedback(followUpOf, { followUp: askedText, answer: text }, true);
    } else {
      const a = analyse({ answer: text, question: item.q, modelAnswer: item.a, round: r, speakingSeconds: seconds });
      const n = answers.length;
      setAnswers((xs) => [...xs, { q: current, text, seconds, analysis: a }]);
      if (canAi && text.trim()) aiFeedback(n, { answer: text }, false);
    }
    setText("");
    setPhase("feedback");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, text, followUpOf, askedText, canAi, answers.length]);

  // Countdown; at zero the answer is submitted as it stands. The latest submit lives in a ref so
  // typing doesn't restart the one-second tick.
  const submitRef = useRef(submit);
  submitRef.current = submit;
  useEffect(() => {
    if (phase !== "question") return;
    if (left <= 0) {
      submitRef.current();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left]);

  async function aiFeedback(at: number, body: { answer: string; followUp?: string }, isFollowUp: boolean) {
    const q = questions[at] ?? current;
    const { status, data } = await postJson<AiFeedback & { provider?: string }>("/api/interview/feedback", { sectionId: q.sectionId, index: q.index, ...body });
    const err =
      status === 200 ? undefined : status === 401 ? "Log in to get AI feedback." : status === 429 ? "You've used today's AI feedback. The in-browser feedback still works." : (data.error ?? "AI feedback is unavailable right now.");
    setAnswers((xs) =>
      xs.map((x, k) => {
        if (k !== at) return x;
        if (isFollowUp) return x.followUp ? { ...x, followUp: { ...x.followUp, ai: status === 200 ? data : undefined, aiError: err } } : x;
        return { ...x, ai: status === 200 ? data : undefined, aiError: err };
      }),
    );
  }

  function begin() {
    setQuestions(pickQuestions(round, count));
    setAnswers([]);
    setI(0);
    setText("");
    setFollowUpOf(null);
    setLeft(minutes * 60);
    setPhase("question");
  }

  function next() {
    setFollowUpOf(null);
    if (i + 1 >= questions.length) {
      window.speechSynthesis?.cancel();
      setPhase("done");
      return;
    }
    setI(i + 1);
    setLeft(minutes * 60);
    setPhase("question");
  }

  function answerFollowUp(at: number) {
    setFollowUpOf(at);
    setText("");
    setLeft(minutes * 60);
    setPhase("question");
  }

  const card = useMemo(() => (phase === "done" ? scorecard(answers.map((a) => a.analysis)) : null), [phase, answers]);
  const aiAvg = useMemo(() => {
    const xs = answers.map((a) => a.ai?.score).filter((x): x is number => typeof x === "number");
    return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;
  }, [answers]);
  const saved = useRef(false);
  useEffect(() => {
    if (phase !== "done" || !card || saved.current) return;
    saved.current = true;
    const p = { at: Date.now(), round, count: questions.length, overall: card.overall, ai: aiAvg };
    saveHistory(p);
    setHistory(loadHistory());
  }, [phase, card, round, questions.length, aiAvg]);
  useEffect(() => {
    if (phase === "setup") saved.current = false;
  }, [phase]);

  // ---------- Setup ----------
  if (phase === "setup")
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader path="/interview/mock" title="Mock interview" intro="Answer out loud, against the clock, then see what an interviewer would notice. Free, and it works in your browser." />
        <div className="card space-y-5">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-900">Round</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROUNDS.map((r) => (
                <button key={r.id} type="button" onClick={() => setRound(r.id)} aria-pressed={round === r.id} className={`rounded-xl border p-3 text-left text-sm ${round === r.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <span className="block font-medium text-slate-900">{r.label}</span>
                  <span className="block text-xs text-slate-500">{r.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-slate-900">Questions</span>
              <select className="input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {[4, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} questions
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-slate-900">Time per answer</span>
              <select className="input" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} minute{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} /> Read each question aloud
          </label>
          <ul className="space-y-1 text-xs text-slate-500">
            <li>
              {dictation.supported ? "🎤 Speak your answers: your browser turns speech into text (Chrome sends the audio to Google to do this)." : "🎤 Speaking needs Chrome or Edge on a computer or Android phone. You can type your answers here."}
            </li>
            <li>
              {aiOn === null
                ? "Checking AI feedback…"
                : !aiOn
                  ? "✨ AI feedback isn't switched on here yet; you get the full in-browser feedback."
                  : account.user
                    ? "✨ AI feedback and follow-up questions are on (free models; a daily limit applies). Your answers are sent to the AI provider to be checked."
                    : "✨ Log in to also get AI feedback and follow-up questions."}
            </li>
          </ul>
          <button className="btn-primary" onClick={begin}>
            Start interview <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {history.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Your past mock interviews</h2>
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 text-sm">
              {history.slice(0, 6).map((h) => (
                <li key={h.at} className="flex items-center justify-between px-4 py-2.5">
                  <span>
                    {ROUNDS.find((r) => r.id === h.round)?.label ?? h.round} · {h.count} questions
                    <span className="text-slate-500"> · {new Date(h.at).toLocaleDateString([], { day: "numeric", month: "short" })}</span>
                  </span>
                  <span className="pill tabular-nums">
                    {h.overall}/10{h.ai !== null ? ` · AI ${h.ai}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="text-sm text-slate-500">
          Want to read the questions and model answers first? <Link href="/interview" className="font-medium text-brand-700">Interview prep</Link>.
        </p>
      </div>
    );

  // ---------- Question ----------
  if (phase === "question" && current) {
    const section = sectionOf(current);
    const pct = minutes ? Math.max(0, left / (minutes * 60)) : 0;
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Question {i + 1} of {questions.length} · {section.title}
            {followUpOf !== null && " · follow-up"}
          </span>
          <button className="btn-quiet px-2 py-1 text-xs" onClick={() => setVoice((v) => !v)} aria-label={voice ? "Stop reading questions aloud" : "Read questions aloud"}>
            {voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        <div className="card space-y-4">
          <h1 className="text-xl font-semibold text-slate-900">{askedText.replace(/`/g, "")}</h1>
          <div className="space-y-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={left} aria-valuemin={0} aria-valuemax={minutes * 60} aria-label="Time left">
              <div className={`h-full rounded-full transition-all ${left <= 15 ? "bg-red-500" : "bg-slate-900"}`} style={{ width: `${pct * 100}%` }} />
            </div>
            <p className="flex items-center gap-1 text-xs text-slate-500 tabular-nums">
              <Timer className="h-3.5 w-3.5" /> {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} left
            </p>
          </div>
          <textarea
            className="input min-h-[160px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dictation.supported ? "Press Speak and answer out loud, or type here. You can fix any wrong words before submitting." : "Type your answer here."}
            aria-label="Your answer"
          />
          {dictation.error && <p className="text-sm text-red-700">{dictation.error}</p>}
          <div className="flex flex-wrap gap-2">
            {dictation.supported &&
              (dictation.listening ? (
                <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={dictation.stop}>
                  <Square className="h-4 w-4" /> Stop
                </button>
              ) : (
                <button className="btn-primary" onClick={() => dictation.start(text)}>
                  <Mic className="h-4 w-4" /> Speak
                </button>
              ))}
            <button className={dictation.supported ? "btn-ghost" : "btn-primary"} onClick={submit}>
              <Check className="h-4 w-4" /> Submit answer
            </button>
            <button className="btn-quiet" onClick={submit} title="Move on without answering">
              Skip
            </button>
          </div>
          {dictation.listening && (
            <p className="flex items-center gap-2 text-xs text-red-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" /> Listening…
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---------- Feedback for one answer ----------
  if (phase === "feedback") {
    const at = answers.length - 1;
    const a = followUpOf !== null ? answers[followUpOf] : answers[at];
    if (!a) return null;
    const showing = followUpOf !== null && a.followUp ? a.followUp : null;
    const an = showing ? showing.analysis : a.analysis;
    const ai = showing ? showing.ai : a.ai;
    const aiError = showing ? showing.aiError : a.aiError;
    const item = itemOf(a.q);
    const aiPending = canAi && (showing ? showing.text.trim() : a.text.trim()) && !ai && !aiError;
    const atIndex = followUpOf ?? at;
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-slate-500">
          Feedback · question {atIndex + 1} of {questions.length}
          {showing && " · follow-up"}
        </p>
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-semibold text-slate-900">{(showing ? showing.question : item.q).replace(/`/g, "")}</h1>
            <span className="shrink-0 text-2xl font-semibold text-slate-900 tabular-nums">
              {an.score}
              <span className="text-sm font-normal text-slate-500">/10</span>
            </span>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-slate-50 p-2">
              <dt className="text-slate-500">Words</dt>
              <dd className="text-base font-semibold text-slate-900 tabular-nums">{an.words}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <dt className="text-slate-500">Pace</dt>
              <dd className="text-base font-semibold text-slate-900 tabular-nums">{an.wpm === null ? "typed" : `${an.wpm}/min`}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <dt className="text-slate-500">Filler words</dt>
              <dd className="text-base font-semibold text-slate-900 tabular-nums">{an.fillers.reduce((n, f) => n + f.count, 0)}</dd>
            </div>
          </dl>
          {!showing && (an.matched.length > 0 || an.missed.length > 0) && (
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-slate-900">Key points</p>
              <div className="flex flex-wrap gap-1.5">
                {an.matched.map((t) => (
                  <span key={t} className="chip bg-emerald-50 text-emerald-800">
                    <Check className="mr-0.5 inline h-3 w-3" />
                    {t}
                  </span>
                ))}
                {an.missed.map((t) => (
                  <span key={t} className="chip bg-slate-100 text-slate-500">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {an.star && (
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(["situation", "task", "action", "result"] as const).map((k) => (
                <span key={k} className={`chip ${an.star![k] ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                  {an.star![k] ? <Check className="mr-0.5 inline h-3 w-3" /> : <X className="mr-0.5 inline h-3 w-3" />}
                  {k[0].toUpperCase() + k.slice(1)}
                </span>
              ))}
            </div>
          )}
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {an.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        {(aiPending || ai || aiError) && (
          <div className="card space-y-3 text-sm">
            <p className="flex items-center gap-2 font-medium text-slate-900">
              <Sparkles className="h-4 w-4" /> AI interviewer
              {ai && <span className="ml-auto pill tabular-nums">{ai.score}/10</span>}
            </p>
            {aiPending && (
              <p className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Reading your answer…
              </p>
            )}
            {aiError && <p className="text-slate-500">{aiError}</p>}
            {ai && (
              <>
                {ai.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-medium tracking-wide text-emerald-700 uppercase">Good</p>
                    <ul className="list-disc pl-5 text-slate-700">
                      {ai.strengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {ai.improve.length > 0 && (
                  <div>
                    <p className="text-xs font-medium tracking-wide text-amber-700 uppercase">Improve</p>
                    <ul className="list-disc pl-5 text-slate-700">
                      {ai.improve.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {ai.betterAnswer && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">A stronger version</p>
                    <p className="mt-1 text-slate-800">{ai.betterAnswer}</p>
                  </div>
                )}
                {!showing && ai.followUp && !a.followUp && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3">
                    <p className="text-slate-800">
                      <b>Follow-up:</b> {ai.followUp}
                    </p>
                    <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => answerFollowUp(atIndex)}>
                      Answer it
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!showing && (
          <details className="card group text-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900">
              Model answer <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 whitespace-pre-line text-slate-700">{item.a.replace(/`/g, "")}</p>
          </details>
        )}

        <button className="btn-primary" onClick={next}>
          {i + 1 >= questions.length ? "See my scorecard" : "Next question"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ---------- Scorecard ----------
  if (phase === "done" && card)
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="card space-y-4">
          <div>
            <p className="eyebrow">{ROUNDS.find((r) => r.id === round)?.label} · scorecard</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 tabular-nums">
              {card.overall}
              <span className="text-base font-normal text-slate-500">/10</span>
            </h1>
            <p className="text-sm text-slate-600">
              {card.answered} of {questions.length} answered{aiAvg !== null ? ` · AI interviewer average ${aiAvg}/10` : ""}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {[
              ["Content", card.content === null ? "n/a" : `${card.content}/10`],
              ["Fluency", `${card.fluency}/10`],
              ["Pace", card.pace === null ? "typed" : `${card.pace}/min`],
              ["STAR", card.star === null ? "n/a" : `${card.star}/10`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-slate-200 p-3">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="font-semibold text-slate-900 tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="text-sm font-medium text-slate-900">Work on these first</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {card.improvements.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={begin}>
              <RotateCcw className="h-4 w-4" /> Another interview
            </button>
            <button className="btn-ghost" onClick={() => setPhase("setup")}>
              Change round
            </button>
          </div>
        </div>
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">Question by question</h2>
          <ol className="space-y-2">
            {answers.map((a, k) => (
              <li key={k} className="rounded-xl border border-slate-200 p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-slate-900">
                    {k + 1}. {itemOf(a.q).q.replace(/`/g, "")}
                  </span>
                  <span className="pill shrink-0 tabular-nums">
                    {a.analysis.score}/10{a.ai ? ` · AI ${a.ai.score}` : ""}
                  </span>
                </div>
                <p className="mt-1 text-slate-600">{a.text.trim() ? a.text.slice(0, 220) + (a.text.length > 220 ? "…" : "") : <i>Skipped</i>}</p>
              </li>
            ))}
          </ol>
        </section>
        {!dictation.supported && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <MicOff className="h-3.5 w-3.5" /> Speaking wasn&rsquo;t available in this browser, so pace couldn&rsquo;t be measured. Try Chrome to practise out loud.
          </p>
        )}
      </div>
    );

  return null;
}
