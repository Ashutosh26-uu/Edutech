"use client";

import { Target } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIES, fmtMarks, hasCutoffs, predict, type Category, type VerdictBand } from "@/lib/predictor";

const KEY = "studyclip:predictor-category";

const CATEGORY_LABEL: Record<Category, string> = { UR: "UR / General", OBC: "OBC", EWS: "EWS", SC: "SC", ST: "ST" };

const BAND_TONE: Record<VerdictBand, string> = {
  above: "bg-emerald-50 text-emerald-700",
  close: "bg-amber-50 text-amber-700",
  below: "bg-red-50 text-red-700",
};

export const PREDICTOR_CAVEAT = "Past cut-offs only. This year's cut-off depends on vacancies and the paper; StudyClip mocks are practice papers, not the real exam.";

function readCategory(): Category {
  try {
    const v = localStorage.getItem(KEY);
    return (CATEGORIES as readonly string[]).includes(v ?? "") ? (v as Category) : "UR";
  } catch {
    return "UR";
  }
}

/** "Where you stand": a full-mock score against the exam's past official cut-offs. Hidden when there is no data. */
export function PredictorCard({ examId, score, maxScore }: { examId?: string; score: number; maxScore: number }) {
  const [category, setCategory] = useState<Category>("UR");
  // The saved category is read after mount, so the server and first client render agree.
  useEffect(() => setCategory(readCategory()), []);
  if (!hasCutoffs(examId)) return null;
  const p = predict(examId, score, maxScore, category);

  const choose = (c: Category) => {
    setCategory(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {}
  };

  return (
    <section className="card space-y-3" aria-labelledby="predictor-heading">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Target className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h4 id="predictor-heading" className="text-base font-semibold text-slate-900">
            Where you stand
          </h4>
          <p className="text-sm text-slate-600">Your score of {fmtMarks(score)} / {maxScore} against past official cut-offs.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Your category">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => choose(c)} aria-pressed={category === c} className={`pill px-3 py-1 text-xs ${category === c ? "border-brand-500 bg-brand-50 text-brand-800" : ""}`}>
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      {p ? (
        <>
          <p className="text-sm">
            <span className={`chip ${BAND_TONE[p.band]}`}>{p.verdict}</span>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-1 pr-2 font-medium">Year</th>
                  <th className="py-1 pr-2 font-medium">Cut-off</th>
                  <th className="py-1 font-medium">You</th>
                </tr>
              </thead>
              <tbody>
                {p.rows.map((r) => (
                  <tr key={`${r.year}-${r.category}`} className="border-t border-slate-200 align-top">
                    <td className="py-2 pr-2 text-slate-900 tabular-nums">{r.kind === "qualifying" ? "Every year" : r.year}</td>
                    <td className="py-2 pr-2 text-slate-900 tabular-nums">
                      {fmtMarks(r.cutoff)}
                      {r.scaled && (
                        <span className="block text-xs text-slate-500">
                          {fmtMarks(r.original)} / {r.originalTotal}, scaled to this mock’s total
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <span className={r.gap >= 0 ? "text-emerald-700" : "text-red-600"}>{r.gapText}</span>
                      <span className="block text-xs text-slate-500">
                        {r.source}
                        {r.note ? ` · ${r.note}` : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-600">No past cut-off for this category yet.</p>
      )}

      <p className="text-xs text-slate-500">{PREDICTOR_CAVEAT}</p>
    </section>
  );
}
