/**
 * Typing-test scoring in the style of SSC skill tests: words are compared one by one against the
 * passage (an aligned comparison, so one skipped word does not turn every later word into a
 * mistake). Pure functions, checked by `npm run test:skills`.
 */

export type TokenKind = "ok" | "half" | "wrong" | "missing" | "extra";

export interface DiffToken {
  kind: TokenKind;
  /** The passage word (absent for an extra typed word). */
  expected?: string;
  /** What was typed (absent for a missing word). */
  typed?: string;
}

export interface TypingScore {
  minutes: number;
  /** Characters typed, spaces included. */
  keystrokes: number;
  typedWords: number;
  correctWords: number;
  /** Wrong, missing and extra words. */
  fullMistakes: number;
  /** Words right except for capital letters or punctuation (SSC counts these as half). */
  halfMistakes: number;
  /** (keystrokes ÷ 5) per minute. */
  grossWpm: number;
  /** Gross speed less the mistakes per minute (a half mistake counts as half). */
  netWpm: number;
  /** Correct words as a share of the words compared, 0–100. */
  accuracy: number;
  diff: DiffToken[];
}

export const splitWords = (text: string) => text.normalize("NFC").trim().split(/\s+/).filter(Boolean);

/** Lower case, punctuation removed: two words that match here but not exactly are a half mistake. */
const loose = (w: string) => w.toLocaleLowerCase().replace(/[\p{P}\p{S}]/gu, "");

/**
 * Aligns typed words with the passage. Only the part of the passage the student reached is
 * compared: passage words after the last typed word are not counted as missing.
 */
export function diffWords(passage: string, typedText: string): DiffToken[] {
  const typed = splitWords(typedText);
  if (!typed.length) return [];
  // Compare against a window a little longer than what was typed, so skipped words can be found.
  const exp = splitWords(passage).slice(0, typed.length + 20);
  const n = exp.length;
  const m = typed.length;
  const same = (i: number, j: number) => exp[i] === typed[j] || (loose(exp[i]) !== "" && loose(exp[i]) === loose(typed[j]));
  // LCS table from the end, so the walk below goes forwards.
  const L: Uint16Array[] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) L[i][j] = same(i, j) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);

  const out: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (j < m) {
    if (i < n && same(i, j) && L[i][j] === L[i + 1][j + 1] + 1) {
      out.push({ kind: exp[i] === typed[j] ? "ok" : "half", expected: exp[i], typed: typed[j] });
      i++;
      j++;
    } else if (i < n && L[i + 1][j + 1] === L[i][j]) {
      // Skipping both words loses nothing: a wrongly typed word.
      out.push({ kind: "wrong", expected: exp[i], typed: typed[j] });
      i++;
      j++;
    } else if (i < n && L[i + 1][j] >= L[i][j + 1]) {
      out.push({ kind: "missing", expected: exp[i] });
      i++;
    } else {
      out.push({ kind: "extra", typed: typed[j] });
      j++;
    }
  }
  return out;
}

export function scoreTyping(passage: string, typedText: string, seconds: number): TypingScore {
  const minutes = Math.max(seconds, 1) / 60;
  const diff = diffWords(passage, typedText);
  const count = (k: TokenKind) => diff.filter((t) => t.kind === k).length;
  const correctWords = count("ok");
  const halfMistakes = count("half");
  const fullMistakes = count("wrong") + count("missing") + count("extra");
  const keystrokes = typedText.normalize("NFC").trim().replace(/\s+/g, " ").length;
  const grossWpm = keystrokes / 5 / minutes;
  const netWpm = Math.max(0, grossWpm - (fullMistakes + halfMistakes / 2) / minutes);
  const compared = correctWords + halfMistakes + fullMistakes;
  return {
    minutes,
    keystrokes,
    typedWords: splitWords(typedText).length,
    correctWords,
    fullMistakes,
    halfMistakes,
    grossWpm: round1(grossWpm),
    netWpm: round1(netWpm),
    accuracy: compared ? round1(((correctWords + halfMistakes / 2) / compared) * 100) : 0,
    diff,
  };
}

/** Live speed while typing: gross words per minute. */
export function liveWpm(typedText: string, seconds: number): number {
  return seconds >= 1 ? Math.round(typedText.trim().length / 5 / (seconds / 60)) : 0;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
