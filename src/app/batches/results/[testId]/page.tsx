"use client";

import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BatchGate } from "@/components/BatchGate";
import { PageHeader } from "@/components/PageHeader";
import { PageSkeleton } from "@/components/Skeleton";
import { batchApi, fmtDate, fmtMinutes } from "@/lib/batches";

interface Results {
  test: { id: string; title: string; total: number; maxScore: number; marks: number; negativeMarking: number; minutes: number; dueAt: number | null; createdAt: number };
  batch: { id: string; name: string };
  summary: { members: number; submitted: number; average: number | null; highest: number | null };
  rows: { userId: string; name: string; email: string; status: "submitted" | "in-progress" | "not-started"; score: number | null; correct: number | null; wrong: number | null; skipped: number | null; accuracy: number | null; seconds: number | null; submittedAt: number | null }[];
  topics: { id: string; name: string; asked: number; attempted: number; accuracy: number | null }[];
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={4} />}>
      <BatchGate>
        <ResultsView />
      </BatchGate>
    </Suspense>
  );
}

const STATUS = { submitted: "Submitted", "in-progress": "In progress", "not-started": "Not started" };

function ResultsView() {
  const { testId } = useParams<{ testId: string }>();
  const [r, setR] = useState<Results | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    batchApi<Results>(`/tests/${testId}/results`).then((x) => (x.data ? setR(x.data) : setError(x.error ?? "")));
  }, [testId]);

  if (error) return <p className="card text-sm text-red-700">{error}</p>;
  if (!r) return <PageSkeleton tiles={4} />;
  const s = r.summary;
  let rank = 0;

  return (
    <div className="space-y-6">
      <Link href={`/batches/${r.batch.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> {r.batch.name}
      </Link>
      <PageHeader
        path={`/batches/results/${testId}`}
        title={r.test.title}
        intro={`${r.test.total} questions · ${r.test.minutes} min · out of ${r.test.maxScore}${r.test.negativeMarking ? ` · −${r.test.negativeMarking * r.test.marks} per wrong answer` : ""}${r.test.dueAt ? ` · due ${fmtDate(r.test.dueAt)}` : ""}`}
        aside={
          <a href={`/api/batches/tests/${testId}/results?format=csv`} className="btn-primary" download>
            <Download className="h-4 w-4" /> Download CSV
          </a>
        }
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Submitted", `${s.submitted}/${s.members}`],
          ["Average", s.average === null ? "–" : `${s.average}/${r.test.maxScore}`],
          ["Highest", s.highest === null ? "–" : `${s.highest}/${r.test.maxScore}`],
          ["Not started", String(r.rows.filter((x) => x.status === "not-started").length)],
        ].map(([k, v]) => (
          <div key={k} className="card">
            <dt className="text-xs text-slate-500">{k}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className="card min-w-0 overflow-x-auto" aria-labelledby="rows-h">
          <h2 id="rows-h" className="mb-3 font-semibold">
            Students
          </h2>
          {r.rows.length === 0 ? (
            <p className="text-sm text-slate-500">No students in this batch yet.</p>
          ) : (
            <table className="min-w-[36rem]">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>C / W / S</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {r.rows.map((x) => {
                  if (x.status === "submitted") rank++;
                  return (
                    <tr key={x.userId}>
                      <td className="text-slate-500">{x.status === "submitted" ? rank : ""}</td>
                      <td>
                        <span className="block font-medium text-slate-900">{x.name}</span>
                        <span className="block text-xs text-slate-500">{x.email}</span>
                      </td>
                      <td>{x.status === "submitted" ? <span className="font-semibold text-slate-900">{x.score}</span> : <span className="chip bg-slate-100 text-slate-600">{STATUS[x.status]}</span>}</td>
                      <td>{x.accuracy === null ? "–" : <Bar pct={x.accuracy} />}</td>
                      <td className="text-slate-600">{x.status === "submitted" ? `${x.correct} / ${x.wrong} / ${x.skipped}` : "–"}</td>
                      <td className="text-slate-600">{x.seconds === null ? "–" : fmtMinutes(x.seconds)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section className="card space-y-3" aria-labelledby="topics-h">
          <div>
            <h2 id="topics-h" className="font-semibold">
              Batch accuracy by topic
            </h2>
            <p className="text-xs text-slate-500">Weakest first. Plan the next class around the top of this list.</p>
          </div>
          {r.topics.length === 0 ? (
            <p className="text-sm text-slate-500">Appears once students submit.</p>
          ) : (
            <ul className="space-y-3">
              {r.topics.map((t) => (
                <li key={t.id} className="text-sm">
                  <span className="flex items-center justify-between gap-2">
                    <Link href={`/topics/${t.id}`} className="truncate text-slate-800 hover:text-slate-900 hover:underline">
                      {t.name}
                    </Link>
                    <span className="shrink-0 text-xs tabular-nums text-slate-500">{t.accuracy === null ? "no answers" : `${t.accuracy}%`}</span>
                  </span>
                  <Bar pct={t.accuracy ?? 0} wide />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Bar({ pct, wide = false }: { pct: number; wide?: boolean }) {
  const tone = pct < 50 ? "bg-red-500" : pct < 75 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <span className={`flex items-center gap-2 ${wide ? "mt-1.5" : ""}`}>
      <span className={`block h-1.5 overflow-hidden rounded-full bg-slate-100 ${wide ? "flex-1" : "w-16"}`}>
        <span className={`block h-full rounded-full ${tone}`} style={{ width: `${Math.max(pct, 3)}%` }} />
      </span>
      {!wide && <span className="text-xs tabular-nums text-slate-600">{pct}%</span>}
    </span>
  );
}
