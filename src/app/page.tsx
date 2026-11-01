import { ArrowRight, CalendarCheck, Check, Clock, Layers, ListVideo, Mic, NotebookPen, Target } from "lucide-react";
import Link from "next/link";
import { ProductPreview } from "@/components/ProductPreview";
import { VideoLinkForm } from "@/components/VideoLinkForm";
import { EXAMS, FEATURED_EXAMS, examTopicIds } from "@/data/exams";

const FEATURES = [
  { icon: ListVideo, title: "Chapters that show what matters", text: "Every lecture is split where the topic changes, and each chapter is marked High, Medium or Low importance. Smart play watches only the High parts." },
  { icon: NotebookPen, title: "Notes, transcript and export", text: "Key points and facts linked to the exact second, a searchable transcript, your own notes, and export to Markdown or PDF." },
  { icon: Layers, title: "Flashcards that schedule themselves", text: "The FSRS spaced-repetition algorithm brings each card back just before you would forget it." },
  { icon: Target, title: "Practice that adapts", text: "Questions come more often from the topics you get wrong, mixed together, with an explanation after every answer." },
  { icon: CalendarCheck, title: "A plan for every day", text: "Set your exam date and get a daily checklist, mock tests on a schedule, and a clear view of your weak topics." },
  { icon: Mic, title: "Search by voice", text: "Ask for a topic or a question out loud, in English or Hindi, and listen to notes read back to you." },
];

const STEPS = [
  { title: "Paste a lecture", text: "Any YouTube lecture with captions. You can also paste a transcript." },
  { title: "Review the breakdown", text: "Read the chapters and notes, then watch only the important parts." },
  { title: "Make it stick", text: "Take the quiz, save flashcards and keep practising your weak topics." },
];

export default function Home() {
  return (
    <div className="-mt-10 space-y-24">
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden px-4 pb-4 pt-16 sm:pt-20">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Link href="/exams" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3 py-1 text-xs text-slate-600 hover:border-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              For SSC, banking, railway, UPSC and CTET aspirants
              <ArrowRight className="h-3 w-3" />
            </Link>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl">Learn from long lectures without watching every minute.</h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-600">
              Paste a YouTube link. StudyClip splits the lecture into chapters, marks what matters for your exam, and turns it into notes, quizzes and flashcards.
            </p>
            <div className="mt-8 max-w-lg">
              <VideoLinkForm size="lg" />
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              {["Free to use", "Works with any captioned lecture", "No sign-up"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <ProductPreview />
        </div>
      </section>

      {/* Last-minute offer */}
      <section className="-mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Exam tomorrow?</h2>
            <p className="text-sm text-slate-600">Full-syllabus revision sheet and rapid flashcards for ₹19, or 3 timed tests for ₹19. No subscription.</p>
          </div>
        </div>
        <Link href="/last-minute" className="btn-primary shrink-0">
          Revise tonight <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Exams */}
      <section className="border-y border-slate-200 py-8">
        <p className="text-center text-sm text-slate-500">Syllabus, practice questions and mock tests for {EXAMS.length} exams, including</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {FEATURED_EXAMS.map((e) => (
            <Link key={e.id} href={`/exams/${e.id}`} className="text-lg font-semibold tracking-tight text-slate-400 transition-colors hover:text-slate-900">
              {e.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="max-w-2xl">
          <p className="eyebrow">Features</p>
          <h2 className="mt-2 text-3xl font-semibold">From a long lecture to exam-ready, in one place</h2>
          <p className="mt-3 text-slate-600">Built on methods with strong evidence behind them: retrieval practice with feedback, spaced repetition and interleaved practice.</p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface p-6">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold">Three steps per lecture</h2>
          <p className="mt-3 text-slate-600">Chapters come from the video’s own captions. Nothing is downloaded: videos play in YouTube’s official player.</p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card">
              <span className="font-mono text-sm text-slate-400">0{i + 1}</span>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Exam cards */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Exam preparation</p>
            <h2 className="mt-2 text-3xl font-semibold">Choose your exam</h2>
          </div>
          <Link href="/exams" className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
            All {EXAMS.length} exams <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_EXAMS.map((e) => (
            <Link key={e.id} href={`/exams/${e.id}`} className="group card flex flex-col p-4 transition-colors hover:border-slate-300">
              <span className="font-medium text-slate-900">{e.name}</span>
              <span className="mt-1 line-clamp-2 text-xs text-slate-500">{e.fullName}</span>
              <span className="mt-4 flex items-center justify-between text-xs text-slate-500">
                {e.category} · {examTopicIds(e).length} topics
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="rounded-2xl bg-ink px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-semibold text-on-ink">Start with your next lecture</h2>
        <p className="mx-auto mt-3 max-w-md text-on-ink/70">Paste any YouTube link and get chapters, notes and a quiz in under a minute.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/video" className="btn bg-on-ink px-5 text-ink hover:opacity-90">
            Break down a lecture <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/today" className="btn border border-on-ink/20 px-5 text-on-ink hover:bg-on-ink/10">
            Plan my preparation
          </Link>
        </div>
      </section>
    </div>
  );
}
