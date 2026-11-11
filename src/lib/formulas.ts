/**
 * Which topics get a printable formula sheet (/formulas/<topic id>), built from the topic's key
 * points and its short notes. Maths-type subjects always get one; science and placement topics
 * only when their notes list formulas.
 */
import { NOTES_LOADERS } from "@/data/notes";
import { TOPICS } from "@/data/topics";
import type { TopicNotes } from "@/lib/notes";
import type { Topic } from "@/lib/types";

/** In the order the index page lists them. */
export const FORMULA_SUBJECTS = ["Quantitative Aptitude", "Reasoning", "Mathematics (JEE)", "Placement Aptitude", "Physics (JEE/NEET)", "Chemistry (JEE/NEET)"];
const ALWAYS = new Set(["Quantitative Aptitude", "Reasoning", "Mathematics (JEE)"]);
/** Placement topics that are about language, not numbers. */
const NOT_MATHS = new Set(["apt-verbal-placement"]);

export function hasFormulaSheet(topic: Topic, notes: TopicNotes | undefined): boolean {
  if (!FORMULA_SUBJECTS.includes(topic.subject) || NOT_MATHS.has(topic.id)) return false;
  return ALWAYS.has(topic.subject) || !!notes?.formulas?.length;
}

export async function loadNotes(id: string): Promise<TopicNotes | undefined> {
  return NOTES_LOADERS[id]?.().then((m) => m.default);
}

/** Every topic with a formula sheet, grouped in FORMULA_SUBJECTS order. Runs at build time. */
export async function formulaTopics(): Promise<Topic[]> {
  const candidates = TOPICS.filter((t) => FORMULA_SUBJECTS.includes(t.subject));
  const notes = await Promise.all(candidates.map((t) => loadNotes(t.id)));
  return candidates.filter((t, i) => hasFormulaSheet(t, notes[i])).sort((a, b) => FORMULA_SUBJECTS.indexOf(a.subject) - FORMULA_SUBJECTS.indexOf(b.subject));
}

// "quick marks" (easy questions) is not a trick.
const TRICK = /\b(tricks?|shortcuts?|short ?cut|quick(?:ly|est)?(?!\s+marks)|rule of thumb|mnemonic)\b/i;

/**
 * Lines of the notes that already present a trick or shortcut: whole sections headed as tricks
 * or shortcuts, plus individual lines that name one. Nothing new is written here.
 */
export function shortTricks(notes: TopicNotes | undefined): string[] {
  if (!notes) return [];
  const out: string[] = [];
  for (const s of notes.sections) {
    if (TRICK.test(s.heading)) out.push(...s.points);
    else out.push(...s.points.filter((p) => TRICK.test(p)));
  }
  out.push(...(notes.examTips ?? []).filter((p) => TRICK.test(p)));
  return [...new Set(out)];
}
