"use client";

import { Coffee, Pause, Play, RotateCcw, Timer, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import { focusXp, formatClock, pause, phaseMs, PRESETS, reset, setPreset, start, timeLeft, updateFocus, useFocus, type FocusState, type Preset } from "@/lib/focus";
import { dayKey } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

export function FocusTimer() {
  const focus = useFocus();
  const store = useStore();
  if (!focus) return <div className="skeleton h-80" />;
  const { state, now } = focus;

  const left = timeLeft(state, now);
  const total = phaseMs(state.preset, state.phase);
  const pct = Math.min(100, Math.max(0, ((total - left) / total) * 100));
  const fresh = !state.running && left === total;
  const p = PRESETS[state.preset];
  const exam = store?.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  const topicIds = exam ? examTopicIds(exam) : TOPICS.map((t) => t.id);
  const topic = state.topicId ? TOPIC_BY_ID.get(state.topicId) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        path="/focus"
        title="Focus timer"
        intro={`Press start and study without your phone until the timer rings, then take a short break. Each finished block earns ${focusXp(p.focus)} XP and counts toward your streak.`}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="card flex flex-col items-center gap-5 py-8" aria-label="Timer">
          <div className="flex gap-1.5" role="group" aria-label="Block length">
            {(Object.keys(PRESETS) as Preset[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => updateFocus((s) => setPreset(s, k))}
                disabled={!fresh && state.preset !== k}
                aria-pressed={state.preset === k}
                className={`btn px-3 py-1.5 text-xs ${state.preset === k ? "bg-ink text-on-ink" : "border border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                title={!fresh && state.preset !== k ? "Reset the timer to switch" : undefined}
              >
                {PRESETS[k].focus} / {PRESETS[k].rest}
              </button>
            ))}
          </div>

          <ClockRing pct={pct} phase={state.phase}>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{state.phase === "focus" ? "Focus" : "Break"}</div>
            <div className="font-mono text-5xl font-semibold tabular-nums text-slate-900" role="timer" aria-live="off">
              {formatClock(left)}
            </div>
            {topic && <div className="mt-1 max-w-48 truncate text-xs text-slate-500">{topic.name}</div>}
          </ClockRing>

          <div className="flex flex-wrap justify-center gap-2">
            {state.running ? (
              <button type="button" onClick={() => updateFocus((s) => pause(s))} className="btn-primary min-w-28">
                <Pause className="h-4 w-4" /> Pause
              </button>
            ) : (
              <button type="button" onClick={() => updateFocus((s) => start(s))} className="btn-primary min-w-28">
                {state.phase === "break" ? <Coffee className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {fresh ? (state.phase === "break" ? "Start break" : "Start") : "Resume"}
              </button>
            )}
            <button type="button" onClick={() => updateFocus(reset)} className="btn-ghost" disabled={fresh && state.phase === "focus"}>
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              type="button"
              onClick={() => updateFocus((s) => ({ ...s, muted: !s.muted }))}
              className="btn-ghost"
              aria-pressed={state.muted}
              aria-label={state.muted ? "Sound off. Turn on" : "Sound on. Turn off"}
            >
              {state.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {state.muted ? "Muted" : "Sound on"}
            </button>
          </div>

          <label className="w-full max-w-sm text-sm text-slate-700">
            <span className="mb-1 block font-medium">What are you studying? (optional)</span>
            <select className="input" value={state.topicId ?? ""} onChange={(e) => updateFocus((s) => ({ ...s, topicId: e.target.value || undefined }))}>
              <option value="">Nothing specific</option>
              {topicIds.map((id) => (
                <option key={id} value={id}>
                  {TOPIC_BY_ID.get(id)?.name ?? id}
                </option>
              ))}
            </select>
          </label>
          {topic && (
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link href={`/topics/${topic.id}`} className="btn-ghost px-3 py-1.5 text-xs">
                Open notes
              </Link>
              <Link href={`/practice?topics=${topic.id}`} className="btn-ghost px-3 py-1.5 text-xs">
                Practise questions
              </Link>
            </div>
          )}
          <p className="text-center text-xs text-slate-500">The timer keeps running if you open other pages here; a small clock shows in the corner.</p>
        </section>

        <WeekChart state={state} />
      </div>
    </div>
  );
}

function ClockRing({ pct, phase, children }: { pct: number; phase: FocusState["phase"]; children: React.ReactNode }) {
  const r = 92;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-56 w-56">
      <svg viewBox="0 0 200 200" className="h-56 w-56 -rotate-90" aria-hidden>
        <circle cx="100" cy="100" r={r} fill="none" strokeWidth="10" className="stroke-slate-100" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className={`transition-[stroke-dashoffset] duration-1000 ease-linear ${phase === "focus" ? "stroke-brand-500" : "stroke-emerald-500"}`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div className="flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
}

function WeekChart({ state }: { state: FocusState }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = dayKey(d);
    return { k, label: d.toLocaleDateString(undefined, { weekday: "short" }), mins: state.minutes[k] ?? 0, blocks: state.blocks[k] ?? 0 };
  });
  const max = Math.max(50, ...days.map((d) => d.mins));
  const week = days.reduce((a, d) => a + d.mins, 0);
  const todayMins = days[6].mins;
  const hm = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ""}`.trim() : `${m}m`);

  return (
    <section className="card" aria-labelledby="focus-week">
      <h2 id="focus-week" className="flex items-center gap-2 font-semibold text-slate-900">
        <Timer className="h-4 w-4 text-brand-600" /> Your focus this week
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xl font-semibold text-slate-900">{hm(todayMins)}</div>
          <div className="text-xs text-slate-500">today · {days[6].blocks} block{days[6].blocks === 1 ? "" : "s"}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xl font-semibold text-slate-900">{hm(week)}</div>
          <div className="text-xs text-slate-500">last 7 days</div>
        </div>
      </div>
      <ul className="mt-5 flex h-40 items-end justify-between gap-2" aria-label="Focused minutes per day">
        {days.map((d, i) => (
          <li key={d.k} className="flex h-full flex-1 flex-col items-center justify-end gap-1" aria-label={`${d.label}: ${d.mins} minutes`}>
            <span className="text-[10px] tabular-nums text-slate-500">{d.mins || ""}</span>
            <div className={`w-full max-w-8 rounded-t-md ${i === 6 ? "bg-brand-500" : "bg-brand-200"}`} style={{ height: `${(d.mins / max) * 100}%`, minHeight: d.mins ? 4 : 0 }} />
            <span className={`text-[11px] ${i === 6 ? "font-semibold text-slate-900" : "text-slate-500"}`}>{d.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">Only finished focus blocks count. Saved in this browser.</p>
    </section>
  );
}
