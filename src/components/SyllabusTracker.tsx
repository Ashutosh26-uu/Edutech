"use client";

import { AlertTriangle, BookOpen, CalendarClock, Check, Printer, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CATEGORIES, EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { focusTopics } from "@/lib/adaptive";
import { dueAt, dueTopics, type StatusEntry, type TopicStatus } from "@/lib/revision-plan";
import { setExam, type TopicStat } from "@/lib/storage";
import { useRevision } from "@/lib/useRevision";
import { useStore } from "@/lib/useStore";

export const STATUS_LABEL: Record<TopicStatus, string> = { "not-started": "Not started", studying: "Studying", done: "Done", revised: "Revised" };
const STATUS_ORDER: TopicStatus[] = ["not-started", "studying", "done", "revised"];
const STATUS_STYLE: Record<TopicStatus, string> = {
  "not-started": "border-slate-200 text-slate-600",
  studying: "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
  done: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  revised: "border-sky-300 bg-sky-50 text-sky-800 dark:bg-sky-500/10 dark:text-sky-300",
};

const isFinished = (s: TopicStatus) => s === "done" || s === "revised";
const statusOf = (statuses: Record<string, StatusEntry>, id: string): TopicStatus => statuses[id]?.s ?? "not-started";
const accuracy = (st?: TopicStat) => (st?.attempted ? Math.round((st.correct / st.attempted) * 100) : null);
/** Done or Revised, but under 60% over at least 10 questions. */
const isWeak = (status: TopicStatus, st?: TopicStat) => isFinished(status) && !!st && st.attempted >= 10 && st.correct / st.attempted < 0.6;
const topicName = (id: string) => TOPIC_BY_ID.get(id)?.name ?? id;
const shortDate = (t: number) => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" });

// Printing: only the tracker, in black on white, so it can go on a wall.
const PRINT_CSS = `@media print{
body *{visibility:hidden}
#tracker-print,#tracker-print *{visibility:visible}
#tracker-print{position:absolute;left:0;top:0;width:100%}
#tracker-print *{color:#000!important;background:transparent!important;border-color:#bbb!important;box-shadow:none!important}
#tracker-print .print-bar{background:#555!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
#tracker-print .print-track{background:#e5e5e5!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
#tracker-print section{break-inside:avoid}
}`;

export function SyllabusTracker() {
  const store = useStore();
  const exam = store?.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  const rev = useRevision(store, exam?.id);
  if (!store || !rev) return <div className="skeleton h-64" />;

  if (!exam)
    return (
      <div className="space-y-6">
        <Header />
        <div className="card space-y-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">First, choose your exam</p>
          <p>Pick it from the list below to see its full syllabus, topic by topic. Not sure which one? Browse all exams.</p>
          <div className="flex flex-wrap items-center gap-3">
            <ExamSelect value="" />
            <Link href="/exams" className="btn-ghost">
              Browse exams
            </Link>
          </div>
        </div>
      </div>
    );

  const { plan, statuses, setStatus, revised } = rev;
  const ids = examTopicIds(exam);
  const finished = ids.filter((id) => isFinished(statusOf(statuses, id))).length;
  const studying = ids.filter((id) => statusOf(statuses, id) === "studying").length;
  const pct = ids.length ? Math.round((finished / ids.length) * 100) : 0;
  const due = dueTopics(plan, Date.now(), ids);
  const weak = ids.filter((id) => isWeak(statusOf(statuses, id), store.topics[id]));
  const studyingIds = ids.filter((id) => statusOf(statuses, id) === "studying");
  const upNext = [
    ...studyingIds.slice(0, 3).map((id) => ({ id, reason: "You’re studying this" })),
    ...focusTopics(ids.filter((id) => statusOf(statuses, id) === "not-started"), store.topics, 3),
  ].slice(0, 3);
  const practise = (id: string) => `/practice?exam=${exam.id}&topics=${id}`;

  return (
    <div id="tracker-print" className="space-y-6">
      <style>{PRINT_CSS}</style>
      <Header>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <ExamSelect value={exam.id} />
          <button type="button" onClick={() => window.print()} className="btn-ghost">
            <Printer className="h-4 w-4" /> Print / PDF
          </button>
        </div>
      </Header>

      <section className="card">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="eyebrow">{exam.name} syllabus</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900">{pct}% complete</div>
            <div className="mt-1 text-sm text-slate-600">
              {finished} of {ids.length} topics done or revised · {studying} in progress
            </div>
          </div>
          <div className="hidden text-xs print:block">Printed {shortDate(Date.now())}</div>
        </div>
        <Bar pct={pct} className="mt-3 h-2.5" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3 print:hidden">
        <section className="card" aria-labelledby="revise-today">
          <h2 id="revise-today" className="flex items-center gap-2 font-semibold text-slate-900">
            <CalendarClock className="h-4 w-4 text-brand-600" /> Revise today ({due.length})
          </h2>
          <p className="text-xs text-slate-500">Spaced revision: 1, 3, 7, 15, then 30 days. Score 70%+ to stretch the gap; under 50% brings it back to tomorrow.</p>
          {due.length ? (
            <ul className="mt-3 divide-y divide-slate-100">
              {due.map((d) => (
                <li key={d.id} className="py-2.5 text-sm">
                  <div className="font-medium text-slate-800">{topicName(d.id)}</div>
                  <div className="text-xs text-slate-500">{d.overdue > 0 ? `${d.overdue} day${d.overdue === 1 ? "" : "s"} overdue` : "Due today"}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Link href={practise(d.id)} className="btn-primary px-3 py-1.5 text-xs">
                      Revise
                    </Link>
                    <Link href={`/topics/${d.id}`} className="btn-ghost px-3 py-1.5 text-xs">
                      Notes
                    </Link>
                    <button type="button" onClick={() => revised(d.id)} className="btn-ghost px-3 py-1.5 text-xs" title="I revised this from my notes">
                      <Check className="h-3.5 w-3.5" /> Mark revised
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Nothing due. Mark topics Done or practise them and they’ll come back here at the right time.</p>
          )}
        </section>

        <section className="card" aria-labelledby="up-next">
          <h2 id="up-next" className="flex items-center gap-2 font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-brand-600" /> Up next
          </h2>
          {upNext.length ? (
            <ul className="mt-3 divide-y divide-slate-100">
              {upNext.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <Link href={`/topics/${u.id}`} className="font-medium text-slate-800 hover:underline">
                      {topicName(u.id)}
                    </Link>
                    <div className="text-xs text-slate-500">{u.reason}</div>
                  </div>
                  <Link href={practise(u.id)} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
                    Practise
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Every topic is done. Keep revising what comes due.</p>
          )}
        </section>

        <section className="card" aria-labelledby="weak">
          <h2 id="weak" className="flex items-center gap-2 font-semibold text-slate-900">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Done but weak
          </h2>
          <p className="text-xs text-slate-500">Marked Done or Revised, but under 60% over 10+ questions.</p>
          {weak.length ? (
            <ul className="mt-3 divide-y divide-slate-100">
              {weak.map((id) => (
                <li key={id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800">{topicName(id)}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-400">
                      {accuracy(store.topics[id])}% over {store.topics[id]?.attempted} questions
                    </div>
                  </div>
                  <Link href={practise(id)} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
                    Fix it
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No weak spots among your finished topics.</p>
          )}
        </section>
      </div>

      {exam.subjects.map((sub) => {
        const subDone = sub.topicIds.filter((id) => isFinished(statusOf(statuses, id))).length;
        const subPct = sub.topicIds.length ? Math.round((subDone / sub.topicIds.length) * 100) : 0;
        return (
          <section key={sub.name} className="card" aria-label={sub.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-slate-900">{sub.name}</h2>
              <span className="text-xs text-slate-500">{sub.topicIds.length ? `${subDone}/${sub.topicIds.length} · ${subPct}%` : "Topics not listed yet"}</span>
            </div>
            {sub.topicIds.length > 0 && (
              <>
                <Bar pct={subPct} className="mt-2 h-1.5" />
                <ul className="mt-3 divide-y divide-slate-100">
                  {sub.topicIds.map((id) => {
                    const status = statusOf(statuses, id);
                    const st = store.topics[id];
                    const acc = accuracy(st);
                    const entry = plan[id];
                    return (
                      <li key={id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 text-sm">
                        <div className="min-w-0 flex-1 basis-48">
                          <Link href={`/topics/${id}`} className="font-medium text-slate-800 hover:underline">
                            {topicName(id)}
                          </Link>
                          <div className="flex flex-wrap gap-x-2 text-xs text-slate-500">
                            <span>{st?.attempted ? `${st.attempted} Qs · ${acc}%` : "Not practised"}</span>
                            {isWeak(status, st) && <span className="font-medium text-amber-700 dark:text-amber-400">Weak</span>}
                            {entry && <span>Revise {dueAt(entry) <= Date.now() ? "now" : shortDate(dueAt(entry))}</span>}
                          </div>
                        </div>
                        <span className="hidden text-xs font-semibold print:inline">[{STATUS_LABEL[status]}]</span>
                        <div className="flex items-center gap-1.5 print:hidden">
                          <select
                            value={status}
                            onChange={(e) => setStatus(id, e.target.value as TopicStatus)}
                            aria-label={`Status of ${topicName(id)}`}
                            className={`rounded-lg border px-2 py-1.5 text-xs font-medium ${STATUS_STYLE[status]}`}
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                          <Link href={practise(id)} className="btn-ghost px-2.5 py-1.5 text-xs" aria-label={`Practise ${topicName(id)}`}>
                            <BookOpen className="h-3.5 w-3.5" /> Practise
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>
        );
      })}

      <p className="flex items-center gap-1.5 text-xs text-slate-500 print:hidden">
        <RotateCcw className="h-3.5 w-3.5" /> Statuses are saved in this browser for each exam. Practice numbers update as you answer questions.
      </p>
    </div>
  );
}

function Header({ children }: { children?: React.ReactNode }) {
  return (
    <PageHeader
      path="/tracker"
      title="Syllabus tracker"
      intro="See every topic of your exam in one list. Mark each topic as you study it, and we show when to revise it next."
      aside={children}
    />
  );
}

function ExamSelect({ value }: { value: string }) {
  return (
    <select className="input w-auto max-w-full py-2" value={value} onChange={(e) => e.target.value && setExam(e.target.value)} aria-label="Your exam">
      <option value="">Choose your exam…</option>
      {CATEGORIES.map((c) => (
        <optgroup key={c} label={c}>
          {EXAMS.filter((e) => e.category === c).map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Bar({ pct, className = "" }: { pct: number; className?: string }) {
  return (
    <div className={`print-track overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="print-bar h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
