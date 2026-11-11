import { level, type Store } from "./storage";
import { computeStreak, longestRun } from "./streak";

/**
 * Achievements worked out from progress already saved in this browser. Nothing extra is stored
 * except which badges have been celebrated (Store.announcedBadges), so a badge can never get out
 * of step with the numbers behind it.
 */

export interface Badge {
  id: string;
  name: string;
  detail: string;
  /** Current value and the target; earned when have >= need. */
  have: number;
  need: number;
  earned: boolean;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function computeBadges(s: Store, todayKey: string): Badge[] {
  const days = Object.values(s.counts ?? {});
  // Counts per day only started at some point; topic stats and lists may go back further.
  const questions = Math.max(sum(days.map((d) => d.questions)), sum(Object.values(s.topics ?? {}).map((t) => t.attempted)));
  const reviews = sum(days.map((d) => d.reviews));
  const mocks = Math.max(sum(days.map((d) => d.mocks)), s.mocks?.length ?? 0);
  const videos = Math.max(sum(days.map((d) => d.videos)), s.videos?.length ?? 0);
  const bestStreak = computeStreak(s.activity ?? {}, s.frozenDays ?? [], todayKey).best;
  const bestDaily = longestRun(Object.keys(s.dailyQuestions ?? {}));
  const lvl = level(s.xp ?? 0).level;
  // Topic mastery: progress is the most attempts in any topic answered at 80% or better.
  const mastery = Math.max(0, ...Object.values(s.topics ?? {}).filter((t) => t.attempted > 0 && t.correct / t.attempted >= 0.8).map((t) => t.attempted));

  const b = (id: string, name: string, detail: string, have: number, need: number): Badge => ({ id, name, detail, have: Math.min(have, need), need, earned: have >= need });
  return [
    b("first-set", "First set", "Answer your first 10 questions", questions, 10),
    b("q-100", "Century", "Answer 100 questions", questions, 100),
    b("q-1000", "Thousand club", "Answer 1,000 questions", questions, 1000),
    b("streak-7", "Week warrior", "Reach a 7-day streak", bestStreak, 7),
    b("streak-30", "Unstoppable", "Reach a 30-day streak", bestStreak, 30),
    b("mock-1", "First mock", "Finish a full mock test", mocks, 1),
    b("mock-5", "Test regular", "Finish 5 mock tests", mocks, 5),
    b("topic-master", "Topic master", "80% accuracy in a topic over 20+ questions", mastery, 20),
    b("cards-50", "Card shark", "Review 50 flashcards", reviews, 50),
    b("video-1", "Smart watcher", "Break down your first video", videos, 1),
    b("daily-7", "Daily devotee", "Answer the question of the day 7 days in a row", bestDaily, 7),
    b("level-5", "Level 5", "Reach level 5", lvl, 5),
    b("level-10", "Level 10", "Reach level 10", lvl, 10),
  ];
}
