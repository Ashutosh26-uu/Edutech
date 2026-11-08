"use client";

import { AlertTriangle, BookOpenText, Lightbulb, Sigma } from "lucide-react";
import { useEffect, useState } from "react";
import { NOTES_LOADERS } from "@/data/notes";
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

/** Short revision notes for a topic, loaded only when the topic is opened. Nothing renders for a topic without notes. */
export function TopicNotesView({ topicId }: { topicId: string }) {
  const [notes, setNotes] = useState<TopicNotes | null>(null);
  useEffect(() => {
    let on = true;
    setNotes(null);
    NOTES_LOADERS[topicId]?.().then((m) => on && setNotes(m.default));
    return () => {
      on = false;
    };
  }, [topicId]);
  if (!notes) return null;
  return (
    <div className="card space-y-5">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
        <BookOpenText className="h-4 w-4 text-brand-600" /> Short notes
      </h3>
      {notes.sections.map((s) => (
        <section key={s.heading}>
          <h4 className="text-sm font-semibold text-slate-900">{s.heading}</h4>
          <List items={s.points} />
        </section>
      ))}
      {!!notes.formulas?.length && (
        <section className="rounded-lg bg-sky-50 p-3">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-sky-900">
            <Sigma className="h-4 w-4" /> Formulas and facts to remember
          </h4>
          <List items={notes.formulas} dot="bg-sky-500" />
        </section>
      )}
      {!!notes.traps?.length && (
        <section className="rounded-lg bg-amber-50 p-3">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" /> Common traps
          </h4>
          <List items={notes.traps} dot="bg-amber-500" />
        </section>
      )}
      {!!notes.examTips?.length && (
        <section className="rounded-lg bg-emerald-50 p-3">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-emerald-900">
            <Lightbulb className="h-4 w-4" /> How exams ask it
          </h4>
          <List items={notes.examTips} dot="bg-emerald-500" />
        </section>
      )}
    </div>
  );
}
