import { EXAM_BY_ID } from "@/data/exams";
import { mockPlan } from "@/data/patterns";
import { buildSet } from "./ai/local";
import type { MCQ } from "./types";
import { seededRandom, weeklySeed } from "./weekly";

export interface WeeklyPaper {
  examId: string;
  week: string;
  topicIds: string[];
  questions: MCQ[];
  sections: { name: string; from: number; count: number; minutes: number }[];
  minutes: number;
  sectional: boolean;
}

/**
 * The week's shared paper for an exam. It follows the exam's pattern section by section, like a
 * full mock, but every random choice (topics, questions, difficulty fill, option order and the
 * numbers in generated Quant questions) comes from a generator seeded with the week and exam, so
 * every student gets the same questions. Generated questions get ids derived from the week, so
 * they match across students too. The paper only changes if the question bank itself changes.
 */
export async function weeklyPaper(examId: string, week: string): Promise<WeeklyPaper> {
  const exam = EXAM_BY_ID.get(examId);
  const plan = exam && mockPlan(exam);
  if (!plan) throw new Error(`No paper pattern for ${examId}`);
  const rand = seededRandom(weeklySeed(week, examId));
  const tag = week.toLowerCase().replace("-", "");
  let generated = 0;

  const questions: MCQ[] = [];
  const sections: WeeklyPaper["sections"] = [];
  const seen = new Set<string>();
  for (const s of plan.sections) {
    const qs = (await buildSet(s.topicIds, s.questions, {}, rand)).filter((q) => !seen.has(q.question));
    qs.forEach((q) => seen.add(q.question));
    if (!qs.length) continue;
    const minutes = qs.length >= s.questions ? s.minutes : Math.max(1, Math.round((s.minutes * qs.length) / s.questions));
    sections.push({ name: s.subject, from: questions.length, count: qs.length, minutes });
    // Generated ids carry a timestamp; give them stable ones (still ending in -g…, so they stay unreportable).
    questions.push(...qs.map((q) => (/-g[0-9a-z]+$/.test(q.id) ? { ...q, id: `${q.topicId}-g${tag}${(generated++).toString(36)}` } : q)));
  }
  return {
    examId,
    week,
    topicIds: [...new Set(plan.sections.flatMap((s) => s.topicIds))],
    questions,
    sections,
    minutes: sections.reduce((n, s) => n + s.minutes, 0),
    sectional: !!plan.pattern.sectional,
  };
}
