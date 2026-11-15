import { BANK_LEVELS, BANK_SIZES } from "@/data/bank";
import { mockPlan } from "@/data/patterns";
import { TOPIC_BY_ID } from "@/data/topics";
import type { Exam } from "@/lib/types";

/**
 * An estimate of how much of an exam each topic makes up, built only from StudyClip's own data
 * (no past papers): each section's share of the mock pattern (or an equal share per subject when
 * the exam has no pattern), split across that section's topics in proportion to how many
 * questions the bank has for them. The level is the topic's average difficulty in the bank.
 */

export type WeightLevel = "Easy" | "Moderate" | "Hard" | "Very hard";

export interface TopicWeight {
  topicId: string;
  name: string;
  /** 0..1 of the paper */
  share: number;
  level: WeightLevel;
}

export interface WeightRow {
  /** null for the "Other topics" row */
  topicId: string | null;
  name: string;
  share: number;
  level: WeightLevel | null;
  /** How many topics an "Other" row folds together. */
  count?: number;
}

const LEVEL_NAMES: WeightLevel[] = ["Easy", "Moderate", "Hard", "Very hard"];

export function topicLevel(topicId: string): WeightLevel {
  const mix = BANK_LEVELS[topicId];
  const n = mix ? mix[0] + mix[1] + mix[2] + mix[3] : 0;
  if (!n) return "Moderate";
  const avg = (mix[0] * 0 + mix[1] * 1 + mix[2] * 2 + mix[3] * 3) / n;
  return LEVEL_NAMES[Math.min(3, Math.round(avg))];
}

export function topicWeights(exam: Exam): TopicWeight[] {
  const plan = mockPlan(exam);
  const sections = plan
    ? plan.sections.map((s) => ({ weight: s.questions, topicIds: s.topicIds }))
    : exam.subjects.filter((s) => s.topicIds.length).map((s) => ({ weight: 1, topicIds: s.topicIds }));
  const total = sections.reduce((a, s) => a + s.weight, 0);
  if (!total) return [];
  const shares = new Map<string, number>();
  for (const s of sections) {
    const ids = s.topicIds.filter((id) => TOPIC_BY_ID.has(id));
    const size = (id: string) => Math.max(1, BANK_SIZES[id] ?? 0);
    const sum = ids.reduce((a, id) => a + size(id), 0);
    for (const id of ids) shares.set(id, (shares.get(id) ?? 0) + (s.weight / total) * (size(id) / sum));
  }
  return [...shares]
    .map(([topicId, share]) => ({ topicId, name: TOPIC_BY_ID.get(topicId)!.name, share, level: topicLevel(topicId) }))
    .sort((a, b) => b.share - a.share || a.name.localeCompare(b.name));
}

/** The top topics, with the rest folded into one "Other topics" row. */
export function weightRows(exam: Exam, top = 10): WeightRow[] {
  const all = topicWeights(exam);
  if (all.length <= top + 1) return all;
  const rest = all.slice(top);
  return [...all.slice(0, top), { topicId: null, name: "Other topics", share: rest.reduce((a, r) => a + r.share, 0), level: null, count: rest.length }];
}
