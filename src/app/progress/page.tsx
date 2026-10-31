"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Stat } from "@/components/Quiz";
import { EXAM_BY_ID } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { clearAll, load } from "@/lib/storage";

type Data = ReturnType<typeof load>;

export default function ProgressPage() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => setData(load()), []);
  if (!data) return null;

  const topics = Object.entries(data.topics).map(([id, s]) => ({ id, ...s, pct: Math.round((s.correct / s.attempted) * 100) }));
  const attempted = topics.reduce((n, t) => n + t.attempted, 0);
  const correct = topics.reduce((n, t) => n + t.correct, 0);
  const weak = topics.filter((t) => t.pct < 60).sort((a, b) => a.pct - b.pct);
  const exam = data.examId ? EXAM_BY_ID.get(data.examId) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My progress</h1>
          <p className="mt-1 text-sm text-slate-600">
            {exam ? <>Preparing for <Link href={`/exams/${exam.id}`} className="font-semibold text-brand-700">{exam.name}</Link></> : "Pick an exam to get started."} · Saved in this browser only.
          </p>
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Questions attempted" value={attempted} tone="brand" />
        <Stat label="Accuracy" value={attempted ? `${Math.round((correct / attempted) * 100)}%` : "–"} tone="green" />
        <Stat label="Mock tests taken" value={data.mocks.length} tone="slate" />
        <Stat label="Videos studied" value={data.videos.length} tone="slate" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card">
          <h2 className="font-bold text-slate-900">Focus on these topics</h2>
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
            <p className="mt-2 text-sm text-slate-500">{attempted ? "No weak topics. Great work!" : "Practise a few topics and your weak areas will show up here."}</p>
          )}
        </section>

        <section className="card">
          <h2 className="font-bold text-slate-900">Mock test history</h2>
          {data.mocks.length ? (
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
            <p className="mt-2 text-sm text-slate-500">No mock tests yet.</p>
          )}
        </section>

        <section className="card lg:col-span-2">
          <h2 className="font-bold text-slate-900">Recently studied videos</h2>
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
              No videos yet. <Link href="/video" className="font-semibold text-brand-700">Break down your first lecture</Link>.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
