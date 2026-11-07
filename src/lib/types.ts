export interface TranscriptLine {
  start: number; // seconds
  dur: number; // seconds
  text: string;
}

export type Importance = "High" | "Medium" | "Low";

export interface Chapter {
  start: number;
  end: number;
  title: string;
  summary: string;
  keywords: string[];
  importance: Importance;
}

/** Four tiers; every practice set mixes all of them. */
export type Difficulty = "easy" | "moderate" | "hard" | "very-hard";

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
  /** Hindi version of the question, shown when the learner picks Hindi. Options that are numbers need no translation. */
  questionHi?: string;
  /** Hindi options, when the options are words; same order as `options`. */
  optionsHi?: string[];
  explanationHi?: string;
  topicId?: string;
  /** Set on exam-practice questions; video quizzes have none. */
  difficulty?: Difficulty;
  /** Exams whose previous-year papers keep testing this point, e.g. "SSC CGL · UPSC Prelims";
   * for an actual previous-year question (`pyq`), the paper it came from, e.g. "UPSC Prelims 2021". */
  source?: string;
  /** An actual previous-year question (data/bank, with `source` naming the paper). */
  pyq?: boolean;
  /** For video quizzes: where in the video the answer comes from. */
  timestamp?: number;
}

export interface VideoNotes {
  oneLine: string;
  keyPoints: { text: string; timestamp: number }[];
  facts: { text: string; timestamp: number }[];
  keywords: string[];
}

export interface VideoBreakdown {
  videoId: string;
  title: string;
  author: string;
  lengthSeconds: number;
  language: string;
  chapters: Chapter[];
  notes: VideoNotes;
  quiz: MCQ[];
  transcript: TranscriptLine[];
  provider: string;
}

export type ExamCategory =
  | "SSC"
  | "Banking"
  | "Insurance"
  | "Railways"
  | "UPSC"
  | "Defence"
  | "State PSC"
  | "Police"
  | "Teaching"
  | "Engineering & Medical"
  | "Law & Management"
  | "University & Research"
  | "Other Central"
  | "State Subordinate"
  | "Design & Architecture"
  | "Commerce & Professional"
  | "Campus Placement";

export interface Exam {
  id: string;
  name: string;
  fullName: string;
  conductedBy: string;
  category: ExamCategory;
  level: "National" | "State";
  /** Fraction of a question's marks deducted per wrong answer; null when it varies or should be checked in the notification. */
  negativeMarking: number | null;
  website?: string;
  /** Shown on the home page and in the footer */
  featured?: boolean;
  /** Subjects with no topicIds have no practice questions yet */
  subjects: { name: string; topicIds: string[] }[];
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
  aliases: string[];
  summary: string;
  keyPoints: string[];
}

export interface TopicResult {
  topic: Topic;
  exams: { id: string; name: string }[];
  questions: MCQ[];
}

export interface SolveResult {
  matched: boolean;
  question?: MCQ;
  similar: MCQ[];
  relatedTopics: Topic[];
  message: string;
}
