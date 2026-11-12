import { EXAMS, examTopicIds } from "@/data/exams";
import { TOPICS } from "@/data/topics";
import type { Difficulty, MCQ, Topic } from "../types";
import { DIFFICULTIES, MIN_SET_SIZE, tierQuota } from "../difficulty";
import { generateQuestions, hasGenerator } from "../generators";
import { loadBank, loadTopicBank } from "../bank";
import { cosine, shuffle, termFreq, tokenize } from "../nlp";
import type { AIProvider } from "./provider";
import { analyzeVideo } from "./local-video";

/** Shuffles options while keeping the answer index pointing at the right option. */
export function shuffleOptions(q: MCQ, rand: () => number = Math.random): MCQ {
  const order = shuffle(q.options.map((_, i) => i), rand);
  return { ...q, options: order.map((i) => q.options[i]), optionsHi: q.optionsHi && order.map((i) => q.optionsHi![i]), answer: order.indexOf(q.answer) };
}

function topicText(t: Topic) {
  return [t.name, t.subject, ...t.aliases, t.summary, ...t.keyPoints].join(" ");
}

/** Ranks topics against a free-text query: alias/name hits first, then word overlap. */
function rankTopics(query: string): { topic: Topic; score: number }[] {
  const q = query.toLowerCase().trim();
  const qv = termFreq(tokenize(q));
  return TOPICS.map((topic) => {
    let score = cosine(qv, termFreq(tokenize(topicText(topic))));
    if (topic.name.toLowerCase().includes(q) || q.includes(topic.name.toLowerCase())) score += 1;
    const wholeWord = (a: string) => new RegExp(`(^|[^a-z0-9])${a.replace(/[.*+?^${}()|[\]\\%]/g, "\\$&")}($|[^a-z0-9])`).test(q);
    if (topic.aliases.some((a) => wholeWord(a) || (q.length >= 4 && a.startsWith(q)))) score += 0.8;
    return { topic, score };
  })
    .filter((x) => x.score > 0.05)
    .sort((a, b) => b.score - a.score);
}

/**
 * Builds a set of at least MIN_SET_SIZE questions that mixes all four difficulty tiers
 * (see tierQuota) and ramps from easy to very hard. Within a tier, each question's topic is
 * drawn at random in proportion to its weight (equal weights without `weights`), so topics
 * interleave rather than block and, in smart practice, weak topics come up more often.
 * Bank questions come first; Quant topics with a generator never run dry. A tier that runs
 * short borrows from the nearest tiers so the set is always full. Pass a seeded `rand` to get the
 * same set every time (the Sunday All-India Mock gives everyone one paper this way).
 */
export async function buildSet(topicIds: string[], count: number, weights: Record<string, number> = {}, rand: () => number = Math.random): Promise<MCQ[]> {
  const size = Math.max(MIN_SET_SIZE, count);
  const quota = tierQuota(size);
  const bank = await loadBank(topicIds);
  // pools[topic][tier]: shuffled bank questions, popped from the end as they are used. Your own
  // previous-year questions go last so they are drawn first, then exam favourites, then the rest.
  const pool = (id: string, d: Difficulty) => {
    const qs = shuffle(bank.filter((q) => q.topicId === id && q.difficulty === d), rand);
    return [...qs.filter((q) => !q.source), ...qs.filter((q) => q.source && !q.pyq), ...qs.filter((q) => q.pyq)];
  };
  const pools = new Map(topicIds.map((id) => [id, Object.fromEntries(DIFFICULTIES.map((d) => [d, pool(id, d)])) as Record<Difficulty, MCQ[]>]));
  const seen = new Set<string>();
  const out: MCQ[] = [];

  const draw = (tier: Difficulty): MCQ | null => {
    for (let tries = 0; tries < 4; tries++) {
      const ids = topicIds.filter((id) => pools.get(id)![tier].length > 0 || hasGenerator(id));
      if (!ids.length) return null;
      const total = ids.reduce((s, id) => s + (weights[id] ?? 1), 0);
      let r = rand() * total;
      const id = ids.find((x) => (r -= weights[x] ?? 1) <= 0) ?? ids.at(-1)!;
      const fromBank = pools.get(id)![tier].pop();
      const q = fromBank ? shuffleOptions(fromBank, rand) : generateQuestions(id, 1, rand, tier)[0];
      if (q && !seen.has(q.question)) {
        seen.add(q.question);
        return q;
      }
    }
    return null;
  };

  for (const tier of DIFFICULTIES) {
    const picked: MCQ[] = [];
    // Neighbouring tiers in order of closeness: hard → very-hard, moderate, easy.
    const order = [tier, ...DIFFICULTIES.filter((d) => d !== tier).sort((a, b) => Math.abs(DIFFICULTIES.indexOf(a) - DIFFICULTIES.indexOf(tier)) - Math.abs(DIFFICULTIES.indexOf(b) - DIFFICULTIES.indexOf(tier)))];
    for (const from of order) {
      while (picked.length < quota[tier]) {
        const q = draw(from);
        if (!q) break;
        picked.push(q);
      }
      if (picked.length >= quota[tier]) break;
    }
    out.push(...picked);
  }
  // Borrowed questions keep their own tier, so re-sort to keep the easy → very hard ramp.
  const rank = (q: MCQ) => DIFFICULTIES.indexOf(q.difficulty ?? "moderate");
  return out.map((q, i) => ({ q, i })).sort((a, b) => rank(a.q) - rank(b.q) || a.i - b.i).map(({ q }) => q);
}

export const localProvider: AIProvider = {
  name: "local",

  async breakdownVideo(videoId, transcript) {
    return { ...analyzeVideo(videoId, transcript), provider: "local" };
  },

  async practiceQuestions({ topicIds, count, weights }) {
    return buildSet(topicIds, count, weights);
  },

  async explainTopic(query) {
    const ranked = rankTopics(query);
    if (!ranked.length || ranked[0].score < 0.3) {
      return { result: null, suggestions: ranked.slice(0, 6).map((r) => r.topic) };
    }
    const topic = ranked[0].topic;
    const exams = EXAMS.filter((e) => examTopicIds(e).includes(topic.id)).map((e) => ({ id: e.id, name: e.name }));
    const questions = [...(await loadTopicBank(topic.id)), ...generateQuestions(topic.id, 4)];
    return { result: { topic, exams, questions }, suggestions: ranked.slice(1, 5).map((r) => r.topic) };
  },

  async solveQuestion(question) {
    const qv = termFreq(tokenize(question));
    const ranked = rankTopics(question);
    const relatedTopics = ranked.slice(0, 3).map((r) => r.topic);
    // Only the topics the question sounds like are searched, so the whole bank never has to download.
    const bank = await loadBank(ranked.slice(0, 8).map((r) => r.topic.id));
    const scored = bank.map((q) => ({ q, s: cosine(qv, termFreq(tokenize(`${q.question} ${q.options.join(" ")}`))) })).sort((a, b) => b.s - a.s);
    const best = scored[0];
    if (best && best.s >= 0.55) {
      return {
        matched: true,
        question: best.q,
        similar: scored.slice(1, 4).filter((x) => x.s > 0.2).map((x) => x.q),
        relatedTopics,
        message: "Found this question in the question bank.",
      };
    }
    return {
      matched: false,
      similar: scored.slice(0, 3).filter((x) => x.s > 0.15).map((x) => x.q),
      relatedTopics,
      message:
        "This question isn’t in the question bank yet. Here are related topics and similar questions to work through instead.",
    };
  },
};
