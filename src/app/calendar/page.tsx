"use client";

import { CalendarPlus, CalendarX2, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { IS_STATIC, request } from "@/lib/api";
import { KIND, daysFrom, fmtDay, googleCalendarUrl, whenLabel, type ExamEvent } from "@/lib/calendar";
import { useStore } from "@/lib/useStore";

interface Data {
  today: string;
  events: ExamEvent[];
}

export default function CalendarPage() {
  const store = useStore();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [mine, setMine] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (IS_STATIC) return;
    request("/api/calendar")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData, () => setError("Could not load the calendar. Check your connection and try again."));
  }, []);

  const examId = store?.examId;
  const shown = useMemo(() => {
    if (!data) return [];
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return data.events.filter((e) => (!mine || !examId || e.examId === examId) && words.every((w) => `${e.title} ${e.examName ?? ""} ${KIND[e.kind].label}`.toLowerCase().includes(w)));
  }, [data, mine, examId, q]);

  const months = useMemo(() => {
    const m = new Map<string, ExamEvent[]>();
    for (const e of shown) {
      const k = new Date(`${e.day}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return [...m];
  }, [shown]);

  if (IS_STATIC) return <StaticNotice>The exam calendar is on the full site.</StaticNotice>;

  return (
    <div className="space-y-6">
      <PageHeader
        path="/calendar"
        title="Exam calendar"
        intro="Application windows, admit cards, exam days and results. Always confirm on the official website before you act."
        secondary={{ href: "/current-affairs", label: "Daily current affairs quiz" }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input className="input pl-9" placeholder="Search: SSC, IBPS, admit card…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the calendar" />
        </label>
        {examId && (
          <div className="flex gap-2" role="group" aria-label="Which exams">
            <button className={`pill ${mine ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`} aria-pressed={mine} onClick={() => setMine(true)}>
              My exam
            </button>
            <button className={`pill ${!mine ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`} aria-pressed={!mine} onClick={() => setMine(false)}>
              All exams
            </button>
          </div>
        )}
      </div>

      {error && <p className="card text-sm text-red-700">{error}</p>}
      {!data && !error ? (
        <PageSkeleton tiles={0} />
      ) : data && shown.length === 0 ? (
        <div className="card space-y-3 text-sm text-slate-600">
          <CalendarX2 className="h-6 w-6 text-slate-400" />
          <p className="font-semibold text-slate-900">{mine && examId ? "No upcoming dates for your exam yet" : "No upcoming dates yet"}</p>
          <p>Dates appear here as soon as they are announced and added by our editors.</p>
          {mine && examId && (
            <button className="btn-ghost" onClick={() => setMine(false)}>
              Show all exams
            </button>
          )}
        </div>
      ) : (
        data &&
        months.map(([month, events]) => (
          <section key={month} className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-500">{month}</h2>
            <ul className="space-y-2">
              {events.map((e) => {
                const when = whenLabel(data.today, e);
                const soon = daysFrom(data.today, e.day) <= 7 && when !== "Passed";
                return (
                  <li key={e.id} className={`card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${when === "Passed" ? "opacity-60" : ""}`}>
                    <div className="flex min-w-0 gap-3">
                      <div className="w-14 shrink-0 rounded-lg border border-slate-200 py-1.5 text-center">
                        <div className="text-[10px] font-semibold uppercase text-slate-500">{new Date(`${e.day}T00:00:00`).toLocaleDateString("en-IN", { month: "short" })}</div>
                        <div className="text-lg font-semibold leading-tight text-slate-900">{Number(e.day.slice(8))}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`chip ${KIND[e.kind].tone}`}>{KIND[e.kind].label}</span>
                          {e.examId && (
                            <Link href={`/exams/${e.examId}`} className="chip bg-slate-100 text-slate-600 hover:text-slate-900">
                              {e.examName}
                            </Link>
                          )}
                          <span className={`text-xs ${soon ? "font-semibold text-red-700" : "text-slate-500"}`}>{when}</span>
                        </div>
                        <p className="mt-1 font-medium text-slate-900">{e.title}</p>
                        <p className="text-xs text-slate-500">
                          {fmtDay(e.day)}
                          {e.endDay && e.endDay !== e.day ? ` – ${fmtDay(e.endDay)}` : ""}
                          {e.note ? ` · ${e.note}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {e.link && (
                        <a href={e.link} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                          Official site <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {when !== "Passed" && (
                        <a href={googleCalendarUrl(e)} target="_blank" rel="noopener noreferrer" className="btn-quiet" title="Add to Google Calendar">
                          <CalendarPlus className="h-4 w-4" /> Add
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
