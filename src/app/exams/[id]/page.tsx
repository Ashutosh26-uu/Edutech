import Link from "next/link";
import { notFound } from "next/navigation";
import { EXAMS, EXAM_BY_ID } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { TopicAccuracy, RememberExam } from "@/components/ExamClient";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ id: e.id }));
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = EXAM_BY_ID.get(id);
  if (!exam) notFound();

  return (
    <div className="space-y-6">
      <RememberExam examId={exam.id} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/exams" className="text-sm text-brand-700">
            ← All exams
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{exam.name}</h1>
          <p className="text-sm text-slate-600">
            {exam.fullName} · Negative marking: {exam.negativeMarking ? `−${+exam.negativeMarking.toFixed(2)} per wrong answer` : "none"}
          </p>
        </div>
        <Link href={`/practice?exam=${exam.id}&mock=1`} className="btn-primary">
          Take a full mock test
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {exam.subjects.map((s) => (
          <section key={s.name} className="card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-bold text-slate-900">{s.name}</h2>
              <Link href={`/practice?exam=${exam.id}&topics=${s.topicIds.join(",")}`} className="text-sm font-semibold text-brand-700">
                Practise subject →
              </Link>
            </div>
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
          </section>
        ))}
      </div>
    </div>
  );
}
