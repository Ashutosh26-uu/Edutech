"use client";

import { ChevronDown, Lightbulb, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { INTERVIEW } from "@/data/interview";

/** Renders `inline code` in an answer as monospace. */
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-slate-100 px-1 font-mono text-[0.9em] text-slate-800">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Placement interview prep: HR, behavioural and technical questions with model answers a fresher can adapt. */
export default function InterviewPage() {
  const [section, setSection] = useState(INTERVIEW[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const shown = useMemo(() => {
    if (q) return INTERVIEW.flatMap((s) => s.items.filter((i) => (i.q + " " + i.a).toLowerCase().includes(q)).map((item) => ({ item, section: s })));
    const s = INTERVIEW.find((x) => x.id === section);
    return s ? s.items.map((item) => ({ item, section: s })) : [];
  }, [q, section]);
  const current = INTERVIEW.find((x) => x.id === section);
  const total = INTERVIEW.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Interview preparation</h1>
        <p className="mt-1 text-sm text-slate-600">
          {total} questions asked in campus and off-campus placement interviews, with model answers to adapt in your own words. Practise the written tests on the{" "}
          <Link href="/exams/tcs-nqt" className="font-medium text-brand-700">
            placement exam pages
          </Link>{" "}
          and build your CV with the{" "}
          <Link href="/resume" className="font-medium text-brand-700">
            resume builder
          </Link>
          .
        </p>
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input className="input pl-9" placeholder="Search all questions, e.g. deadlock, weakness, normalisation" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>

      {!q && (
        <div className="flex flex-wrap gap-2">
          {INTERVIEW.map((s) => (
            <button key={s.id} onClick={() => setSection(s.id)} className={`chip px-3 py-1.5 text-sm ${s.id === section ? "bg-ink text-on-ink" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {s.title} <span className="opacity-60">{s.items.length}</span>
            </button>
          ))}
        </div>
      )}
      {!q && current && <p className="text-sm text-slate-600">{current.intro}</p>}
      {q && <p className="text-sm text-slate-600">{shown.length} matching questions</p>}

      <ul className="space-y-2">
        {shown.map(({ item, section: s }) => {
          const key = s.id + item.q;
          const isOpen = open === key;
          return (
            <li key={key} className="card p-0">
              <button className="flex w-full items-start justify-between gap-3 p-4 text-left" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}>
                <span className="font-medium text-slate-900">
                  {q && <span className="mr-2 chip bg-slate-100 text-xs text-slate-600">{s.title}</span>}
                  <Line text={item.q} />
                </span>
                <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="space-y-2 border-t border-slate-100 px-4 pt-3 pb-4 text-sm text-slate-700">
                  <p className="whitespace-pre-line">
                    <Line text={item.a} />
                  </p>
                  {item.tip && (
                    <p className="flex gap-2 rounded-lg bg-emerald-50 p-2.5 text-emerald-900">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" /> <Line text={item.tip} />
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
