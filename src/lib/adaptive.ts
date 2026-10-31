import type { TopicStat } from "./storage";

const DAY = 86_400_000;

/**
 * How much each topic deserves practice right now. Uses a Beta(1,1) prior so a single
 * lucky or unlucky answer doesn't dominate, boosts topics never tried, and nudges topics
 * not practised for a while (spacing).
 */
export function topicWeights(topicIds: string[], stats: Record<string, TopicStat>, now = Date.now()): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of topicIds) {
    const s = stats[id];
    if (!s?.attempted) {
      out[id] = 0.7;
      continue;
    }
    const mastery = (s.correct + 1) / (s.attempted + 2);
    const staleDays = s.lastPracticed ? (now - s.lastPracticed) / DAY : 7;
    out[id] = Math.max(0.05, 1 - mastery) + Math.min(0.3, staleDays * 0.03);
  }
  return out;
}

/** Topics ordered from most to least in need of practice, with a short reason for each. */
export function focusTopics(topicIds: string[], stats: Record<string, TopicStat>, n = 3): { id: string; reason: string }[] {
  const w = topicWeights(topicIds, stats);
  return [...topicIds]
    .sort((a, b) => w[b] - w[a])
    .slice(0, n)
    .map((id) => {
      const s = stats[id];
      if (!s?.attempted) return { id, reason: "Not started yet" };
      const p = Math.round((s.correct / s.attempted) * 100);
      return { id, reason: p < 60 ? `${p}% accuracy` : "Due for revision" };
    });
}
