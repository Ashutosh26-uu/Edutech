import { EXAMS, examTopicIds } from "@/data/exams";
import { QUESTION_BANK, TOPICS } from "@/data/topics";
import type { MCQ, Topic } from "../types";
import { generateQuestions, hasGenerator } from "../generators";
import { cosine, shuffle, termFreq, tokenize } from "../nlp";
import type { AIProvider } from "./provider";
import { analyzeVideo } from "./local-video";

/** Shuffles options while keeping the answer index pointing at the right option. */
function shuffleOptions(q: MCQ): MCQ {
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
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
 * Draws each question's topic at random in proportion to its weight, so weak topics come up
 * more often, and topics end up interleaved rather than blocked.
 */
function adaptivePractice(topicIds: string[], count: number, weights: Record<string, number>): MCQ[] {
  const pools = new Map(topicIds.map((id) => [id, shuffle(QUESTION_BANK.filter((q) => q.topicId === id))]));
  const live = () => topicIds.filter((id) => (pools.get(id)?.length ?? 0) > 0 || hasGenerator(id));
  const out: MCQ[] = [];
  for (let i = 0; i < count; i++) {
    const ids = live();
    if (!ids.length) break;
    const total = ids.reduce((s, id) => s + (weights[id] ?? 0.5), 0);
    let r = Math.random() * total;
    const id = ids.find((x) => (r -= weights[x] ?? 0.5) <= 0) ?? ids.at(-1)!;
    const fromBank = pools.get(id)!.pop();
    const q = fromBank ? shuffleOptions(fromBank) : generateQuestions(id, 1)[0];
    if (q && !out.some((o) => o.question === q.question)) out.push(q);
  }
  return out;
}

export const localProvider: AIProvider = {
  name: "local",

  async breakdownVideo(videoId, transcript) {
    return { ...analyzeVideo(videoId, transcript), provider: "local" };
  },

  async practiceQuestions({ topicIds, count, weights }) {
    if (weights) return adaptivePractice(topicIds, count, weights);
    const bank = shuffle(QUESTION_BANK.filter((q) => q.topicId && topicIds.includes(q.topicId))).map(shuffleOptions);
    const generatable = topicIds.filter(hasGenerator);
    // Mix bank questions with generated ones; generated Quant questions fill any shortfall.
    const generatedShare = generatable.length ? Math.ceil((count * generatable.length) / topicIds.length) : 0;
    const generated = generatable.flatMap((id) => generateQuestions(id, Math.ceil(generatedShare / generatable.length) + 2));
    const fromBank = bank.slice(0, Math.max(0, count - Math.min(generatedShare, generated.length)));
    const pool = [...fromBank, ...shuffle(generated)];
    return shuffle(pool.slice(0, count));
  },

  async explainTopic(query) {
    const ranked = rankTopics(query);
    if (!ranked.length || ranked[0].score < 0.3) {
      return { result: null, suggestions: ranked.slice(0, 6).map((r) => r.topic) };
    }
    const topic = ranked[0].topic;
    const exams = EXAMS.filter((e) => examTopicIds(e).includes(topic.id)).map((e) => ({ id: e.id, name: e.name }));
    const questions = [...QUESTION_BANK.filter((q) => q.topicId === topic.id), ...generateQuestions(topic.id, 3)];
    return { result: { topic, exams, questions }, suggestions: ranked.slice(1, 5).map((r) => r.topic) };
  },

  async solveQuestion(question) {
    const qv = termFreq(tokenize(question));
    const scored = QUESTION_BANK.map((q) => ({ q, s: cosine(qv, termFreq(tokenize(`${q.question} ${q.options.join(" ")}`))) })).sort((a, b) => b.s - a.s);
    const relatedTopics = rankTopics(question).slice(0, 3).map((r) => r.topic);
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
        "This question isn’t in the question bank yet. Step-by-step answers for any question will work once an AI model is connected. Meanwhile, here are related topics and similar questions.",
    };
  },
};
