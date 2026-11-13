import { Infinity as InfinityIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SpeedDrills } from "@/components/SpeedDrills";
import { absoluteUrl } from "@/data/site";
import { TOPIC_BY_ID } from "@/data/topics";
import { UNLIMITED_HINT, UNLIMITED_TOPIC_IDS, unlimitedHref } from "@/lib/unlimited";

export const metadata: Metadata = {
  title: "Speed maths drills – tables, squares, cubes, percentages",
  description: "60-second and 2-minute calculation drills for SSC, banking and railway exams: tables to 30, squares to 50, cubes to 30, roots, fraction to percentage, percentages, addition and approximation. Track your best score.",
  alternates: { canonical: absoluteUrl("/drills") },
};

export default function DrillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        path="/drills"
        title="Speed drills"
        intro="Short rounds of mental maths to make you faster at Quant. Pick a drill, type each answer and press Enter (Esc skips). Your score is correct answers per minute, and your best rounds are kept on this device."
      />
      <section id="unlimited" className="card scroll-mt-20" aria-labelledby="unlimited-heading">
        <h2 id="unlimited-heading" className="flex items-center gap-2 font-semibold text-slate-900">
          <InfinityIcon className="h-5 w-5 text-brand-600" aria-hidden /> Unlimited Quant questions
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Pick a topic and keep going, 10 questions at a time, with the answer and working after each one. {UNLIMITED_HINT}. Free, with no daily limit.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {UNLIMITED_TOPIC_IDS.map((id) => (
            <li key={id}>
              <Link href={unlimitedHref(id)} className="card-link flex min-h-11 items-center justify-between gap-2 p-3 text-sm font-medium text-slate-900">
                <span className="min-w-0">{TOPIC_BY_ID.get(id)?.name ?? id}</span>
                <InfinityIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <Link href={unlimitedHref(UNLIMITED_TOPIC_IDS)} className="btn-primary mt-3 w-full sm:w-auto">
          Mix all {UNLIMITED_TOPIC_IDS.length} topics
        </Link>
      </section>
      <SpeedDrills />
    </div>
  );
}
