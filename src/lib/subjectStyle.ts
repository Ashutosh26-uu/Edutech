import { Atom, Briefcase, Calculator, Code2, Globe2, Landmark, Languages, type LucideIcon, Puzzle, Users } from "lucide-react";

/**
 * One icon and one tint per kind of subject, so long lists of subjects and exam sections are
 * easier to scan. Matching is by keyword, so it works for topic subjects ("Indian Polity") and
 * exam section names ("General Intelligence & Reasoning") alike. Tints use colours that the
 * dark theme remaps (brand, violet, sky, amber, emerald, orange).
 */
export interface SubjectStyle {
  icon: LucideIcon;
  /** Classes for a small tinted icon tile. */
  tile: string;
}

const RULES: [RegExp, SubjectStyle][] = [
  [/reason|logic|intelligence|puzzle/i, { icon: Puzzle, tile: "bg-violet-50 text-violet-700" }],
  [/program|coding|computer|cs |data structures|technical|algorithm|software/i, { icon: Code2, tile: "bg-orange-50 text-orange-600" }],
  [/management|commerce|accounting|finance|marketing|business|operations/i, { icon: Briefcase, tile: "bg-sky-50 text-sky-700" }],
  [/quant|math|numerical|aptitude|arithmetic|data interpretation|statistic/i, { icon: Calculator, tile: "bg-brand-50 text-brand-700" }],
  [/english|hindi|verbal|language|comprehension/i, { icon: Languages, tile: "bg-sky-50 text-sky-700" }],
  [/physics|chemistry|biology|science|environment/i, { icon: Atom, tile: "bg-emerald-50 text-emerald-700" }],
  [/child|pedagogy|teaching/i, { icon: Users, tile: "bg-violet-50 text-violet-700" }],
  [/polity|history|geography|culture|constitution/i, { icon: Landmark, tile: "bg-amber-50 text-amber-800" }],
];

const DEFAULT: SubjectStyle = { icon: Globe2, tile: "bg-amber-50 text-amber-800" };

export function subjectStyle(name: string): SubjectStyle {
  return RULES.find(([re]) => re.test(name))?.[1] ?? DEFAULT;
}
