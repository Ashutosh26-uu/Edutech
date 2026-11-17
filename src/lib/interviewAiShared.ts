import { INTERVIEW } from "@/data/interview";
import type { Round } from "./interviewCoach";

/** What the AI interviewer returns for one answer. */
export interface AiFeedback {
  score: number;
  strengths: string[];
  improve: string[];
  betterAnswer: string;
  /** A natural next question about what the candidate said, or null. */
  followUp: string | null;
}

const TECH = ["oop", "dsa", "dbms", "os", "cn", "prog"];

/** Which section a question comes from decides how it is judged (behavioural answers get STAR checks). */
export const roundOf = (sectionId: string): Exclude<Round, "mixed"> =>
  sectionId === "hr" ? "hr" : sectionId === "behavioural" ? "behavioural" : sectionId === "project" ? "project" : "technical";

export interface PickedQuestion {
  sectionId: string;
  index: number;
}

/** Picks `count` different questions for a round. "mixed" opens with HR, then behavioural, then technical. */
export function pickQuestions(round: Round, count: number, random: () => number = Math.random): PickedQuestion[] {
  const pool = (ids: string[]) => ids.flatMap((sectionId) => (INTERVIEW.find((s) => s.id === sectionId)?.items ?? []).map((_, index) => ({ sectionId, index })));
  const shuffle = <T,>(xs: T[]) => {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  if (round !== "mixed") return shuffle(pool(round === "technical" ? TECH : [round])).slice(0, count);
  // Like a real interview: introduce yourself first, then behaviour, then technical depth.
  const hr = shuffle(pool(["hr"]).filter((q) => q.index !== 0));
  const first = { sectionId: "hr", index: 0 };
  const beh = shuffle(pool(["behavioural"]));
  const tech = shuffle(pool([...TECH, "project"]));
  const rest = count - 1;
  const nb = Math.max(1, Math.round(rest / 3));
  const nh = Math.max(0, Math.round(rest / 4));
  return [first, ...hr.slice(0, nh), ...beh.slice(0, nb), ...tech.slice(0, Math.max(0, rest - nb - nh))].slice(0, count);
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, n: number) => (Array.isArray(v) ? v.map((x) => str(x, 200)).filter(Boolean).slice(0, n) : []);

/**
 * Reads the model's reply. Free models don't all honour "JSON only", so this takes the first {...}
 * in the text (fenced or not), checks every field and clamps it. Null when nothing usable came back.
 */
export function parseFeedback(text: string): AiFeedback | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  const score = Number(raw.score);
  if (!Number.isFinite(score)) return null;
  const followUp = str(raw.followUp, 300);
  return {
    score: Math.max(1, Math.min(10, Math.round(score))),
    strengths: list(raw.strengths, 2),
    improve: list(raw.improve, 3),
    betterAnswer: str(raw.betterAnswer, 600),
    followUp: followUp.length > 8 ? followUp : null,
  };
}
