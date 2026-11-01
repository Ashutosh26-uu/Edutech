import { ArrowLeft, Clock, ExternalLink, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { TopicAccuracy, RememberExam } from "@/components/ExamClient";
import type { Exam } from "@/lib/types";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const exam = EXAM_BY_ID.get((await params).id);
  return exam ? { title: `${exam.name} preparation`, description: `${exam.fullName}: syllabus, practice questions and mock tests.` } : {};
}

function negativeMarkingText(e: Exam) {
  if (e.negativeMarking === null) return "As per the official notification";
  if (e.negativeMarking === 0) return "None";
  const frac = Math.abs(e.negativeMarking - 1 / 3) < 1e-9 ? "⅓" : e.negativeMarking === 0.25 ? "¼" : e.negativeMarking === 0.2 ? "⅕" : String(+e.negativeMarking.toFixed(2));
  return `${frac} of the marks for each wrong answer`;
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = EXAM_BY_ID.get(id);
  if (!exam) notFound();
  const hasPractice = examTopicIds(exam).length > 0;

  return (
    <div className="space-y-8">
      <RememberExam examId={exam.id} />
      <div className="space-y-5">
        <Link href="/exams" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> All exams
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              {exam.category} · {exam.level}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{exam.name}</h1>
            <p className="mt-1 text-slate-600">{exam.fullName}</p>
          </div>
          {hasPractice && (
            <div className="flex flex-wrap gap-2">
              <Link href={`/last-minute?exam=${exam.id}`} className="btn-ghost">
                <Clock className="h-4 w-4" /> Exam tomorrow?
              </Link>
              <Link href={`/practice?exam=${exam.id}&smart=1`} className="btn-ghost">
                <Sparkles className="h-4 w-4" /> Smart practice
              </Link>
              <Link href={`/practice?exam=${exam.id}&mock=1`} className="btn-primary">
                Take a mock test
              </Link>
            </div>
          )}
        </div>
        <dl className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-sm sm:grid-cols-3">
          <div className="bg-surface p-4">
            <dt className="text-xs text-slate-500">Conducted by</dt>
            <dd className="mt-1 font-medium text-slate-900">{exam.conductedBy}</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-xs text-slate-500">Negative marking</dt>
            <dd className="mt-1 font-medium text-slate-900">{negativeMarkingText(exam)}</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-xs text-slate-500">Official information</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {exam.website ? (
                <a href={exam.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                  {new URL(exam.website).hostname.replace(/^www\./, "")} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                "See the conducting body’s website"
              )}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-slate-500">Exam patterns change. Always confirm dates, eligibility and the current pattern in the latest official notification.</p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {exam.subjects.map((s) => (
          <section key={s.name} className="card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-semibold">{s.name}</h2>
              {s.topicIds.length > 0 && (
                <Link href={`/practice?exam=${exam.id}&topics=${s.topicIds.join(",")}`} className="text-sm font-medium text-brand-700 hover:underline">
                  Practise subject
                </Link>
              )}
            </div>
            {s.topicIds.length ? (
              <ul className="divide-y divide-slate-100">
                {s.topicIds.map((tid) => {
                  const t = TOPIC_BY_ID.get(tid)!;
                  return (
                    <li key={tid} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <Link href={`/learn?topic=${encodeURIComponent(t.name)}`} className="font-medium text-slate-800 hover:text-brand-700">
                          {t.name}
                        </Link>
                        <TopicAccuracy topicId={tid} />
                      </div>
                      <Link href={`/practice?exam=${exam.id}&topics=${tid}`} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
                        Practise
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Practice questions for this subject are coming soon. Meanwhile, break down a lecture on it in Videos.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
