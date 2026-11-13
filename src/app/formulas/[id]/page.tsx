import { ArrowLeft, Infinity as InfinityIcon, ListChecks } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { absoluteUrl } from "@/data/site";
import { TOPIC_BY_ID } from "@/data/topics";
import { formulaTopics, hasFormulaSheet, loadNotes, shortTricks } from "@/lib/formulas";
import { canUnlimited, UNLIMITED_HINT, unlimitedHref } from "@/lib/unlimited";

// Only topics with a sheet are built; any other id is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await formulaTopics()).map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const topic = TOPIC_BY_ID.get((await params).id);
  if (!topic) return {};
  const title = `${topic.name} formulas and short tricks`;
  const description = `Printable one-page ${topic.name} formula sheet for ${topic.subject}: key formulas, rules, short tricks and common traps.`;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/formulas/${topic.id}`) },
    openGraph: { title, description, type: "article" },
  };
}

/** Renders `inline code` in a note line as monospace. */
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-slate-100 px-1 font-mono text-[0.9em] text-slate-800">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Block({ title, items, accent = "border-slate-300" }: { title: string; items: string[]; accent?: string }) {
  if (!items.length) return null;
  return (
    <section className={`mb-4 break-inside-avoid border-l-2 pl-3 ${accent}`}>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <ul className="mt-1.5 space-y-1">
        {items.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm leading-snug text-slate-700 print:text-[9.5pt]">
            <span className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span className="min-w-0">
              <Line text={p} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Printing: A4, only the sheet (no header, footer or chat button), always light colours.
const PRINT_CSS = `@media print {
  @page { size: A4; margin: 12mm; }
  body > *:not(main) { display: none !important; }
  main { padding: 0 !important; max-width: none !important; }
  html.dark { color-scheme: light; --color-surface: #fff; --color-slate-50: #fafafa; --color-slate-100: #f4f4f5; --color-slate-200: #e4e4e7; --color-slate-300: #d4d4d8; --color-slate-400: #a1a1aa; --color-slate-500: #71717a; --color-slate-600: #52525b; --color-slate-700: #3f3f46; --color-slate-800: #27272a; --color-slate-900: #18181b; --color-brand-600: #2563eb; }
  html, body { background: #fff !important; }
}`;

export default async function FormulaSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = TOPIC_BY_ID.get(id);
  const notes = await loadNotes(id);
  if (!topic || !hasFormulaSheet(topic, notes)) notFound();

  const tricks = shortTricks(notes);
  const inTricks = new Set(tricks);

  return (
    <article className="space-y-5">
      <style>{PRINT_CSS}</style>
      <div className="space-y-4 print:hidden">
        <Link href="/formulas" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> All formula sheets
        </Link>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4 print:pb-2">
        <div className="min-w-0">
          <p className="eyebrow">{topic.subject} · Formula sheet</p>
          <h1 className="mt-1 text-2xl font-semibold print:text-xl">{topic.name}: formulas and short tricks</h1>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Link href={`/topics/${id}`} className="btn-ghost">
            <ListChecks className="h-4 w-4" /> Notes and questions
          </Link>
          {canUnlimited(id) && (
            <Link href={unlimitedHref(id)} className="btn-ghost" title={UNLIMITED_HINT}>
              <InfinityIcon className="h-4 w-4" /> Unlimited practice
            </Link>
          )}
          <PrintButton />
        </div>
      </div>

      <div className="gap-8 md:columns-2 print:columns-2 print:gap-6">
        <Block title="Formulas and facts to remember" items={notes?.formulas ?? []} accent="border-brand-600" />
        <Block title="Key points" items={topic.keyPoints} />
        {notes?.sections.map((s) => (
          <Block key={s.heading} title={s.heading} items={s.points.filter((p) => !inTricks.has(p))} />
        ))}
        <Block title="Short tricks" items={tricks} accent="border-emerald-500" />
        <Block title="Common traps" items={notes?.traps ?? []} accent="border-amber-500" />
      </div>

      <p className="border-t border-slate-200 pt-3 text-xs text-slate-500">
        StudyClip · {topic.name} formula sheet · {absoluteUrl(`/formulas/${id}`).replace(/^https?:\/\//, "")}
      </p>
    </article>
  );
}
