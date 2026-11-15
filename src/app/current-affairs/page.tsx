"use client";

import { CalendarDays, CheckCircle2, Newspaper } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Quiz, type AnswerResult } from "@/components/Quiz";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { IS_STATIC, request } from "@/lib/api";
import { readJson, writeJson } from "@/lib/localJson";
import { recordAnswers } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

interface Data {
  today: string;
  quiz: { day: string; title: string; questions: MCQ[]; isToday: boolean } | null;
  days: { day: string; title: string; count: number }[];
}

const DONE_KEY = "studyclip:ca-done";
const fmt = (day: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) => new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", opts);

export default function CurrentAffairsPage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={0} />}>
      <CurrentAffairs />
    </Suspense>
  );
}

function CurrentAffairs() {
  const params = useSearchParams();
  const day = params.get("day") ?? "";
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Record<string, number>>({});
  const [round, setRound] = useState(0);

  useEffect(() => setDone(readJson<Record<string, number>>(DONE_KEY, {})), []);
  useEffect(() => {
    if (IS_STATIC) return;
    // Switching days quickly: only the latest request may update the page.
    let live = true;
    setData(null);
    setError("");
    request(`/api/current-affairs${day ? `?day=${encodeURIComponent(day)}` : ""}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(
        (d) => live && setData(d),
        () => live && setError("Could not load the quiz. Check your connection and try again."),
      );
    return () => {
      live = false;
    };
  }, [day]);

  if (IS_STATIC) return <StaticNotice>The daily current affairs quiz is on the full site.</StaticNotice>;

  const onFinish = (results: AnswerResult[]) => {
    if (!data?.quiz) return;
    // Counts toward the daily goal and streak; no topic, so weak-topic stats stay about the syllabus.
    recordAnswers(results.filter((r) => r.chosen !== null).map((r) => ({ correct: r.correct })));
    const next = { ...readJson<Record<string, number>>(DONE_KEY, {}), [data.quiz.day]: results.filter((r) => r.correct).length };
    writeJson(DONE_KEY, next);
    setDone(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        path="/current-affairs"
        title="Daily current affairs quiz"
        intro="A short quiz on the news that exams ask about, every day. You see the answer and a short explanation after each question."
        secondary={{ href: "/calendar", label: "Exam calendar" }}
      />
      {error && <p className="card text-sm text-red-700">{error}</p>}
      {!data && !error ? (
        <PageSkeleton tiles={0} />
      ) : data ? (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            {data.quiz ? (
              <div className="card space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="eyebrow">{data.quiz.isToday ? "Today" : fmt(data.quiz.day, { weekday: "long", day: "numeric", month: "long" })}</p>
                    <h2 className="text-lg font-semibold">{data.quiz.title}</h2>
                  </div>
                  {done[data.quiz.day] !== undefined && (
                    <span className="chip bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done · {done[data.quiz.day]}/{data.quiz.questions.length}
                    </span>
                  )}
                </div>
                {!data.quiz.isToday && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Today’s quiz isn’t up yet. Here’s the latest one.</p>}
                <Quiz
                  key={`${data.quiz.day}-${round}`}
                  questions={data.quiz.questions}
                  mode="practice"
                  onFinish={onFinish}
                  onRestart={() => setRound((r) => r + 1)}
                  restartLabel="Try this quiz again"
                  share={{ title: `Current affairs · ${fmt(data.quiz.day)}` }}
                />
              </div>
            ) : (
              <div className="card space-y-3 text-sm text-slate-600">
                <Newspaper className="h-6 w-6 text-slate-400" />
                <p className="font-semibold text-slate-900">The first quiz is on its way</p>
                <p>Daily quizzes appear here once our editors publish them. Meanwhile, practise static GK and banking awareness, or check upcoming exam dates.</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/practice?topics=gk-static,gk-international-orgs,gk-science-tech" className="btn-primary">
                    Practise GK
                  </Link>
                  <Link href="/calendar" className="btn-ghost">
                    <CalendarDays className="h-4 w-4" /> Exam calendar
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="card space-y-2" aria-labelledby="past-h">
            <h2 id="past-h" className="font-semibold">
              Past quizzes
            </h2>
            {data.days.length === 0 ? (
              <p className="text-sm text-slate-500">None yet.</p>
            ) : (
              <ul className="max-h-[28rem] space-y-1 overflow-y-auto">
                {data.days.map((d) => (
                  <li key={d.day}>
                    <Link
                      href={d.day === data.today ? "/current-affairs" : `/current-affairs?day=${d.day}`}
                      className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-slate-100 ${data.quiz?.day === d.day ? "bg-slate-100 font-medium text-slate-900" : "text-slate-700"}`}
                    >
                      <span className="min-w-0 truncate">{d.day === data.today ? "Today" : fmt(d.day)}</span>
                      {done[d.day] !== undefined ? (
                        <span className="shrink-0 text-xs text-emerald-700">
                          {done[d.day]}/{d.count}
                        </span>
                      ) : (
                        <span className="shrink-0 text-xs text-slate-400">{d.count} Qs</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
