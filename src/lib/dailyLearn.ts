/**
 * Word and fact of the day. Kept free of storage, the DOM and the data files themselves (they
 * are passed in) so the picks can be checked from a script (scripts/test-daily-learning.mjs)
 * and the data can be loaded lazily in the browser.
 *
 * The pick walks the list in a scrambled but fixed order: day d shows item (offset + d * step)
 * mod n, with step coprime to n. So everyone sees the same item on the same India date, and no
 * item repeats until the whole list has been shown.
 */

/** FNV-1a, 32-bit: small, stable across browsers and Node. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Whole days since 1970-01-01 for a "YYYY-MM-DD" key (UTC arithmetic, so time zone never matters). */
export function dayNumber(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Index of the item to show on `date` from a list of `n`; `salt` gives each list its own order. */
export function dailyIndex(date: string, n: number, salt: string): number {
  if (n <= 1) return 0;
  const h = hash(salt);
  let step = 2 + (h % Math.max(1, n - 2));
  while (gcd(step, n) !== 1) step = step + 1 >= n ? 1 : step + 1;
  const offset = hash(`${salt}:offset`) % n;
  // Keep the product small: reduce the day number first.
  return (offset + ((dayNumber(date) % n) * step) % n) % n;
}

export function pickForDay<T>(items: readonly T[], date: string, salt: string): T {
  return items[dailyIndex(date, items.length, salt)];
}

export interface MeaningQuiz {
  options: string[];
  answer: number;
}

/**
 * A three-option "what does it mean?" question: the right meaning and two meanings of other
 * words, picked and ordered from the date so it is stable on reload.
 */
export function meaningQuiz(words: readonly { word: string; meaning: string }[], index: number, date: string): MeaningQuiz {
  const n = words.length;
  const right = words[index].meaning;
  const wrong: string[] = [];
  let k = hash(`${date}:quiz`) % n;
  for (let tries = 0; wrong.length < 2 && tries < n * 2; tries++) {
    k = (k + 1 + (hash(`${date}:${tries}`) % 7)) % n;
    const m = words[k].meaning;
    if (k !== index && m !== right && !wrong.includes(m)) wrong.push(m);
  }
  const at = hash(`${date}:pos`) % (wrong.length + 1);
  const options = [...wrong];
  options.splice(at, 0, right);
  return { options, answer: at };
}
