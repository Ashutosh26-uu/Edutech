import { Sigma } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/data/site";
import { FORMULA_SUBJECTS, formulaTopics } from "@/lib/formulas";

export const metadata: Metadata = {
  title: "Formula sheets and short tricks – Quant, Reasoning, Maths",
  description: "Printable one-page formula sheets for every Quantitative Aptitude, Reasoning, JEE Maths, placement aptitude, Physics and Chemistry topic. Save as PDF and revise anywhere.",
  alternates: { canonical: absoluteUrl("/formulas") },
};

export default async function FormulasPage() {
  const topics = await formulaTopics();
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Revision</p>
        <h1 className="mt-1 text-2xl font-semibold">Formula sheets</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          {topics.length} one-page sheets with the formulas, rules and short tricks from our topic notes. Open one and use <b>Print / Save as PDF</b> to keep an A4 copy for last-minute revision.
        </p>
      </div>
      {FORMULA_SUBJECTS.map((subject) => {
        const list = topics.filter((t) => t.subject === subject);
        if (!list.length) return null;
        return (
          <section key={subject} className="space-y-3">
            <h2 className="font-semibold text-slate-900">
              {subject} <span className="text-sm font-normal text-slate-500">({list.length})</span>
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <li key={t.id}>
                  <Link href={`/formulas/${t.id}`} className="card-link flex items-center gap-3 p-3">
                    <Sigma className="h-4 w-4 shrink-0 text-brand-600" />
                    <span className="min-w-0 text-sm font-medium text-slate-900">{t.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
