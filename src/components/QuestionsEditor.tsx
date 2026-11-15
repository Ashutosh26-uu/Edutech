"use client";

import { ClipboardPaste, Plus, X } from "lucide-react";
import { useState } from "react";
import { parseQuizText, type DraftQuestion } from "@/lib/quizText";

export const blankQuestion = (): DraftQuestion => ({ question: "", options: ["", "", "", ""], answer: -1, explanation: "" });

/** Questions with four options and one marked answer: typed one by one or pasted as plain text. */
export function QuestionsEditor({ value, onChange }: { value: DraftQuestion[]; onChange: (qs: DraftQuestion[]) => void }) {
  const [paste, setPaste] = useState<string | null>(null);
  const [pasteErrors, setPasteErrors] = useState<string[]>([]);
  const set = (i: number, patch: Partial<DraftQuestion>) => onChange(value.map((q, k) => (k === i ? { ...q, ...patch } : q)));

  function importText() {
    const { questions, errors } = parseQuizText(paste ?? "");
    setPasteErrors(errors);
    if (questions.length) {
      onChange([...value.filter((q) => q.question.trim()), ...questions]);
      if (!errors.length) setPaste(null);
    }
  }

  return (
    <div className="space-y-3">
      {paste === null ? (
        <button type="button" className="btn-ghost" onClick={() => setPaste("")}>
          <ClipboardPaste className="h-4 w-4" /> Paste many questions as text
        </button>
      ) : (
        <div className="card space-y-2">
          <p className="text-sm text-slate-600">
            Separate questions with a blank line. Each one: the question, four options <code>A)</code> to <code>D)</code>, a line <code>Answer: B</code>, and optionally <code>Explanation: …</code>
          </p>
          <textarea className="input min-h-48 font-mono text-sm" value={paste} onChange={(e) => setPaste(e.target.value)} placeholder={"Q: A train covers 120 km in 2 hours. Its speed?\nA) 50 km/h\nB) 60 km/h\nC) 70 km/h\nD) 80 km/h\nAnswer: B\nExplanation: 120 ÷ 2 = 60."} />
          {pasteErrors.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-red-700">
              {pasteErrors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <button type="button" className="btn-primary" onClick={importText} disabled={!paste?.trim()}>
              Add these questions
            </button>
            <button type="button" className="btn-quiet" onClick={() => (setPaste(null), setPasteErrors([]))}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <ol className="space-y-3">
        {value.map((q, i) => (
          <li key={i} className="card space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-700">Question {i + 1}</span>
              <button type="button" className="btn-quiet px-2 text-slate-400 hover:text-red-600" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label={`Remove question ${i + 1}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea className="input min-h-16" value={q.question} onChange={(e) => set(i, { question: e.target.value })} placeholder="Question" aria-label={`Question ${i + 1}`} />
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((o, k) => (
                <label key={k} className={`flex items-center gap-2 rounded-lg border px-2 ${q.answer === k ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}>
                  <input type="radio" name={`ans-${i}`} checked={q.answer === k} onChange={() => set(i, { answer: k })} aria-label={`Option ${"ABCD"[k]} is correct`} />
                  <span className="text-xs font-semibold text-slate-500">{"ABCD"[k]}</span>
                  <input className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" value={o} onChange={(e) => set(i, { options: q.options.map((x, m) => (m === k ? e.target.value : x)) })} placeholder={`Option ${"ABCD"[k]}`} />
                </label>
              ))}
            </div>
            <input className="input text-sm" value={q.explanation} onChange={(e) => set(i, { explanation: e.target.value })} placeholder="Explanation (one or two lines, recommended)" />
          </li>
        ))}
      </ol>
      <button type="button" className="btn-ghost" onClick={() => onChange([...value, blankQuestion()])}>
        <Plus className="h-4 w-4" /> Add a question
      </button>
    </div>
  );
}
