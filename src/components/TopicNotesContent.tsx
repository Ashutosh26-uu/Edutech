import { AlertTriangle, BookOpenText, Lightbulb, Sigma } from "lucide-react";
import type { TopicNotes } from "@/lib/notes";

/** Renders `inline code` in a note line as monospace; everything else as plain text. */
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

function List({ items, dot = "bg-slate-400" }: { items: string[]; dot?: string }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((p, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-700">
          <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dot}`} />
          <span className="min-w-0">
            <Line text={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Short revision notes for a topic. Pure markup with no hooks, so it renders on the server
 * (topic pages) as well as inside the client-side TopicNotesView (Learn).
 */
export function TopicNotesContent({ notes, headingLevel = 3 }: { notes: TopicNotes; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const Sub = headingLevel === 2 ? "h3" : "h4";
  return (
    <div className="card space-y-5">
      <H className="flex items-center gap-2 font-semibold text-slate-900">
        <BookOpenText className="h-4 w-4 text-brand-600" /> Short notes
      </H>
      {notes.sections.map((s) => (
        <section key={s.heading}>
          <Sub className="text-sm font-semibold text-slate-900">{s.heading}</Sub>
          <List items={s.points} />
        </section>
      ))}
      {!!notes.formulas?.length && (
        <section className="rounded-lg bg-sky-50 p-3">
          <Sub className="flex items-center gap-1.5 text-sm font-semibold text-sky-900">
            <Sigma className="h-4 w-4" /> Formulas and facts to remember
          </Sub>
          <List items={notes.formulas} dot="bg-sky-500" />
        </section>
      )}
      {!!notes.traps?.length && (
        <section className="rounded-lg bg-amber-50 p-3">
          <Sub className="flex items-center gap-1.5 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" /> Common traps
          </Sub>
          <List items={notes.traps} dot="bg-amber-500" />
        </section>
      )}
      {!!notes.examTips?.length && (
        <section className="rounded-lg bg-emerald-50 p-3">
          <Sub className="flex items-center gap-1.5 text-sm font-semibold text-emerald-900">
            <Lightbulb className="h-4 w-4" /> How exams ask it
          </Sub>
          <List items={notes.examTips} dot="bg-emerald-500" />
        </section>
      )}
    </div>
  );
}
