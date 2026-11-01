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

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
  topicId?: string;
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
  | "Other Central";

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
