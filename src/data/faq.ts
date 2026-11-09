/**
 * Knowledge base for the offline help bot (src/lib/helpbot.ts).
 *
 * Each entry is one question a student might ask. `ask` holds other ways of asking it
 * (English, Hinglish, short forms, common misspellings); `keys` are the words that most
 * strongly point to it. Answers come in English (`en`) and Hinglish (`hi`). Placeholders
 * like {QUESTIONS} and {EXAMS} are filled in from the live data.
 *
 * To add a question: add an entry to the right file, then run `npm run test:helpbot`.
 */
import { GENERAL } from "./faq_general";
import { SITE } from "./faq_site";

export type FaqCategory = "chat" | "start" | "practice" | "tests" | "study" | "tools" | "account" | "payments" | "help";

export interface Faq {
  id: string;
  cat: FaqCategory;
  /** The question, as shown on a suggestion chip */
  q: string;
  /** Hinglish label for the chip */
  qh?: string;
  ask: string[];
  keys?: string[];
  en: string;
  hi: string;
  /** [English label, href, Hinglish label?] */
  links?: [string, string, string?][];
  /** Entries offered as follow-ups */
  next?: string[];
  /** When an exam is named, answer with that exam's syllabus / mock details */
  exam?: "syllabus" | "mock" | "pattern";
}

export const FAQ: Faq[] = [...SITE, ...GENERAL];
