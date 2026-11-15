import Link from "next/link";
import type { Exam } from "@/lib/types";
import { weightRows, type WeightLevel } from "@/lib/topicWeights";

const LEVEL_TONE: Record<WeightLevel, string> = {
  Easy: "text-slate-600",
  Moderate: "text-slate-700",
  Hard: "text-slate-800",
  "Very hard": "text-slate-900 font-semibold",
};

const pct = (x: number) => (x >= 0.095 ? Math.round(x * 100) : +(x * 100).toFixed(1)) + "%";

/** Topic weightage for an exam: one thin bar per topic, largest first (server-rendered, no chart library). */
export function TopicWeights({ exam }: { exam: Exam }) {
  const rows = weightRows(exam);
  if (rows.length < 2) return null;
  // Bars scale to the biggest single topic; the folded "Other topics" row shows its share as text only.
  const max = Math.max(...rows.filter((r) => r.topicId).map((r) => r.share));
  return (
    <section className="card" aria-labelledby="topic-weightage">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="topic-weightage" className="font-semibold">
          Topic weightage
        </h2>
        <span className="text-xs text-slate-500">Share of the paper · typical level</span>
      </div>
      <table className="mt-3 w-full border-separate border-spacing-y-1.5 text-sm">
        <caption className="sr-only">Estimated share of the {exam.name} paper for each topic, with its typical difficulty</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Topic</th>
            <th scope="col">Share of the paper</th>
            <th scope="col">Typical level</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.topicId ?? "other"} className="align-middle">
              <th scope="row" className="w-[42%] max-w-0 pr-3 text-left font-normal sm:w-[34%]">
                {r.topicId ? (
                  <Link href={`/topics/${r.topicId}`} className="block truncate text-slate-800 hover:text-brand-700" title={r.name}>
                    {r.name}
                  </Link>
                ) : (
                  <span className="block truncate text-slate-500">
                    {r.name} ({r.count})
                  </span>
                )}
              </th>
              <td className="pr-3">
                <div className="flex items-center gap-2">
                  {r.topicId ? (
                    <div className="h-2 min-w-0 flex-1 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${Math.max(2, (r.share / max) * 100)}%` }} />
                    </div>
                  ) : (
                    <span className="min-w-0 flex-1 text-xs text-slate-500">rest of the syllabus</span>
                  )}
                  <span className="w-11 shrink-0 text-right tabular-nums text-xs font-medium text-slate-700">{pct(r.share)}</span>
                </div>
              </td>
              <td className="w-20 text-right sm:w-24">{r.level ? <span className={`inline-block whitespace-nowrap rounded-full border border-slate-200 px-2 py-0.5 text-[11px] ${LEVEL_TONE[r.level]}`}>{r.level}</span> : <span className="text-xs text-slate-400">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">Estimate from StudyClip’s own exam pattern and question bank — not from copied past papers. Use it to plan revision; the real paper varies year to year.</p>
    </section>
  );
}
