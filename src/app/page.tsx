import Link from "next/link";
import { VideoLinkForm } from "@/components/VideoLinkForm";
import { EXAMS } from "@/data/exams";

const FEATURES = [
  { icon: "✂️", title: "Smart video breakdown", text: "Long lectures split into short chapters with titles, summaries and an exam-importance tag.", href: "/video" },
  { icon: "📝", title: "Crisp notes and quizzes", text: "Key points, important facts, a one-line summary and a quick quiz for every video.", href: "/video" },
  { icon: "🎯", title: "Exam mode", text: "Pick your exam to get its syllabus, topic-wise practice and timed mock tests with negative marking.", href: "/exams" },
  { icon: "🔎", title: "Learn any topic", text: "Search any topic for notes and practice questions, or paste a question to get its answer.", href: "/learn" },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-12 text-white sm:px-12">
        <p className="chip mb-4 bg-white/15 text-white">For one-day exam aspirants</p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">Turn 3-hour lectures into 30 minutes of focused study.</h1>
        <p className="mt-4 max-w-xl text-brand-100">
          Paste any YouTube lecture. StudyClip breaks it into chapters, highlights what matters for your exam, writes crisp notes and quizzes you on it.
        </p>
        <div className="mt-8 max-w-2xl">
          <VideoLinkForm dark />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Link key={f.title} href={f.href} className="card transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.text}</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold text-slate-900">Prepare for your exam</h2>
          <Link href="/exams" className="text-sm font-semibold text-brand-700">
            All exams →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {EXAMS.map((e) => (
            <Link key={e.id} href={`/exams/${e.id}`} className="card py-4 transition hover:border-brand-300">
              <div className="font-semibold text-slate-900">{e.name}</div>
              <div className="mt-0.5 text-xs text-slate-500">{e.conductedBy}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">How it works</h2>
        <ol className="mt-4 grid gap-4 text-sm sm:grid-cols-4">
          {[
            ["Paste a link", "Any YouTube lecture with captions, or paste its transcript."],
            ["We read the transcript", "Timestamps and text are pulled from the video’s captions."],
            ["Topics are detected", "Wherever the subject changes, a new chapter starts."],
            ["You study smarter", "Watch only the important clips, read the notes, take the quiz."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
              <div>
                <div className="font-semibold text-slate-900">{t}</div>
                <div className="text-slate-600">{d}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
