import { ArrowLeft, BookOpen, CheckCircle2, ListChecks, Sigma } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintPracticeSheet } from "@/components/PrintPracticeSheet";
import { RichText } from "@/components/RichText";
import { TopicNotesContent } from "@/components/TopicNotesContent";
import { BANK_LOADERS, BANK_SIZES } from "@/data/bank";
import { EXAMS } from "@/data/exams";
import { NOTES_LOADERS } from "@/data/notes";
import { absoluteUrl } from "@/data/site";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import type { BankQuestion } from "@/lib/bank";
import { hasFormulaSheet } from "@/lib/formulas";
import type { Difficulty } from "@/lib/types";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const topic = TOPIC_BY_ID.get((await params).id);
  if (!topic) return {};
  const title = `${topic.name} – notes and practice questions with solutions`;
  return {
    title,
    description: topic.summary,
    alternates: { canonical: absoluteUrl(`/topics/${topic.id}`) },
    openGraph: { title, description: topic.summary, type: "article" },
  };
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: "Easy", moderate: "Moderate", hard: "Hard", "very-hard": "Very hard" };
const TIERS: Difficulty[] = ["easy", "moderate", "hard", "very-hard"];
const SAMPLE_SIZE = 5;

/** The first question of each difficulty, topped up with the earliest remaining ones: the same picks on every build. */
function sampleQuestions(bank: BankQuestion[]): BankQuestion[] {
  const picked: BankQuestion[] = [];
  for (const d of TIERS) {
    const q = bank.find((x) => x.difficulty === d);
    if (q) picked.push(q);
  }
  for (const q of bank) {
    if (picked.length >= SAMPLE_SIZE) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return picked.slice(0, SAMPLE_SIZE);
}

/** JSON for a <script> tag: `<` is escaped so text in a question can never close the tag. */
const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = TOPIC_BY_ID.get(id);
  if (!topic) notFound();

  // Only this topic's bank and notes are loaded, so a page never pulls in the whole bank.
  const [bank, notes] = await Promise.all([BANK_LOADERS[id]?.().then((m) => m.default) ?? [], NOTES_LOADERS[id]?.().then((m) => m.default)]);
  const samples = sampleQuestions(bank);
  const count = BANK_SIZES[id] ?? bank.length;
  const exams = EXAMS.filter((e) => e.subjects.some((s) => s.topicIds.includes(id)));

  const siblings = TOPICS.filter((t) => t.subject === topic.subject);
  const i = siblings.findIndex((t) => t.id === id);
  const prev = i > 0 ? siblings[i - 1] : null;
  const next = i < siblings.length - 1 ? siblings[i + 1] : null;

  const structured = samples.length
    ? {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: `${topic.name} practice questions with solutions`,
        about: { "@type": "Thing", name: topic.name },
        educationalLevel: topic.subject,
        hasPart: samples.map((q) => ({
          "@type": "Question",
          eduQuestionType: "Multiple choice",
          text: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.options[q.answer] },
          suggestedAnswer: q.options.filter((_, k) => k !== q.answer).map((o) => ({ "@type": "Answer", text: o })),
        })),
      }
    : null;

  return (
    <div className="space-y-8">
      {structured && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />}
      <div className="space-y-5">
        <Link href="/topics" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> All topics
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">{topic.subject}</p>
            <h1 className="mt-1 text-2xl font-semibold">{topic.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/learn?topic=${encodeURIComponent(topic.name)}`} className="btn-ghost">
              <BookOpen className="h-4 w-4" /> Read on Learn
            </Link>
            {hasFormulaSheet(topic, notes) && (
              <Link href={`/formulas/${id}`} className="btn-ghost">
                <Sigma className="h-4 w-4" /> Formula sheet
              </Link>
            )}
            {count > 0 && (
              <Link href={`/practice?topics=${id}`} className="btn-primary">
                <ListChecks className="h-4 w-4" /> Practise {count} questions
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <section className="card">
            <p className="text-slate-700">{topic.summary}</p>
            <h2 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Key points</h2>
            <ul className="mt-2 space-y-2">
              {topic.keyPoints.map((k) => (
                <li key={k} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span className="min-w-0">{k}</span>
                </li>
              ))}
            </ul>
          </section>

          {notes && <TopicNotesContent notes={notes} headingLevel={2} />}

          {samples.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold text-slate-900">Solved questions</h2>
              <ol className="space-y-3">
                {samples.map((q, n) => (
                  <li key={q.id} className="card">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Q{n + 1}</span>
                      <span className="chip bg-slate-100 text-slate-600">{DIFFICULTY_LABEL[q.difficulty]}</span>
                      {q.source && <span>{q.source}</span>}
                    </div>
                    <div className="mt-2 font-medium leading-snug whitespace-pre-line text-slate-900">
                      <RichText text={q.question} />
                    </div>
                    <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                      {q.options.map((o, k) => (
                        <li key={k} className="min-w-0 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700">
                          <span className="font-semibold text-slate-500">{"ABCDEF"[k]}.</span> {o}
                        </li>
                      ))}
                    </ol>
                    <details className="group mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-brand-700 select-none hover:underline">Show answer</summary>
                      <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                        <p className="flex items-start gap-1.5 font-semibold">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>
                            Answer: {"ABCDEF"[q.answer]}. {q.options[q.answer]}
                          </span>
                        </p>
                        <div className="mt-1 whitespace-pre-line">
                          <RichText text={q.explanation} />
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
              {count > samples.length && (
                <Link href={`/practice?topics=${id}`} className="btn-primary w-full sm:w-auto">
                  Practise all {count} {topic.name} questions
                </Link>
              )}
            </section>
          )}

          {(prev || next) && (
            <nav className="grid grid-cols-2 gap-3" aria-label={`More ${topic.subject} topics`}>
              {prev ? (
                <Link href={`/topics/${prev.id}`} className="card-link p-3 text-left">
                  <span className="text-xs text-slate-500">← Previous in {topic.subject}</span>
                  <span className="mt-0.5 block text-sm font-medium text-slate-900">{prev.name}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/topics/${next.id}`} className="card-link p-3 text-right">
                  <span className="text-xs text-slate-500">
                    Next in {topic.subject} ({i + 2}/{siblings.length}) →
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-slate-900">{next.name}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        <aside className="min-w-0 space-y-5">
          {exams.length > 0 && (
            <section className="card">
              <h2 className="font-semibold text-slate-900">Asked in these exams</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {exams.map((e) => (
                  <Link key={e.id} href={`/exams/${e.id}`} className="chip bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-brand-50">
                    {e.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
          <section className="card">
            <h2 className="font-semibold text-slate-900">Practise this topic</h2>
            <p className="mt-1 text-sm text-slate-600">
              {count > 0 ? `${count} questions from easy to very hard, one at a time with instant explanations.` : "Answer questions one at a time with instant explanations."}
            </p>
            <Link href={`/practice?topics=${id}`} className="btn-primary mt-3 w-full">
              Start practice
            </Link>
            <Link href={`/learn?topic=${encodeURIComponent(topic.name)}`} className="btn-ghost mt-2 w-full">
              Read on Learn
            </Link>
            {count > 0 && <PrintPracticeSheet topicId={id} topicName={topic.name} />}
          </section>
        </aside>
      </div>
    </div>
  );
}
