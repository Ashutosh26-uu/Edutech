"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, EXAMS, examTopicIds, searchExams } from "@/data/exams";

/** Searchable, filterable list of every exam, grouped by category. */
export function ExamBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  // /exams?cat=Banking (from the home page) opens with that category picked.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat");
    if (c && (CATEGORIES as string[]).includes(c)) setCat(c);
  }, []);

  const filtered = useMemo(() => searchExams(q).filter((e) => cat === "All" || e.category === cat), [q, cat]);

  const groups = CATEGORIES.map((c) => ({ c, exams: filtered.filter((e) => e.category === c) })).filter((g) => g.exams.length);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input className="input pl-9" placeholder="Search: SSC, bank, UPSC, NEET, Bihar…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search exams" />
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`pill shrink-0 ${cat === c ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`}
          >
            {c === "All" ? "All exams" : c}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} exam{filtered.length === 1 ? "" : "s"}
        {cat !== "All" && (
          <>
            {" "}in {cat} ·{" "}
            <button className="font-medium text-slate-700 underline-offset-2 hover:underline" onClick={() => setCat("All")}>
              show all
            </button>
          </>
        )}
      </p>

      {groups.map(({ c, exams }) => (
        <section key={c}>
          <h2 className="mb-3 text-base font-semibold">{c}</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {exams.map((e) => {
              const topics = examTopicIds(e).length;
              return (
                <Link key={e.id} href={`/exams/${e.id}`} className="group card-link flex min-w-0 flex-col px-4 py-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900">{e.name}</span>
                    {e.level === "State" && <span className="chip shrink-0 bg-slate-100 text-slate-500">State</span>}
                  </div>
                  <span className="mt-0.5 line-clamp-1 text-sm text-slate-500 sm:line-clamp-2">{e.fullName}</span>
                  <span className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500 sm:pt-4">
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
