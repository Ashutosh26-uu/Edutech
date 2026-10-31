import type { Exam } from "@/lib/types";

const GS_POLITY = ["polity-preamble", "polity-fundamental-rights", "polity-dpsp-duties", "polity-parliament"];
const GS_HISTORY = ["history-national-movement", "history-mughal"];
const GS_GEO = ["geo-indian-rivers", "geo-solar-system"];
const SCIENCE = ["sci-physics", "sci-biology", "sci-chemistry"];
const QUANT = ["quant-percentage", "quant-profit-loss", "quant-simple-interest", "quant-time-work", "quant-average"];
const REASONING = ["reason-series", "reason-coding", "reason-blood-relations"];
const ENGLISH = ["eng-vocabulary", "eng-grammar"];

/** negativeMarking is the fraction of one question's marks deducted for a wrong answer. */
export const EXAMS: Exam[] = [
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    fullName: "Staff Selection Commission – Combined Graduate Level",
    conductedBy: "Staff Selection Commission",
    negativeMarking: 0.25,
    subjects: [
      { name: "General Intelligence & Reasoning", topicIds: REASONING },
      { name: "General Awareness", topicIds: [...GS_POLITY, ...GS_HISTORY, ...GS_GEO, "eco-basics", ...SCIENCE] },
      { name: "Quantitative Aptitude", topicIds: QUANT },
      { name: "English Comprehension", topicIds: ENGLISH },
    ],
  },
  {
    id: "ibps-po",
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection – Probationary Officer",
    conductedBy: "IBPS",
    negativeMarking: 0.25,
    subjects: [
      { name: "Reasoning Ability", topicIds: REASONING },
      { name: "Quantitative Aptitude", topicIds: QUANT },
      { name: "English Language", topicIds: ENGLISH },
      { name: "General, Economy & Banking Awareness", topicIds: ["bank-awareness", "eco-basics", "comp-awareness"] },
    ],
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board – Non-Technical Popular Categories",
    conductedBy: "Railway Recruitment Boards",
    negativeMarking: 1 / 3,
    subjects: [
      { name: "Mathematics", topicIds: QUANT },
      { name: "General Intelligence & Reasoning", topicIds: REASONING },
      { name: "General Awareness", topicIds: [...GS_POLITY, ...GS_HISTORY, ...GS_GEO, ...SCIENCE, "eco-basics", "comp-awareness"] },
    ],
  },
  {
    id: "upsc-prelims",
    name: "UPSC Prelims",
    fullName: "UPSC Civil Services Preliminary Examination",
    conductedBy: "Union Public Service Commission",
    negativeMarking: 1 / 3,
    subjects: [
      { name: "Indian Polity", topicIds: GS_POLITY },
      { name: "History", topicIds: GS_HISTORY },
      { name: "Geography", topicIds: GS_GEO },
      { name: "Economy", topicIds: ["eco-basics"] },
      { name: "General Science", topicIds: SCIENCE },
      { name: "CSAT", topicIds: ["quant-percentage", "quant-average", ...REASONING] },
    ],
  },
  {
    id: "ctet",
    name: "CTET",
    fullName: "Central Teacher Eligibility Test",
    conductedBy: "CBSE",
    negativeMarking: 0,
    subjects: [
      { name: "Child Development & Pedagogy", topicIds: ["cdp-child-development"] },
      { name: "Mathematics", topicIds: ["quant-percentage", "quant-average", "quant-profit-loss"] },
      { name: "Environmental Studies", topicIds: ["sci-biology", "geo-solar-system", "geo-indian-rivers"] },
      { name: "Language (English)", topicIds: ENGLISH },
    ],
  },
];

export const EXAM_BY_ID = new Map(EXAMS.map((e) => [e.id, e]));

export function examTopicIds(exam: Exam): string[] {
  return [...new Set(exam.subjects.flatMap((s) => s.topicIds))];
}
