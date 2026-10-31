"use client";

import Link from "next/link";
import { Heatmap } from "@/components/Heatmap";
import { EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { focusTopics } from "@/lib/adaptive";
import { dayKey, dueCards, level, setDailyGoal, setExam, setExamDate, streak, today } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

const DAY = 86_400_000;

interface Task {
  title: string;
  detail: string;
  href: string;
  done: boolean;
  cta: string;
}

export default function TodayPage() {
  const store = useStore();
  if (!store) return null;

  const exam = store.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  const t = today(store);
  const xpToday = store.activity[dayKey()] ?? 0;
  const goalPct = Math.min(100, Math.round((xpToday / store.dailyGoal) * 100));
  const lvl = level(store.xp);
  const days = store.examDate ? Math.ceil((new Date(store.examDate + "T00:00:00").getTime() - Date.now()) / DAY) : null;
  const due = dueCards(store).length;
  const focus = exam ? focusTopics(examTopicIds(exam), store.topics, 3) : [];
  const lastMock = store.mocks.find((m) => m.examId === exam?.id)?.takenAt ?? 0;
  const mockEvery = days !== null && days <= 30 ? 2 : 7; // revision mode in the last month

  const tasks: Task[] = exam
    ? [
        {
          title: "Review your flashcards",
          detail: due ? `${due} cards due. Reviewing at the right time locks them into long-term memory.` : Object.keys(store.cards).length ? "Nothing due. Nice!" : "Add a topic deck to start spaced repetition.",
          href: "/review",
          done: Object.keys(store.cards).length > 0 && due === 0,
          cta: due ? "Review" : "Open deck",
        },
        {
          title: "Smart practice: 10 questions",
          detail: "Adaptive questions from your weakest topics, mixed together.",
          href: `/practice?exam=${exam.id}&smart=1`,
          done: t.questions >= 10,
          cta: "Start",
        },
        {
          title: "Watch one lecture the smart way",
          detail: "Break a YouTube lecture into chapters and watch only the important parts.",
          href: "/video",
          done: t.videos > 0,
          cta: "Open",
        },
        {
          title: mockEvery === 2 ? "Mock test (revision mode: every 2 days)" : "Weekly mock test",
          detail: lastMock ? `Last mock: ${Math.floor((Date.now() - lastMock) / DAY)} days ago.` : "You haven’t taken a mock test yet.",
          href: `/practice?exam=${exam.id}&mock=1`,
          done: Date.now() - lastMock < mockEvery * DAY,
          cta: "Take test",
        },
      ]
    : [];
  const doneCount = tasks.filter((x) => x.done).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today</h1>
          <p className="mt-1 text-sm text-slate-600">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <ExamPicker examId={store.examId} examDate={store.examDate} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex items-center gap-4">
          <Ring pct={goalPct} label={`${xpToday}`} sub="XP" />
          <div className="text-sm">
            <div className="font-bold text-slate-900">Daily goal</div>
            <div className="text-slate-600">
              {xpToday} / {store.dailyGoal} XP
            </div>
            <select className="mt-1 rounded-md border border-slate-200 bg-surface px-1 py-0.5 text-xs" value={store.dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} aria-label="Daily XP goal">
              {[30, 50, 100, 150, 200].map((g) => (
                <option key={g} value={g}>
                  Goal: {g} XP
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="text-4xl">🔥</div>
          <div className="text-sm">
            <div className="text-2xl font-bold text-slate-900">{streak(store)} day streak</div>
            <div className="text-slate-600">Study a little every day to keep it going.</div>
          </div>
        </div>
        <div className="card text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">Level {lvl.level}</span>
            <span className="text-slate-500">{store.xp} XP total</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand-500" style={{ width: `${(lvl.into / lvl.span) * 100}%` }} />
          </div>
          <div className="mt-1 text-xs text-slate-500">{lvl.span - lvl.into} XP to level {lvl.level + 1}</div>
        </div>
      </div>

      {exam ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className="card">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Today’s plan for {exam.name}</h2>
              <span className="chip bg-brand-50 text-brand-700">
                {doneCount}/{tasks.length} done
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {tasks.map((task) => (
                <li key={task.title} className={`flex items-center gap-3 rounded-xl border p-3 ${task.done ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200"}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${task.done ? "bg-emerald-500 text-white" : "border-2 border-slate-300"}`}>{task.done ? "✓" : ""}</span>
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold ${task.done ? "text-slate-500 line-through" : "text-slate-900"}`}>{task.title}</div>
                    <div className="text-xs text-slate-600">{task.detail}</div>
                  </div>
                  {!task.done && (
                    <Link href={task.href} className="btn-primary shrink-0 px-3 py-1.5 text-xs">
                      {task.cta}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="font-bold text-slate-900">Focus topics</h2>
            <p className="text-xs text-slate-500">Picked from your accuracy and how long since you practised.</p>
            <ul className="mt-3 divide-y divide-slate-100">
              {focus.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div>
                    <div className="font-medium text-slate-800">{TOPIC_BY_ID.get(f.id)?.name}</div>
                    <div className="text-xs text-slate-500">{f.reason}</div>
                  </div>
                  <Link href={`/practice?exam=${exam.id}&topics=${f.id}`} className="btn-ghost px-3 py-1.5 text-xs">
                    Practise
                  </Link>
                </li>
              ))}
            </ul>
            {days !== null && (
              <div className={`mt-4 rounded-xl p-3 text-sm ${days <= 30 ? "bg-red-50 text-red-800" : "bg-brand-50 text-brand-900"}`}>
                {days > 0 ? (
                  <>
                    <b>{days} days</b> to {exam.name}. {days <= 30 ? "Revision mode is on: more mocks, fewer new topics." : "Plenty of time: build strong foundations topic by topic."}
                  </>
                ) : days === 0 ? (
                  <>Exam day. All the best! 🍀</>
                ) : (
                  <>Your exam date has passed. Set a new one above.</>
                )}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="card text-sm text-slate-700">Pick your exam above to get a personalised daily plan.</div>
      )}

      <section className="card">
        <h2 className="mb-3 font-bold text-slate-900">Your study activity</h2>
        <Heatmap activity={store.activity} />
      </section>
    </div>
  );
}

function ExamPicker({ examId, examDate }: { examId?: string; examDate?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <select className="input w-auto py-2" value={examId ?? ""} onChange={(e) => e.target.value && setExam(e.target.value)} aria-label="Your exam">
        <option value="">Choose your exam…</option>
        {EXAMS.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-slate-600">
        Exam date
        <input type="date" className="input w-auto py-2" value={examDate ?? ""} onChange={(e) => setExamDate(e.target.value)} />
      </label>
    </div>
  );
}

function Ring({ pct, label, sub }: { pct: number; label: string; sub: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-slate-100" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-brand-500 transition-all" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <div className="text-sm font-bold text-slate-900">{label}</div>
          <div className="text-[10px] text-slate-500">{sub}</div>
        </div>
      </div>
    </div>
  );
}
