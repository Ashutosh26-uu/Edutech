import Link from "next/link";
import { EXAMS, examTopicIds } from "@/data/exams";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Choose your exam</h1>
        <p className="mt-1 text-sm text-slate-600">Get the syllabus, topic-wise practice and full mock tests for your exam.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMS.map((e) => (
          <Link key={e.id} href={`/exams/${e.id}`} className="card flex flex-col transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
            <div className="text-lg font-bold text-slate-900">{e.name}</div>
            <div className="text-sm text-slate-500">{e.fullName}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {e.subjects.map((s) => (
                <span key={s.name} className="chip bg-slate-100 text-slate-600">{s.name}</span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4 text-sm">
              <span className="text-slate-500">{examTopicIds(e).length} topics</span>
              <span className="font-semibold text-brand-700">Start preparing →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
