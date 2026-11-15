"use client";

import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CODING_PROBLEMS } from "@/data/coding-problems";
import { getSolved } from "@/lib/codingProgress";

type Filter = "all" | "easy" | "medium" | "unsolved";

export function CodingList() {
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  useEffect(() => setSolved(getSolved()), []);

  const list = useMemo(
    () =>
      CODING_PROBLEMS.filter((p) =>
        filter === "all" ? true : filter === "unsolved" ? !solved.has(p.id) : p.difficulty === filter,
      ),
    [filter, solved],
  );
  const done = CODING_PROBLEMS.filter((p) => solved.has(p.id)).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter problems">
          {(["all", "easy", "medium", "unsolved"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`pill capitalize ${filter === f ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-600">
          Solved <span className="font-semibold text-slate-900">{done}</span> / {CODING_PROBLEMS.length}
        </p>
      </div>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-surface">
        {list.map((p) => (
          <li key={p.id}>
            <Link href={`/coding/solve?id=${p.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50">
              {solved.has(p.id) ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Solved" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-label="Not solved" />
              )}
              <span className="w-6 shrink-0 text-xs text-slate-400 tabular-nums">{CODING_PROBLEMS.indexOf(p) + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-slate-900">{p.title}</span>
                <span className="block text-xs text-slate-500">{p.topic}</span>
              </span>
              <span className={`chip ${p.difficulty === "easy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{p.difficulty}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
          </li>
        ))}
        {list.length === 0 && <li className="px-4 py-6 text-center text-sm text-slate-500">{filter === "unsolved" ? "You have solved every problem. Nice work!" : "No problems here."}</li>}
      </ul>
    </section>
  );
}
