import { EXAM_BY_ID } from "./exams";
import type { Exam } from "@/lib/types";

/**
 * Paper patterns for full mock tests: the sections of the real paper, how many questions and
 * minutes each gets, and the marking. Sections name a subject from the exam's syllabus list in
 * exams.ts, so the questions come from that subject's topics; a subject with no practice topics
 * yet is left out of the mock. `sectional` papers lock each section to its own timer, as the
 * real exam does. Exams without a pattern here get the generic 25-question mock.
 *
 * Patterns follow the latest notifications and prep-portal reports (SSC CGL 2026: four 15-minute
 * sections; IBPS prelims: three 20-minute sections). Confirm against the official notice.
 */

export interface PatternSection {
  subject: string;
  questions: number;
  minutes: number;
}

export interface Pattern {
  /** e.g. "Tier 1" or "Prelims" */
  paper: string;
  sections: PatternSection[];
  /** Marks for a correct answer. */
  marks: number;
  /** Fraction of a question's marks lost per wrong answer; defaults to the exam's negativeMarking. */
  negative?: number;
  /** Each section has its own timer and closes when it runs out. */
  sectional?: boolean;
}

const sec = (subject: string, questions: number, minutes: number): PatternSection => ({ subject, questions, minutes });

const SSC_TIER1 = (sectional: boolean): Pattern => ({
  paper: "Tier 1",
  sections: [sec("General Intelligence & Reasoning", 25, 15), sec("General Awareness", 25, 15), sec("Quantitative Aptitude", 25, 15), sec("English Language", 25, 15)],
  marks: 2,
  negative: 0.25,
  sectional,
});

const BANK_PRELIMS = (english: string, quant: string, reasoning: string, counts = [30, 35, 35]): Pattern => ({
  paper: "Prelims",
  sections: [sec(english, counts[0], 20), sec(quant, counts[1], 20), sec(reasoning, counts[2], 20)],
  marks: 1,
  negative: 0.25,
  sectional: true,
});

export const PATTERNS: Record<string, Pattern> = {
  // ---------------- SSC ----------------
  "ssc-cgl": SSC_TIER1(true),
  "ssc-chsl": SSC_TIER1(false),
  "ssc-cpo": {
    paper: "Paper 1",
    sections: [sec("General Intelligence & Reasoning", 50, 30), sec("General Awareness", 50, 30), sec("Quantitative Aptitude", 50, 30), sec("English Comprehension", 50, 30)],
    marks: 1,
    negative: 0.25,
  },
  "ssc-gd": {
    paper: "CBT",
    sections: [sec("General Intelligence & Reasoning", 20, 15), sec("General Awareness", 20, 15), sec("Elementary Mathematics", 20, 15), sec("English / Hindi", 20, 15)],
    marks: 2,
    negative: 0.25,
  },
  "ssc-selection-post": { ...SSC_TIER1(false), paper: "CBT" },
  "delhi-police-constable": {
    paper: "CBT",
    sections: [sec("General Awareness", 50, 45), sec("General Intelligence & Reasoning", 25, 22), sec("Numerical Ability", 15, 14), sec("Computer Knowledge", 10, 9)],
    marks: 1,
    negative: 0.25,
  },

  // ---------------- Banking and insurance ----------------
  "ibps-po": BANK_PRELIMS("English Language", "Quantitative Aptitude", "Reasoning Ability"),
  "ibps-clerk": BANK_PRELIMS("English Language", "Numerical Ability", "Reasoning Ability"),
  "sbi-po": BANK_PRELIMS("English Language", "Data Analysis & Interpretation", "Reasoning & Computer Aptitude", [40, 30, 30]),
  "sbi-clerk": BANK_PRELIMS("English Language", "Numerical Ability", "Reasoning & Computer Aptitude"),
  "rbi-assistant": BANK_PRELIMS("English Language", "Numerical Ability", "Reasoning"),
  "lic-aao": BANK_PRELIMS("English Language", "Quantitative Aptitude", "Reasoning Ability", [30, 35, 35]),
  "ibps-rrb-po": { paper: "Prelims", sections: [sec("Reasoning", 40, 23), sec("Quantitative Aptitude", 40, 22)], marks: 1, negative: 0.25 },
  "ibps-rrb-clerk": { paper: "Prelims", sections: [sec("Reasoning", 40, 23), sec("Numerical Ability", 40, 22)], marks: 1, negative: 0.25 },

  // ---------------- Railways ----------------
  "rrb-ntpc": { paper: "CBT 1", sections: [sec("Mathematics", 30, 27), sec("General Intelligence & Reasoning", 30, 27), sec("General Awareness", 40, 36)], marks: 1, negative: 1 / 3 },
  "rrb-group-d": { paper: "CBT", sections: [sec("Mathematics", 25, 23), sec("General Intelligence & Reasoning", 30, 27), sec("General Science", 25, 22), sec("General Awareness & Current Affairs", 20, 18)], marks: 1, negative: 1 / 3 },
  "rrb-alp": { paper: "CBT 1", sections: [sec("Mathematics", 20, 16), sec("General Intelligence & Reasoning", 25, 20), sec("General Science", 20, 16), sec("General Awareness", 10, 8)], marks: 1, negative: 1 / 3 },
  "rpf-constable": { paper: "CBT", sections: [sec("General Awareness", 50, 38), sec("Arithmetic", 35, 26), sec("General Intelligence & Reasoning", 35, 26)], marks: 1, negative: 1 / 3 },

  // ---------------- UPSC ----------------
  "upsc-prelims": {
    paper: "GS Paper 1",
    sections: [sec("Indian Polity", 20, 24), sec("History", 20, 24), sec("Geography", 20, 24), sec("Economy", 20, 24), sec("General Science", 20, 24)],
    marks: 2,
    negative: 1 / 3,
  },

  // ---------------- Engineering and medical entrance ----------------
  // JEE Main Paper 1: 75 questions (25 per subject; the real paper has 20 MCQs + 5 numericals per subject), 3 hours, +4/−1.
  "jee-main": {
    paper: "Paper 1 (B.E./B.Tech)",
    sections: [sec("Physics", 25, 60), sec("Chemistry", 25, 60), sec("Mathematics", 25, 60)],
    marks: 4,
    negative: 0.25,
  },
  // NEET UG: 180 questions (45 Physics, 45 Chemistry, 90 Biology), 3 hours, +4/−1.
  "neet-ug": {
    paper: "NEET UG",
    sections: [sec("Physics", 45, 45), sec("Chemistry", 45, 45), sec("Biology (Botany & Zoology)", 90, 90)],
    marks: 4,
    negative: 0.25,
  },
};

export interface MockSection extends PatternSection {
  topicIds: string[];
}

/** The exam's pattern with each section resolved to its practice topics; sections with no topics are dropped. */
export function mockPlan(exam: Exam): { pattern: Pattern; sections: MockSection[] } | null {
  const pattern = PATTERNS[exam.id];
  if (!pattern) return null;
  const sections = pattern.sections.flatMap((s) => {
    const subject = exam.subjects.find((x) => x.name === s.subject);
    return subject?.topicIds.length ? [{ ...s, topicIds: subject.topicIds }] : [];
  });
  return sections.length ? { pattern, sections } : null;
}

export const mockPlanFor = (examId: string) => {
  const exam = EXAM_BY_ID.get(examId);
  return exam ? mockPlan(exam) : null;
};

export const totalMinutes = (sections: PatternSection[]) => sections.reduce((s, x) => s + x.minutes, 0);
export const totalQuestions = (sections: PatternSection[]) => sections.reduce((s, x) => s + x.questions, 0);
