"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgesSection } from "@/components/Badges";
import { practiseHref } from "@/components/EmptyState";
import { Heatmap } from "@/components/Heatmap";
import { Stat } from "@/components/Quiz";
import { PageHeader } from "@/components/PageHeader";
import { MistakePatternSummary } from "@/components/StudyNotes";
import { EXAM_BY_ID } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { useAccount } from "@/lib/account";
import { clearAll, load, type TopicStat } from "@/lib/storage";
import { InfoTip } from "@/components/InfoTip";

type Data = ReturnType<typeof load>;

/** Accuracy per subject, weakest first: one horizontal bar each, with the share as text so colour carries nothing alone. */
function SubjectAccuracy({ topics }: { topics: { id: string; attempted: number; correct: number }[] }) {
  const bySubject = new Map<string, { attempted: number; correct: number }>();
  for (const t of topics) {
    const subject = TOPIC_BY_ID.get(t.id)?.subject ?? "Other";
    const s = bySubject.get(subject) ?? { attempted: 0, correct: 0 };
    s.attempted += t.attempted;
    s.correct += t.correct;
    bySubject.set(subject, s);
  }
  const rows = [...bySubject].map(([subject, s]) => ({ subject, ...s, pct: s.attempted ? Math.round((s.correct / s.attempted) * 100) : 0 })).sort((a, b) => a.pct - b.pct);
  return (
    <section className="card">
      <h2 className="flex items-center gap-1.5 font-semibold text-slate-900">
        Accuracy by subject <InfoTip id="accuracy" />
      </h2>
      {rows.length ? (
        <ul className="mt-3 space-y-2.5">
          {rows.map((r) => (
            <li key={r.subject} title={`${r.subject}: ${r.correct} of ${r.attempted} correct (${r.pct}%)`}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-slate-700">{r.subject}</span>
                <span className="shrink-0 text-slate-900 tabular-nums">
                  {r.pct}% <span className="text-xs text-slate-500">· {r.attempted} Qs</span>
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-brand-500" style={{ width: `${Math.max(r.pct, 2)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2 space-y-3 text-sm text-slate-500">
          <p>Practise a few topics to see how each subject is going.</p>
          <Link href="/exams" className="btn-ghost px-3 py-1.5 text-xs">
            Find your exam
          </Link>
        </div>
      )}
    </section>
  );
}

/** Score (as % of maximum) of the last 12 tests, oldest to newest, so the direction is visible at a glance. */
function ScoreTrend({ points, mockHref }: { points: { at: number; pct: number; label: string }[]; mockHref: string }) {
  const last = [...points].sort((a, b) => a.at - b.at).slice(-12);
  const avg = (xs: { pct: number }[]) => (xs.length ? xs.reduce((n, x) => n + x.pct, 0) / xs.length : 0);
  const half = Math.floor(last.length / 2);
  const change = last.length >= 4 ? Math.round(avg(last.slice(half)) - avg(last.slice(0, half))) : null;
  return (
    <section className="card">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-semibold text-slate-900">Test score trend</h2>
        {change !== null && (
          <span className={`text-sm font-medium ${change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change)} points (recent half vs earlier)
          </span>
        )}
      </div>
      {last.length ? (
        <>
          <div className="mt-4 flex h-32 items-end gap-1.5" role="img" aria-label={`Scores of the last ${last.length} tests, oldest first: ${last.map((p) => Math.round(p.pct) + "%").join(", ")}`}>
            {last.map((p, i) => (
              <div key={i} className="group relative flex h-full min-w-0 flex-1 items-end" title={`${p.label} · ${new Date(p.at).toLocaleDateString()} · ${Math.round(p.pct)}%`}>
                <div className="w-full rounded-t bg-brand-500 transition-opacity group-hover:opacity-80" style={{ height: `${Math.max(p.pct, 2)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>Oldest</span>
            <span>Latest: {Math.round(last.at(-1)!.pct)}%</span>
          </div>
        </>
      ) : (
        <div className="mt-2 space-y-3 text-sm text-slate-500">
          <p>Take a timed test to start your score trend.</p>
          <Link href={mockHref} className="btn-ghost px-3 py-1.5 text-xs">
            Take a mock
          </Link>
        </div>
      )}
    </section>
  );
}

interface AttemptRow {
  id: string;
  examId: string;
  kind: "full" | "topic" | "section" | "weekly";
  score: number;
  total: number;
  marks: number;
  submittedAt: number;
}

interface AccountProgress {
  topics: Record<string, TopicStat>;
  mistakes: { questionId: string }[];
  attempts: AttemptRow[];
}

/**
 * Progress follows the account when signed in (topic accuracy, test history and the mistake
 * notebook all live on the server); otherwise it shows what this browser has saved.
 */
export default function ProgressPage() {
  const account = useAccount();
  const [data, setData] = useState<Data | null>(null);
  const [remote, setRemote] = useState<AccountProgress | null>(null);
  useEffect(() => setData(load()), []);
  useEffect(() => {
    if (!account.ready || !account.user) return setRemote(null);
    Promise.all([fetch("/api/progress", { cache: "no-store" }).then((r) => r.json()), fetch("/api/tests", { cache: "no-store" }).then((r) => r.json())])
      .then(([p, t]) => setRemote({ topics: p.topics ?? {}, mistakes: p.mistakes ?? [], attempts: t.attempts ?? [] }))
      .catch(() => setRemote(null));
  }, [account.ready, account.user]);
  if (!data) return null;

  const synced = !!account.user && !!remote;
  const stats = synced ? remote.topics : data.topics;
  const topics = Object.entries(stats).map(([id, s]) => ({ id, ...s, pct: Math.round((s.correct / s.attempted) * 100) }));
  const attempted = topics.reduce((n, t) => n + t.attempted, 0);
  const correct = topics.reduce((n, t) => n + t.correct, 0);
  const weak = topics.filter((t) => t.pct < 60).sort((a, b) => a.pct - b.pct);
  const exam = data.examId ? EXAM_BY_ID.get(data.examId) : undefined;
  const tests = synced ? remote.attempts.length : data.mocks.length;
  const mockHref = exam ? `/exams/${exam.id}` : "/exams";
  const noTests = (
    <div className="mt-2 space-y-3 text-sm text-slate-500">
      <p>{synced ? "No tests yet." : "No mock tests yet."}</p>
      <Link href={mockHref} className="btn-primary px-3 py-1.5 text-xs">
        Take a mock
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        path="/progress"
        title="My progress"
        intro="See how many questions you got right, which topics are weak, and how your test scores are changing. Practise the weak topics first."
        aside={
        !synced && (
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              if (confirm("Clear all saved progress in this browser?")) {
                clearAll();
                setData(load());
              }
            }}
          >
            Reset progress
          </button>
        )
        }
      >
        <p className="text-sm text-slate-500">
          {exam ? <>Preparing for <Link href={`/exams/${exam.id}`} className="font-medium text-brand-700">{exam.name}</Link></> : "No exam chosen yet."} ·{" "}
          {synced ? "Saved to your account." : account.mode === "server" ? <>Saved in this browser only. <Link href="/login?next=/progress" className="font-medium text-brand-700">Log in</Link> to keep it on your account.</> : "Saved in this browser only."}
        </p>
      </PageHeader>

      {!exam && (
        <div className="card flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
          <span>Choose your exam to get a daily plan, focus topics and mock tests made for it.</span>
          <Link href="/exams" className="btn-primary">
            Choose your exam
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Questions attempted" value={attempted} tone="brand" />
        <Stat label="Accuracy" value={attempted ? `${Math.round((correct / attempted) * 100)}%` : "–"} tone="green" />
        <Stat label="Tests taken" value={tests} tone="slate" />
        {synced ? (
          <Link href="/mistakes" className="block">
            <Stat label="Open mistakes" value={remote.mistakes.length} tone="red" />
          </Link>
        ) : (
          <Stat label="Videos studied" value={data.videos.length} tone="slate" />
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SubjectAccuracy topics={topics} />
        <ScoreTrend points={synced ? remote.attempts.map((a) => ({ at: a.submittedAt, pct: a.total ? (a.score / a.total) * 100 : 0, label: `${EXAM_BY_ID.get(a.examId)?.name ?? a.examId} · ${a.kind === "full" ? "full mock" : a.kind === "weekly" ? "Sunday All-India Mock" : a.kind === "section" ? "section test" : "topic test"}` })) : data.mocks.map((m) => ({ at: m.takenAt, pct: m.maxScore ? (m.score / m.maxScore) * 100 : 0, label: `${EXAM_BY_ID.get(m.examId)?.name ?? m.examId} · mock` }))} mockHref={mockHref} />
        <section className="card">
          <h2 className="font-semibold text-slate-900">Focus on these topics</h2>
          {weak.length ? (
            <ul className="mt-3 divide-y divide-slate-100">
              {weak.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <div className="font-medium text-slate-800">{TOPIC_BY_ID.get(t.id)?.name ?? t.id}</div>
                    <div className="text-xs text-red-600">{t.pct}% accuracy · {t.attempted} attempted</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/learn?topic=${encodeURIComponent(TOPIC_BY_ID.get(t.id)?.name ?? "")}`} className="btn-ghost px-3 py-1.5 text-xs">
                      Revise
                    </Link>
                    <Link href={`/practice?${exam ? `exam=${exam.id}&` : ""}topics=${t.id}`} className="btn-primary px-3 py-1.5 text-xs">
                      Practise
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 space-y-3 text-sm text-slate-500">
              <p>{attempted ? "No weak topics. Great work!" : "Practise a few topics and your weak areas will show up here."}</p>
              {!attempted && (
                <Link href={practiseHref(exam?.id)} className="btn-primary px-3 py-1.5 text-xs">
                  Practise a topic
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="font-semibold text-slate-900">Test history</h2>
          {synced ? (
            remote.attempts.length ? (
              <ul className="mt-3 divide-y divide-slate-100 text-sm">
                {remote.attempts.slice(0, 10).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 py-2">
                    <span>
                      {EXAM_BY_ID.get(a.examId)?.name ?? a.examId} · {a.kind === "full" ? "full mock" : a.kind === "weekly" ? "Sunday All-India Mock" : a.kind === "section" ? "section test" : "topic test"} · <span className="text-slate-500">{new Date(a.submittedAt).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-semibold">
                        {+(a.score * a.marks).toFixed(2)} / {a.total * a.marks}
                      </span>
                      <Link href={`/tests?id=${a.id}`} className="text-xs font-medium text-brand-700 hover:underline">
                        Analysis
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              noTests
            )
          ) : data.mocks.length ? (
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {data.mocks.slice(0, 8).map((m) => (
                <li key={m.takenAt} className="flex justify-between py-2">
                  <span>
                    {EXAM_BY_ID.get(m.examId)?.name} · <span className="text-slate-500">{new Date(m.takenAt).toLocaleDateString()}</span>
                  </span>
                  <span className="font-semibold">
                    {+m.score.toFixed(2)} / {m.maxScore}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            noTests
          )}
        </section>

        <section className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Recently studied videos</h2>
          {data.videos.length ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.videos.map((v) => (
                <li key={v.videoId}>
                  <Link href={`/video?v=${v.videoId}`} className="flex gap-3 rounded-xl border border-slate-200 p-2 hover:border-brand-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`} alt="" className="h-14 w-24 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 text-sm">
                      <div className="line-clamp-2 font-medium text-slate-800">{v.title}</div>
                      <div className="text-xs text-slate-500">{v.chapters} chapters</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No videos yet. <Link href="/video" className="font-medium text-brand-700">Break down your first lecture</Link>.
            </p>
          )}
        </section>
      </div>
      <MistakePatternSummary />

      <BadgesSection store={data} />
      <section className="card">
        <h2 className="mb-3 font-semibold text-slate-900">Your study activity</h2>
        <Heatmap activity={data.activity} />
      </section>
    </div>
  );
}
