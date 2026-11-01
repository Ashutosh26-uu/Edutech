"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, EXAMS, examTopicIds } from "@/data/exams";

/** Searchable, filterable list of every exam, grouped by category. */
export function ExamBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [level, setLevel] = useState<"All" | "National" | "State">("All");

  const filtered = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return EXAMS.filter((e) => {
      if (cat !== "All" && e.category !== cat) return false;
      if (level !== "All" && e.level !== level) return false;
      const hay = `${e.name} ${e.fullName} ${e.conductedBy} ${e.category}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [q, cat, level]);

  const groups = CATEGORIES.map((c) => ({ c, exams: filtered.filter((e) => e.category === c) })).filter((g) => g.exams.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search exams, e.g. SSC, bank, UPSC, police, NEET, Bihar…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search exams" />
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-surface p-0.5 text-sm">
          {(["All", "National", "State"] as const).map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={`rounded-md px-3 py-1.5 ${level === l ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"}`}>
              {l === "All" ? "All levels" : l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["All", ...CATEGORIES].map((c) => {
          const n = c === "All" ? EXAMS.length : EXAMS.filter((e) => e.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${cat === c ? "border-ink bg-ink text-on-ink" : "border-slate-200 bg-surface text-slate-600 hover:border-slate-300"}`}
            >
              {c} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} exam{filtered.length === 1 ? "" : "s"}
      </p>

      {groups.map(({ c, exams }) => (
        <section key={c}>
          <h2 className="mb-3 text-base font-semibold">{c}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((e) => {
              const topics = examTopicIds(e).length;
              return (
                <Link key={e.id} href={`/exams/${e.id}`} className="group card flex flex-col p-4 transition-colors hover:border-slate-300">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900">{e.name}</span>
                    {e.level === "State" && <span className="chip shrink-0 bg-slate-100 text-slate-500">State</span>}
                  </div>
                  <span className="mt-1 line-clamp-2 text-sm text-slate-500">{e.fullName}</span>
                  <span className="mt-1 truncate text-xs text-slate-400">{e.conductedBy}</span>
                  <span className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
                    {topics ? `${topics} practice topics` : "Syllabus only"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {!filtered.length && (
        <div className="card text-center text-sm text-slate-500">
          No exams match “{q}”. Try a shorter search or another category.
        </div>
      )}
    </div>
  );
}
