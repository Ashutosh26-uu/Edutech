"use client";

import { ArrowRight, Check, ChevronDown, Snowflake } from "lucide-react";
import Link from "next/link";
import { BadgeToast } from "@/components/Badges";
import { DailyQuestion } from "@/components/DailyQuestion";
import { DailyReminder } from "@/components/DailyReminder";
import { WordFactOfDay } from "@/components/WordFactOfDay";
import { RevisionDueCard } from "@/components/RevisionDueCard";
import { CATEGORIES, EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { testAccessFor, useAccount } from "@/lib/account";
import { focusTopics } from "@/lib/adaptive";
import { dayKey, daysUntilExam, dueCards, setDailyGoal, setExam, setExamDate, streakInfo, today } from "@/lib/storage";
import { MAX_FREEZES, FREEZE_EVERY } from "@/lib/streak";
import { useStore } from "@/lib/useStore";

const DAY = 86_400_000;

interface Task {
  title: string;
  detail: string;
  href: string;
  done: boolean;
  cta: string;
  /** Nice to do, but not needed to finish the day's plan. */
  optional?: boolean;
}

export default function TodayPage() {
  const store = useStore();
  const account = useAccount();
  if (!store) return null;

  const exam = store.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  const t = today(store);
  const xpToday = store.activity[dayKey()] ?? 0;
  const st = streakInfo(store);
  const days = daysUntilExam(store.examDate);
  const cardCount = Object.keys(store.cards).length;
  const due = dueCards(store).length;
  const focus = exam ? focusTopics(examTopicIds(exam), store.topics, 3) : [];
  const lastMock = store.mocks.find((m) => m.examId === exam?.id)?.takenAt ?? 0;
  const mockEvery = days !== null && days <= 30 ? 2 : 7; // revision mode in the last month
  // Every timed test uses the exam's one free test, then 1 credit. With neither left, offer a free timed set instead.
  const access = account.ready ? testAccessFor(account, exam?.id) : "free";
  const noTestsLeft = access === "none";

  const tasks: Task[] = exam
    ? [
        // No deck yet: nothing to review, so the task is left out rather than shown as a chore.
        ...(cardCount
          ? [
              {
                title: "Review your flashcards",
                detail: due ? `${due} cards due. Reviewing at the right time locks them into long-term memory.` : "Nothing due. Nice!",
                href: "/review",
                done: due === 0,
                cta: "Review",
              },
            ]
          : []),
        {
          title: "Smart practice: 10 questions",
          detail: "Adaptive questions from your weakest topics, mixed together.",
          href: `/practice?exam=${exam.id}&smart=1`,
          done: t.questions >= 10,
          cta: "Start",
        },
        noTestsLeft
          ? {
              title: "Free option today: a 20-question timed practice set",
              detail: "You’ve used this exam’s free test and have no credits, so practise against the clock for free instead.",
              href: `/practice?exam=${exam.id}&smart=1&timed=1`,
              done: Date.now() - lastMock < mockEvery * DAY || t.questions >= 30,
              cta: "Start",
            }
          : {
              title: mockEvery === 2 ? "Mock test (revision mode: every 2 days)" : "Weekly mock test",
              detail: `${lastMock ? `Last mock: ${Math.floor((Date.now() - lastMock) / DAY)} days ago.` : "You haven’t taken a mock test yet."} ${access === "free" ? "Uses your free test for this exam." : "Uses 1 test credit."}`,
              href: `/practice?exam=${exam.id}&mock=1`,
              done: Date.now() - lastMock < mockEvery * DAY,
              cta: "Take test",
            },
        {
          title: "Watch one lecture the smart way",
          detail: "Optional. Break a YouTube lecture into chapters and watch only the important parts.",
          href: "/video",
          done: t.videos > 0,
          cta: "Open",
          optional: true,
        },
      ]
    : [];
  const required = tasks.filter((x) => !x.optional);
  const doneCount = required.filter((x) => x.done).length;
  const next = required.find((x) => !x.done) ?? tasks.find((x) => !x.done);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Today</h1>
            <p className="mt-0.5 text-sm text-slate-600">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <ExamPicker examId={store.examId} examDate={store.examDate} />
        </div>
        <Link
          href="/progress"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-slate-200 bg-surface px-3 py-2 text-sm text-slate-700 hover:border-brand-300"
          title={`Streak freezes: ${st.freezes} of ${MAX_FREEZES}. Earn one for every ${FREEZE_EVERY} days in a row; each covers a single missed day.`}
        >
          <span className="font-medium text-slate-900">{exam ? exam.name : "No exam chosen"}</span>
          {exam && days !== null && <span>· {days > 0 ? `${days} days left` : days === 0 ? "exam day" : "date passed"}</span>}
          <span>· 🔥 {st.count} day streak</span>
          {st.freezes > 0 && (
            <span className="inline-flex items-center gap-0.5 text-sky-600">
              <Snowflake className="h-3.5 w-3.5" aria-hidden />
              {st.freezes}
            </span>
          )}
          <span>
            · {xpToday}/{store.dailyGoal} XP today
          </span>
          <ArrowRight className="ml-auto h-4 w-4 text-slate-400" aria-hidden />
        </Link>
        {st.pendingFreeze && <p className="text-xs text-slate-600">You missed yesterday. Study today and a streak freeze saves your streak.</p>}
      </div>

      {next && (
        <Link href={next.href} className="btn-primary w-full py-3 text-base sm:w-auto">
          Do this now: {next.title} <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      {exam ? (
        <>
          <section className="card">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900">Today’s plan for {exam.name}</h2>
              <span className="chip bg-brand-50 text-brand-700">
                {doneCount}/{required.length} done
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {tasks.map((task) => (
                <li key={task.title} className={`flex items-center gap-3 rounded-xl border p-3 ${task.done ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200"}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${task.done ? "bg-emerald-500 text-white" : task.optional ? "border-2 border-dashed border-slate-300" : "border-2 border-slate-300"}`}>{task.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}</span>
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold ${task.done ? "text-slate-500 line-through" : "text-slate-900"}`}>
                      {task.title}
                      {task.optional && <span className="chip ml-2 bg-slate-100 align-middle text-[11px] font-medium text-slate-600">Optional</span>}
                    </div>
                    <div className="text-xs text-slate-600">{task.detail}</div>
                  </div>
                  {!task.done && (
                    <Link href={task.href} className={`${task.optional ? "btn-ghost" : "btn-primary"} shrink-0 px-3 py-1.5 text-xs`}>
                      {task.cta}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Daily goal:{" "}
              <select className="rounded-md border border-slate-200 bg-surface px-1 py-0.5 text-xs" value={store.dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} aria-label="Daily XP goal">
                {[30, 50, 100, 150, 200].map((g) => (
                  <option key={g} value={g}>
                    {g} XP
                  </option>
                ))}
              </select>
            </p>
          </section>
          <section className="card">
            <h2 className="font-semibold text-slate-900">Focus topics</h2>
            <p className="text-xs text-slate-500">Picked from your accuracy and how long since you practised.</p>
            <ul className="mt-3 divide-y divide-slate-100">
              {focus.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800">{TOPIC_BY_ID.get(f.id)?.name}</div>
                    <div className="text-xs text-slate-500">{f.reason}</div>
                  </div>
                  <Link href={`/practice?exam=${exam.id}&topics=${f.id}`} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
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
                  <>It’s exam day. Good luck.</>
                ) : (
                  <>Your exam date has passed. Set a new one above.</>
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="card flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
          <span>Pick your exam above to get a personalised daily plan.</span>
          <Link href="/exams" className="btn-ghost">
            Browse exams
          </Link>
        </div>
      )}

      <details className="group">
        <summary className="card flex cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block font-semibold text-slate-900">Daily extras</span>
            <span className="block text-xs text-slate-500">Question of the day · word & fact of the day · revise today</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-5">
          <DailyQuestion store={store} />
          <WordFactOfDay store={store} />
          <RevisionDueCard store={store} />
        </div>
      </details>

      <DailyReminder examId={store.examId} />
      <BadgeToast store={store} />
    </div>
  );
}

function ExamPicker({ examId, examDate }: { examId?: string; examDate?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <select className="input w-auto max-w-full py-2" value={examId ?? ""} onChange={(e) => e.target.value && setExam(e.target.value)} aria-label="Your exam">
        <option value="">Choose your exam…</option>
        {CATEGORIES.map((c) => (
          <optgroup key={c} label={c}>
            {EXAMS.filter((e) => e.category === c).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <label className="flex items-center gap-2 text-slate-600">
        Exam date
        <input type="date" className="input w-auto py-2" value={examDate ?? ""} onChange={(e) => setExamDate(e.target.value)} />
      </label>
    </div>
  );
}
