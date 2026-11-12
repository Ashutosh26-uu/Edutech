"use client";

import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { dueTopics } from "@/lib/revision-plan";
import { useRevision } from "@/lib/useRevision";
import type { StoreData } from "@/lib/useStore";
import { InfoTip } from "@/components/InfoTip";

/** Small card for Today: the top three topics due for revision, each one tap from practice. */
export function RevisionDueCard({ store }: { store: StoreData }) {
  const exam = store.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  const rev = useRevision(store, exam?.id);
  if (!rev) return null;
  const due = dueTopics(rev.plan, Date.now(), exam ? examTopicIds(exam) : undefined);

  return (
    <section className="card" aria-labelledby="revise-due">
      <div className="flex items-center justify-between gap-2">
        <h2 id="revise-due" className="flex items-center gap-2 font-semibold text-slate-900">
          <CalendarClock className="h-4 w-4 text-brand-600" /> Revise today ({due.length}) <InfoTip id="revise-today" />
        </h2>
        <Link href="/tracker" className="text-xs font-medium text-brand-700 hover:underline">
          Syllabus tracker →
        </Link>
      </div>
      {due.length ? (
        <ul className="mt-2 divide-y divide-slate-100">
          {due.slice(0, 3).map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div className="min-w-0">
                <Link href={`/topics/${d.id}`} className="font-medium text-slate-800 hover:underline">
                  {TOPIC_BY_ID.get(d.id)?.name ?? d.id}
                </Link>
                <div className="text-xs text-slate-500">{d.overdue > 0 ? `${d.overdue} day${d.overdue === 1 ? "" : "s"} overdue` : "Due today"}</div>
              </div>
              <Link href={`/practice?${exam ? `exam=${exam.id}&` : ""}topics=${d.id}`} className="btn-primary shrink-0 px-3 py-1.5 text-xs">
                Revise
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-1 space-y-2 text-sm text-slate-600">
          <p>Nothing to revise today. Mark topics done in the syllabus tracker and they come back here at the right time.</p>
          <Link href="/tracker" className="btn-ghost px-3 py-1.5 text-xs">
            Open syllabus tracker
          </Link>
        </div>
      )}
    </section>
  );
}
