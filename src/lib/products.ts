/**
 * What can be bought. Prices live here and are read by the server when creating a payment
 * order, so the browser can never choose its own price.
 */

export interface Product {
  id: ProductId;
  name: string;
  /** Rupees */
  price: number;
  tagline: string;
  perks: string[];
  credits?: number;
  /** Days of full-syllabus revision access for one exam */
  revisionDays?: number;
  /** Days of an Exam Pass for one exam: unlimited timed tests and the revision pack, no credits used */
  examPassDays?: number;
  needsExam?: boolean;
}

export type ProductId = "exam-pass-90d" | "tests-3" | "revision-7d";

export const PRODUCTS: Record<ProductId, Product> = {
  "exam-pass-90d": {
    id: "exam-pass-90d",
    name: "Exam Pass",
    price: 299,
    tagline: "Unlimited timed tests and the full revision pack for one exam.",
    perks: ["Unlimited full mocks, section tests and topic tests", "No credits used while the pass is active", "Full-syllabus revision pack and rapid flashcards", "90 days for one exam", "No auto-renewal: it simply ends"],
    examPassDays: 90,
    needsExam: true,
  },
  "tests-3": {
    id: "tests-3",
    name: "3 last-minute tests",
    price: 19,
    tagline: "Any exam. Full-syllabus mock or a single-topic test.",
    perks: ["3 timed tests with your exam’s negative marking", "Full syllabus or any one topic", "Score, topic-wise analysis and answer review", "Credits never expire"],
    credits: 3,
  },
  "revision-7d": {
    id: "revision-7d",
    name: "Full-syllabus revision",
    price: 19,
    tagline: "Every topic of your exam on one page, plus rapid flashcards.",
    perks: ["One-page key points for every topic", "Rapid flashcards for the whole syllabus", "Print or save as PDF", "7 days of access for one exam"],
    revisionDays: 7,
    needsExam: true,
  },
};

/** The order the paid products are shown in. */
export const PRODUCT_ORDER: ProductId[] = ["exam-pass-90d", "tests-3", "revision-7d"];

export const FREE_PERKS = ["Topic practice with explanations", "One free mock test per exam", "Video breakdown, notes and quizzes", "Flashcards, daily plan and progress"];
