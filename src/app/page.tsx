import { ArrowRight, CalendarCheck, Check, Clock, Layers, ListVideo, Mic, NotebookPen, Target } from "lucide-react";
import Link from "next/link";
import { HomeTop } from "@/components/HomeTop";
import { ProductPreview } from "@/components/ProductPreview";
import { VideoLinkForm } from "@/components/VideoLinkForm";
import { EXAMS } from "@/data/exams";

const HOME_CATEGORIES = ["SSC", "Banking", "Railways", "UPSC", "State PSC", "Teaching", "Defence", "Engineering & Medical", "Law & Management", "Campus Placement"];
import { StartChecklist } from "@/components/StartChecklist";

const FEATURES = [
  { icon: ListVideo, title: "Chapters that show what matters", text: "Every lecture is split where the topic changes, and each chapter is marked High, Medium or Low importance. Smart play watches only the High parts." },
  { icon: NotebookPen, title: "Notes, transcript and export", text: "Key points and facts linked to the exact second, a searchable transcript, your own notes, and export to Markdown or PDF." },
  { icon: Layers, title: "Flashcards that schedule themselves", text: "Smart spaced repetition brings each card back just before you would forget it." },
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
      {/* Personal top (exam picker or dashboard), with the generic hero for new visitors */}
      <HomeTop>
        <section className="pb-4 pt-20 sm:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
            <div>
              <p className="eyebrow">Lecture breakdown</p>
              <h2 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">Learn from long lectures without watching every minute.</h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-[17px]">
                Paste a YouTube link. StudyClip splits the lecture into chapters, marks what matters for your exam, and turns it into notes, quizzes and flashcards.
              </p>
              <div className="mt-8 max-w-lg">
                <VideoLinkForm size="lg" />
              </div>
              <p className="mt-5 text-sm text-slate-600">
                First time here?{" "}
                <Link href="/start" className="font-medium text-brand-700 underline-offset-2 hover:underline">
                  See how StudyClip works in 6 simple steps →
                </Link>
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                {["Practice free", "Works with any captioned lecture", "No sign-up needed"].map((t) => (
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
      </HomeTop>

      {/* First steps for new students; hides itself once done or dismissed */}
      <StartChecklist className="-mt-12" />

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

      {/* Exams by category: one short row instead of a wall of names */}
      <section className="border-y border-slate-200 py-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-slate-500">{EXAMS.length} exams, by category</p>
          <Link href="/exams" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
            All exams <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {HOME_CATEGORIES.map((c) => (
            <Link key={c} href={`/exams?cat=${encodeURIComponent(c)}`} className="pill shrink-0">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="max-w-2xl">
          <p className="eyebrow">Features</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">From a long lecture to exam-ready, in one place</h2>
          <p className="mt-3 hidden text-slate-600 sm:block">Built on methods with strong evidence behind them: retrieval practice with feedback, spaced repetition and interleaved practice.</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:mt-10 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-surface p-4 transition-colors hover:bg-slate-50 sm:p-6">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 transition-colors group-hover:border-slate-300 group-hover:text-slate-900">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-3 text-sm font-medium sm:mt-4 sm:text-base">{f.title}</h3>
              <p className="mt-1.5 hidden text-sm leading-relaxed text-slate-600 sm:block">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Three steps per lecture</h2>
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
