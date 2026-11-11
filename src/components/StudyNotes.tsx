"use client";

import { Brain, StickyNote } from "lucide-react";
import { useState } from "react";
import { MISTAKE_LABEL, MISTAKE_TAGS, mistakePattern, type MistakeTag } from "@/lib/mockAnalysis";
import { saveNote, tagMistake, toggleNoteOpen, useMistakeTags, useNoteOpen, useNotes } from "@/lib/questionNotes";
import type { MCQ } from "@/lib/types";

/** Video-quiz questions have ids like "v3" that repeat across videos, so they get no notes or tags. */
const notable = (q: MCQ) => !!q.topicId;

/** "Note" chip beside ☆ Save: opens the note box for the question (see NoteBox). */
export function NoteButton({ question }: { question: MCQ }) {
  const notes = useNotes();
  const isOpen = useNoteOpen(question.id);
  if (!notes || !notable(question)) return null;
  const has = !!notes[question.id];
  return (
    <button
      type="button"
      onClick={() => toggleNoteOpen(question.id)}
      aria-expanded={isOpen}
      className={`chip ${has ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-600 hover:bg-sky-50"}`}
      title={has ? "Edit your note on this question" : "Write a note on this question"}
    >
      <StickyNote className="h-3.5 w-3.5" /> {has ? "Note ✓" : "Note"}
    </button>
  );
}

/** The note on a question: an editor when opened from the chip, else the saved note (if any). */
export function NoteBox({ question, className = "" }: { question: MCQ; className?: string }) {
  const notes = useNotes();
  const isOpen = useNoteOpen(question.id);
  const saved = notes?.[question.id]?.text ?? "";
  if (!notes || !notable(question) || (!isOpen && !saved)) return null;
  return (
    <div className={`text-sm ${className}`}>
      {isOpen ? (
        <NoteEditor id={question.id} initial={saved} />
      ) : (
        <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-sky-50 px-3 py-2 text-sky-700">
          <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="min-w-0 flex-1 whitespace-pre-wrap break-words">{saved}</p>
          <button type="button" className="shrink-0 text-xs font-medium underline" onClick={() => toggleNoteOpen(question.id, true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

function NoteEditor({ id, initial }: { id: string; initial: string }) {
  const [draft, setDraft] = useState(initial);
  return (
    <div className="space-y-1">
      <textarea
        className="input min-h-20 w-full text-sm"
        value={draft}
        maxLength={2000}
        autoFocus
        aria-label="Your note on this question"
        placeholder="Your note: a trick, a formula, why it’s tricky… Saved in this browser only."
        onChange={(e) => {
          setDraft(e.target.value);
          saveNote(id, e.target.value);
        }}
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>Saved in this browser only, not to your account.</span>
        <button type="button" className="font-medium text-brand-700" onClick={() => toggleNoteOpen(id, false)}>
          Done
        </button>
      </div>
    </div>
  );
}

/** "Why did I get this wrong?" chips under a wrong answer in the review. */
export function MistakeTagPicker({ question }: { question: MCQ }) {
  const tags = useMistakeTags();
  if (!tags || !notable(question)) return null;
  const cur = tags[question.id]?.tag;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs" role="group" aria-label="Why did you get this wrong?">
      <span className="text-slate-500">Why wrong?</span>
      {MISTAKE_TAGS.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={cur === t}
          onClick={() => tagMistake(question.id, cur === t ? null : t, question.topicId)}
          className={`rounded-full px-2 py-0.5 ring-1 ${cur === t ? "bg-ink text-on-ink ring-transparent" : "bg-surface text-slate-600 ring-slate-200 hover:bg-slate-100"}`}
        >
          {MISTAKE_LABEL[t]}
        </button>
      ))}
    </div>
  );
}

function PatternBars({ counts, total }: { counts: Record<MistakeTag, number>; total: number }) {
  return (
    <div className="space-y-1.5">
      {MISTAKE_TAGS.filter((t) => counts[t]).map((t) => (
        <div key={t} className="flex items-center gap-3 text-sm">
          <span className="w-40 shrink-0 truncate sm:w-52">{MISTAKE_LABEL[t]}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand-500" style={{ width: `${(counts[t] / total) * 100}%` }} />
          </div>
          <span className="w-8 text-right text-slate-600 tabular-nums">{counts[t]}</span>
        </div>
      ))}
    </div>
  );
}

/** Results screen: the pattern behind this test's wrong answers, from the tags in the review. */
export function MistakePatternCard({ questionIds }: { questionIds: string[] }) {
  const tags = useMistakeTags();
  if (!tags || !questionIds.length) return null;
  const p = mistakePattern(questionIds.flatMap((id) => (tags[id] ? [tags[id].tag] : [])));
  return (
    <div className="card">
      <h4 className="mb-1 flex items-center gap-2 font-semibold">
        <Brain className="h-4 w-4 text-brand-600" /> Your mistake pattern
      </h4>
      {p.total ? (
        <>
          <p className="mb-3 text-xs text-slate-500">
            {p.total} of {questionIds.length} wrong answers tagged
          </p>
          <PatternBars counts={p.counts} total={p.total} />
          <p className="mt-3 text-sm text-slate-700">{p.line}</p>
        </>
      ) : (
        <p className="text-sm text-slate-600">Tag each wrong answer below with why it went wrong (silly mistake, concept, time…) to see your pattern and a tip.</p>
      )}
    </div>
  );
}

/** /progress: every tagged mistake in this browser, with a tip for the biggest category. */
export function MistakePatternSummary() {
  const tags = useMistakeTags();
  if (!tags) return null;
  const all = Object.values(tags);
  const p = mistakePattern(all.map((t) => t.tag));
  if (!p.total) return null;
  return (
    <section className="card">
      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
        <Brain className="h-4 w-4 text-brand-600" /> Your mistake pattern
      </h2>
      <p className="mb-3 text-xs text-slate-500">{p.total} tagged mistakes in this browser</p>
      <PatternBars counts={p.counts} total={p.total} />
      <p className="mt-3 text-sm text-slate-700">{p.line}</p>
    </section>
  );
}
