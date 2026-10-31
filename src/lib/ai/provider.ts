import type { MCQ, SolveResult, Topic, TopicResult, VideoBreakdown } from "../types";
import type { VideoTranscript } from "../youtube";

/**
 * Everything "AI" in the app goes through this interface. The local provider is rule-based
 * and works offline; an LLM-backed provider (e.g. Claude) can implement the same methods
 * and be switched on in `./index.ts` without touching the UI or API routes.
 */
export interface AIProvider {
  readonly name: string;
  breakdownVideo(videoId: string, transcript: VideoTranscript): Promise<VideoBreakdown>;
  practiceQuestions(opts: { topicIds: string[]; count: number }): Promise<MCQ[]>;
  explainTopic(query: string): Promise<{ result: TopicResult | null; suggestions: Topic[] }>;
  solveQuestion(question: string): Promise<SolveResult>;
}
