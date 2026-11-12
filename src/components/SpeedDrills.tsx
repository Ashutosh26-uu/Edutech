"use client";

import { Check, RotateCcw, SkipForward, Timer, Trophy, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkline } from "@/components/Sparkline";
import { DRILLS, DrillRound, LEVELS, isCorrect, perMinute, type DrillId, type DrillLevel, type DrillQuestion } from "@/lib/drills";
import { readJson, writeJson } from "@/lib/localJson";
import { awardXp } from "@/lib/storage";

const KEY = "studyclip:drills";
const PREFS = "studyclip:drills:prefs";
const DURATIONS = [60, 120] as const;
const HISTORY_KEPT = 20;

interface Run {
  at: number;
  score: number;
  correct: number;
  wrong: number;
  seconds: number;
}
type Stats = Record<string, { best: number; runs: Run[] }>;
interface Answered {
  q: DrillQuestion;
  given: string | null; // null = skipped
  ok: boolean;
}

const statKey = (id: DrillId, level: DrillLevel) => `${id}:${level}`;

export function SpeedDrills() {
  const [drill, setDrill] = useState<DrillId>("tables");
  const [level, setLevel] = useState<DrillLevel>("easy");
  const [duration, setDuration] = useState<number>(60);
  const [stats, setStats] = useState<Stats>({});
  const [phase, setPhase] = useState<"setup" | "running" | "done">("setup");

  const roundRef = useRef<DrillRound | null>(null);
  const [q, setQ] = useState<DrillQuestion | null>(null);
  const [value, setValue] = useState("");
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<{ score: number; best: boolean; xp: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStats(readJson<Stats>(KEY, {}));
    const p = readJson<{ drill?: DrillId; level?: DrillLevel; duration?: number }>(PREFS, {});
    if (p.drill && DRILLS.some((d) => d.id === p.drill)) setDrill(p.drill);
    if (p.level && LEVELS.some((l) => l.id === p.level)) setLevel(p.level);
    if (p.duration && (DURATIONS as readonly number[]).includes(p.duration)) setDuration(p.duration);
  }, []);

  const start = () => {
    writeJson(PREFS, { drill, level, duration });
    roundRef.current = new DrillRound(drill, level);
    setQ(roundRef.current.next());
    setAnswers([]);
    setValue("");
    setFlash(null);
    setResult(null);
    const t = Date.now();
    setNow(t);
    setEndsAt(t + duration * 1000);
    setPhase("running");
  };

  const finish = useCallback(
    (list: Answered[]) => {
      const correct = list.filter((a) => a.ok).length;
      const wrong = list.filter((a) => !a.ok && a.given !== null).length;
      // A round ended early is scored on the time actually used.
      const seconds = Math.min(duration, Math.max(1, Math.round((Date.now() - (endsAt - duration * 1000)) / 1000)));
      const score = perMinute(correct, seconds);
      const k = statKey(drill, level);
      const all = readJson<Stats>(KEY, {});
      const prev = all[k] ?? { best: 0, runs: [] };
      // Very short rounds give wild per-minute scores, so they are not saved.
      const counts = seconds >= 20;
      const best = counts && score > prev.best && correct > 0;
      if (counts) {
        all[k] = { best: Math.max(prev.best, score), runs: [...prev.runs, { at: Date.now(), score, correct, wrong, seconds }].slice(-HISTORY_KEPT) };
        writeJson(KEY, all);
        setStats(all);
      }
      // 1 XP per correct answer, capped so a round can't farm XP.
      const xp = Math.min(correct, 40);
      awardXp(xp);
      setResult({ score, best, xp });
      setPhase("done");
    },
    [drill, level, duration, endsAt],
  );

  // Clock: ticks while running and ends the round when time is up.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase === "running" && now >= endsAt) finish(answers);
  }, [phase, now, endsAt, answers, finish]);

  useEffect(() => {
    if (phase === "running") inputRef.current?.focus();
  }, [phase, q]);

  const advance = (given: string | null) => {
    if (!q || !roundRef.current) return;
    const ok = given !== null && isCorrect(q, given);
    setAnswers((a) => [...a, { q, given, ok }]);
    setFlash(given === null ? null : ok ? "ok" : "bad");
    setValue("");
    setQ(roundRef.current.next());
  };

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 350);
    return () => clearTimeout(id);
  }, [flash, answers.length]);

  const k = statKey(drill, level);
  const mine = stats[k];
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const correct = answers.filter((a) => a.ok).length;
  const lastWrong = answers.length && !answers[answers.length - 1].ok ? answers[answers.length - 1] : null;
  const drillName = DRILLS.find((d) => d.id === drill)?.name ?? "";

  if (phase === "running" && q) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-900">
            {drillName} · {LEVELS.find((l) => l.id === level)?.name}
          </span>
          <span className={`inline-flex items-center gap-1.5 font-mono text-base font-semibold tabular-nums ${remaining <= 10 ? "text-red-600" : "text-slate-900"}`} aria-live="off">
            <Timer className="h-4 w-4" /> {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-brand-600 transition-[width] duration-200" style={{ width: `${(remaining / duration) * 100}%` }} />
        </div>
        <form
          className={`card text-center transition-colors ${flash === "ok" ? "border-emerald-500 bg-emerald-50" : flash === "bad" ? "border-red-300 bg-red-50" : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) advance(value);
          }}
        >
          <p className="eyebrow">Question {answers.length + 1}</p>
          <p className="mt-3 font-mono text-4xl font-semibold tabular-nums text-slate-900 sm:text-5xl" aria-live="polite">
            {q.prompt}
          </p>
          {q.relTolerance && <p className="mt-1 text-xs text-slate-500">Any answer within 3% counts</p>}
          <label htmlFor="drill-answer" className="sr-only">
            Your answer
          </label>
          <input
            ref={inputRef}
            id="drill-answer"
            className="input mt-5 h-16 text-center font-mono text-3xl! tabular-nums"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="next"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                advance(null);
              }
            }}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="btn-ghost" onClick={() => advance(null)}>
              <SkipForward className="h-4 w-4" /> Skip <kbd className="hidden sm:inline">Esc</kbd>
            </button>
            <button type="submit" className="btn-primary" disabled={!value.trim()}>
              Submit <kbd className="hidden border-transparent bg-transparent text-on-ink/70 sm:inline">Enter</kbd>
            </button>
          </div>
          <p className="mt-3 min-h-5 text-sm" aria-live="polite">
            {flash === "ok" && (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <Check className="h-4 w-4" /> Correct
              </span>
            )}
            {lastWrong && flash !== "ok" && (
              <span className="text-slate-600">
                {lastWrong.given === null ? "Skipped" : "Wrong"}: {lastWrong.q.prompt} → {lastWrong.q.display}
              </span>
            )}
          </p>
        </form>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            <b className="text-slate-900">{correct}</b> correct · {answers.length - correct} missed
          </span>
          <button type="button" className="text-slate-500 underline hover:text-slate-900" onClick={() => finish(answers)}>
            End round
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {phase === "done" && result && (
        <section className="card space-y-4" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Round over · {drillName}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900 tabular-nums">
                {result.score} <span className="text-base font-normal text-slate-500">correct per minute</span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {correct} correct · {answers.filter((a) => !a.ok && a.given !== null).length} wrong · {answers.filter((a) => a.given === null).length} skipped
                {result.xp > 0 && ` · +${result.xp} XP`}
              </p>
            </div>
            {result.best && (
              <span className="chip bg-amber-100 px-3 py-1 text-sm text-amber-900">
                <Trophy className="h-4 w-4" /> New personal best
              </span>
            )}
          </div>
          {answers.some((a) => !a.ok) && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Revise these</h2>
              <ul className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
                {answers
                  .filter((a) => !a.ok)
                  .slice(0, 20)
                  .map((a, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-1.5">
                      <span className="font-mono text-slate-900">{a.q.prompt}</span>
                      <span className="text-right">
                        {a.given !== null && (
                          <span className="mr-2 text-red-600 line-through">
                            <X className="inline h-3 w-3" /> {a.given}
                          </span>
                        )}
                        <span className="font-semibold text-emerald-700">{a.q.display}</span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <button type="button" className="btn-primary" onClick={start}>
            <RotateCcw className="h-4 w-4" /> Same drill again
          </button>
        </section>
      )}

      <section className="card space-y-5">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Drill</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {DRILLS.map((d) => {
              const best = Math.max(0, ...LEVELS.map((l) => stats[statKey(d.id, l.id)]?.best ?? 0));
              return (
                <label key={d.id} className={`flex cursor-pointer flex-col rounded-lg border px-3 py-2 text-sm has-focus-visible:ring-2 has-focus-visible:ring-brand-500 ${drill === d.id ? "border-ink bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="drill" className="sr-only" checked={drill === d.id} onChange={() => setDrill(d.id)} />
                  <span className="font-medium text-slate-900">{d.name}</span>
                  <span className="text-xs text-slate-500">
                    {d.blurb}
                    {best > 0 && ` · best ${best}/min`}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-6">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Level</legend>
            <div className="mt-2 flex gap-1.5">
              {LEVELS.map((l) => (
                <label key={l.id} className={`btn cursor-pointer border has-focus-visible:ring-2 has-focus-visible:ring-brand-500 ${level === l.id ? "border-ink bg-ink text-on-ink" : "border-slate-200 bg-surface text-slate-700 hover:bg-slate-100"}`}>
                  <input type="radio" name="level" className="sr-only" checked={level === l.id} onChange={() => setLevel(l.id)} />
                  {l.name}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Time</legend>
            <div className="mt-2 flex gap-1.5">
              {DURATIONS.map((d) => (
                <label key={d} className={`btn cursor-pointer border has-focus-visible:ring-2 has-focus-visible:ring-brand-500 ${duration === d ? "border-ink bg-ink text-on-ink" : "border-slate-200 bg-surface text-slate-700 hover:bg-slate-100"}`}>
                  <input type="radio" name="duration" className="sr-only" checked={duration === d} onChange={() => setDuration(d)} />
                  {d === 60 ? "60 seconds" : "2 minutes"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-600">
              Personal best at this level: <b className="text-slate-900">{mine?.best ? `${mine.best} correct/min` : "none yet"}</b>
            </p>
            {mine && mine.runs.length > 1 && (
              <div className="mt-2 max-w-xs">
                <Sparkline values={mine.runs.map((r) => r.score)} label={`Last ${mine.runs.length} scores`} unit="/min" />
                <p className="mt-1 text-xs text-slate-500">Last {mine.runs.length} rounds</p>
              </div>
            )}
          </div>
          <button type="button" className="btn-primary px-6" onClick={start}>
            <Timer className="h-4 w-4" /> Start {duration === 60 ? "60-second" : "2-minute"} round
          </button>
        </div>
      </section>
    </div>
  );
}
