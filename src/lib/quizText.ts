/**
 * Plain-text format for pasting many quiz questions at once (editors write in Word or WhatsApp,
 * not JSON). Questions are separated by a blank line:
 *
 *   Q: Which bank launched ...?
 *   A) SBI
 *   B) HDFC Bank
 *   C) ICICI Bank
 *   D) Axis Bank
 *   Answer: B
 *   Explanation: ...
 *
 * "Q:" and the numbering ("1." / "Q1.") are optional; options may use "A)", "A.", "(A)" or "a)".
 */

export interface DraftQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const OPTION = /^\(?([a-dA-D])[).:\]]\s*(.+)$/;
const ANSWER = /^(?:ans(?:wer)?|correct(?: answer)?)\s*[:\-–]\s*\(?([a-dA-D])\)?/i;
const EXPLAIN = /^(?:explanation|exp|solution|reason)\s*[:\-–]\s*(.*)$/i;

export function parseQuizText(text: string): { questions: DraftQuestion[]; errors: string[] } {
  const blocks = text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const questions: DraftQuestion[] = [];
  const errors: string[] = [];
  blocks.forEach((block, n) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const q: DraftQuestion = { question: "", options: ["", "", "", ""], answer: -1, explanation: "" };
    const stem: string[] = [];
    let inExplanation = false;
    for (const line of lines) {
      const opt = OPTION.exec(line);
      const ans = ANSWER.exec(line);
      const exp = EXPLAIN.exec(line);
      const optionsDone = q.options.every(Boolean);
      if (ans) q.answer = "abcd".indexOf(ans[1].toLowerCase());
      // "Reason:" or "Solution:" before the options is part of the question (assertion–reason).
      else if (exp && (optionsDone || q.answer >= 0)) {
        q.explanation = exp[1];
        inExplanation = true;
      } else if (inExplanation) q.explanation += ` ${line}`;
      else if (opt && q.options.some((o) => !o)) q.options["abcd".indexOf(opt[1].toLowerCase())] = opt[2].trim();
      // Only the first line's numbering ("Q3." / "3.") is dropped: later numbered lines are
      // statements ("1. …", "2. …") that options like "Both 1 and 2" refer to.
      else stem.push(stem.length ? line : line.replace(/^(?:q(?:uestion)?\s*\d*\s*[:.)]|\d+\s*[.)])\s*/i, ""));
    }
    q.question = stem.join("\n").trim();
    const label = `Question ${n + 1}${q.question ? ` (“${q.question.slice(0, 40)}${q.question.length > 40 ? "…" : ""}”)` : ""}`;
    if (!q.question) errors.push(`${label}: no question text.`);
    else if (q.options.some((o) => !o)) errors.push(`${label}: needs options A to D.`);
    else if (q.answer < 0) errors.push(`${label}: add a line like "Answer: B".`);
    else questions.push(q);
  });
  return { questions, errors };
}
