"use client";

import { CalendarClock, ChevronRight, Loader2, Medal, Radio, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EXAM_BY_ID } from "@/data/exams";
import { mockPlan, totalMinutes, totalQuestions } from "@/data/patterns";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { WEEKLY_CLOSE_HOUR, WEEKLY_EXAMS, WEEKLY_OPEN_HOUR, countdown, istDateTime, lastClosedWindow, nextWindow, statusAt, type WeeklyStatus } from "@/lib/weekly";

interface Standing {
  rank: number;
  takers: number;
  percentile: number | null;
  enough: boolean;
}
type Mine = { attemptId: string; submitted: false; inProgress: boolean; total: number } | ({ attemptId: string; submitted: true; score: number; total: number } & Standing) | null;

interface ExamOverview {
  examId: string;
  marks: number;
  current: { week: string; opensAt: number; closesAt: number; status: WeeklyStatus; takers: number; mine: Mine };
  last: { week: string; opensAt: number; closesAt: number; takers: number; top: { position: number; rank: number; name: string; score: number; you: boolean }[]; mine: Mine };
}

const hour = (h: number) => `${h % 12 || 12} ${h < 12 ? "am" : "pm"}`;
const HOURS = `${hour(WEEKLY_OPEN_HOUR)}–${hour(WEEKLY_CLOSE_HOUR)}`;
const fmt = (n: number) => +n.toFixed(2);
const startHref = (examId: string) => `/practice?exam=${examId}&mock=1&weekly=1`;

const STATUS: Record<WeeklyStatus, { label: string; cls: string }> = {
  upcoming: { label: "Upcoming", cls: "bg-slate-100 text-slate-600" },
  live: { label: "Live now", cls: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Closed", cls: "bg-slate-100 text-slate-500" },
};

/** /mock-sunday: this week's All-India mocks with countdowns, start buttons and last week's leaderboard. */
export function SundayMock() {
  const account = useAccount();
  // The clock starts after mounting, so the server-rendered page and the browser agree.
  const [now, setNow] = useState<number | null>(null);
  const [data, setData] = useState<ExamOverview[] | null>(null);
  const [error, setError] = useState("");
  const loadedFor = useRef("");

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Results come from the server; reload when the mock opens or closes, or the login changes.
  const phase = now === null ? "" : `${nextWindow(now).week}:${statusAt(nextWindow(now), now)}:${account.user?.id ?? ""}`;
  useEffect(() => {
    if (IS_STATIC || !account.ready || !phase || loadedFor.current === phase) return;
    loadedFor.current = phase;
    fetch("/api/weekly", { cache: "no-store" })
      .then(async (r) => (r.ok ? setData((await r.json()).exams) : setError((await r.json().catch(() => ({}))).error ?? "Could not load the results.")))
      .catch(() => setError("Could not load the results."));
  }, [phase, account.ready]);

  const next = now === null ? null : nextWindow(now);
  const status = next && now !== null ? statusAt(next, now) : null;
  const last = now === null ? null : lastClosedWindow(now);
  const byExam = new Map(data?.map((d) => [d.examId, d]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="eyebrow">Every Sunday · free</p>
        <h1 className="mt-1 text-2xl font-semibold">Sunday All-India Mock</h1>
        <p className="mt-1 text-sm text-slate-600">
          One full paper per exam, the same for every student, live on Sunday from {HOURS} India time. It doesn’t use your free test or credits. You get one attempt, and your all-India rank is ready when the mock closes.
        </p>
      </div>

      {IS_STATIC && <div className="card text-sm text-slate-600">The All-India mock, ranks and the leaderboard are available on the full site, where you can log in.</div>}

      <div className="card flex items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${status === "live" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {status === "live" ? <Radio className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
        </span>
        <div className="min-w-0 text-sm">
          {!next || now === null ? (
            <span className="text-slate-500">Loading the schedule…</span>
          ) : status === "live" ? (
            <>
              <div className="font-semibold text-slate-900">Live now · closes in {countdown(next.closesAt - now)}</div>
              <p className="text-slate-600">Every paper ends at {hour(WEEKLY_CLOSE_HOUR)} India time, so start early enough to finish it.</p>
            </>
          ) : (
            <>
              <div className="font-semibold text-slate-900 tabular-nums">Next mock opens in {countdown(next.opensAt - now)}</div>
              <p className="text-slate-600">{istDateTime(next.opensAt)} India time</p>
            </>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">This week</h2>
        {WEEKLY_EXAMS.map((exam) => {
          const plan = mockPlan(exam)!;
          const d = byExam.get(exam.id);
          const mine = d?.current.week === next?.week ? d?.current.mine : null;
          const s = status ?? "upcoming";
          return (
            <div key={exam.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/exams/${exam.id}`} className="font-semibold text-slate-900 hover:text-brand-700">
                    {exam.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {plan.pattern.paper} pattern · {totalQuestions(plan.sections)} questions · {totalMinutes(plan.sections)} min
                    {(plan.pattern.negative ?? exam.negativeMarking ?? 0) > 0 ? ` · −${fmt((plan.pattern.negative ?? exam.negativeMarking ?? 0) * plan.pattern.marks)} per wrong` : ""}
                  </p>
                </div>
                <span className={`chip ${STATUS[s].cls}`}>{STATUS[s].label}</span>
              </div>
              {s === "live" && d && d.current.takers > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="h-3.5 w-3.5" /> {d.current.takers.toLocaleString("en-IN")} submitted so far
                </p>
              )}
              <ExamAction examId={exam.id} status={s} mine={mine ?? null} marks={d?.marks ?? plan.pattern.marks} loggedIn={!!account.user} ready={account.ready && (IS_STATIC || !!data || !!error || !account.user)} />
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">Last week’s results</h2>
          {last && <p className="text-xs text-slate-500">Mock of {istDateTime(last.opensAt).split(",")[0]} · final ranks</p>}
        </div>
        {IS_STATIC ? (
          <p className="card text-sm text-slate-600">Leaderboards are available on the full site.</p>
        ) : error ? (
          <p className="card text-sm text-red-600">{error}</p>
        ) : !data ? (
          <div className="card space-y-2">
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ) : (
          data.map((d) => <LastWeek key={d.examId} d={d} />)
        )}
      </section>
    </div>
  );
}

function ExamAction({ examId, status, mine, marks, loggedIn, ready }: { examId: string; status: WeeklyStatus; mine: Mine; marks: number; loggedIn: boolean; ready: boolean }) {
  if (status !== "live") return <p className="text-sm text-slate-500">Opens Sunday at {hour(WEEKLY_OPEN_HOUR)}. Come back then to start.</p>;
  if (IS_STATIC) return <p className="text-sm text-slate-600">Live now: available on the full site.</p>;
  if (!ready) return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />;
  if (!loggedIn) {
    return (
      <Link href={`/login?next=${encodeURIComponent(startHref(examId))}`} className="btn-primary w-full sm:w-auto">
        Log in to start the All-India mock
      </Link>
    );
  }
  if (mine?.submitted) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm">
        <span>
          <span className="block font-semibold text-slate-900 tabular-nums">
            Provisional rank {mine.rank.toLocaleString("en-IN")} of {mine.takers.toLocaleString("en-IN")}
          </span>
          <span className="text-slate-600 tabular-nums">
            Score {fmt(mine.score * marks)} / {mine.total * marks}
            {mine.enough && mine.percentile !== null ? ` · ${mine.percentile} percentile so far` : ""}
          </span>
        </span>
        <Link href={`/tests?id=${mine.attemptId}`} className="btn-ghost px-3 py-1.5 text-xs">
          See analysis
        </Link>
      </div>
    );
  }
  if (mine && !mine.inProgress) return <p className="text-sm text-slate-600">Your attempt timed out without being submitted. Next week’s mock opens Sunday at {hour(WEEKLY_OPEN_HOUR)}.</p>;
  return (
    <Link href={startHref(examId)} className="btn-primary w-full sm:w-auto">
      {mine ? "Resume your attempt" : "Start the All-India mock"} <ChevronRight className="h-4 w-4" />
    </Link>
  );
}

function LastWeek({ d }: { d: ExamOverview }) {
  const exam = EXAM_BY_ID.get(d.examId);
  const mine = d.last.mine;
  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">{exam?.name ?? d.examId}</h3>
        <span className="text-xs text-slate-500 tabular-nums">{d.last.takers.toLocaleString("en-IN")} student{d.last.takers === 1 ? "" : "s"}</span>
      </div>
      {mine?.submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm">
          <Trophy className="h-5 w-5 shrink-0 text-amber-700" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-slate-900 tabular-nums">
              Your rank {mine.rank.toLocaleString("en-IN")} of {mine.takers.toLocaleString("en-IN")}
              {mine.enough && mine.percentile !== null && <span className="font-normal text-slate-600"> · {mine.percentile} percentile</span>}
            </span>
            <span className="text-slate-600 tabular-nums">
              Score {fmt(mine.score * d.marks)} / {mine.total * d.marks}
            </span>
          </span>
          <Link href={`/tests?id=${mine.attemptId}`} className="shrink-0 text-xs font-medium text-brand-700 hover:underline">
            Analysis
          </Link>
        </div>
      )}
      {d.last.top.length ? (
        <ol className="divide-y divide-slate-100 text-sm">
          {d.last.top.map((r) => (
            <li key={r.position} className={`flex items-center gap-3 py-2 ${r.you ? "font-semibold text-slate-900" : "text-slate-700"}`}>
              <span className="w-7 shrink-0 text-right text-xs text-slate-500 tabular-nums">{r.rank <= 3 ? <Medal className={`ml-auto h-4 w-4 ${r.rank === 1 ? "text-amber-500" : r.rank === 2 ? "text-slate-400" : "text-orange-400"}`} aria-label={`Rank ${r.rank}`} /> : `#${r.rank}`}</span>
              <span className="min-w-0 flex-1 truncate">
                {r.name}
                {r.you && <span className="chip ml-2 bg-brand-50 text-brand-700">You</span>}
              </span>
              <span className="tabular-nums">{fmt(r.score * d.marks)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-slate-500">Nobody took last week’s mock. Be the first on the board this Sunday.</p>
      )}
    </div>
  );
}
