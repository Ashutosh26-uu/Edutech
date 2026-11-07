import { BANK_LOADERS, BANK_SIZES } from "@/data/bank";
import type { MCQ } from "./types";

/**
 * The question bank, one file per topic under data/bank, loaded on demand and cached. The site
 * only ever downloads the topics being practised, so the bank can grow to tens of thousands of
 * questions without making any page heavier to open. Works the same in the browser, in API
 * routes and in scripts.
 */

/** A bank question as stored in data/bank/<topic>.ts: an MCQ whose topic is the file it is in. */
export type BankQuestion = Omit<MCQ, "topicId" | "timestamp"> & { id: string; difficulty: NonNullable<MCQ["difficulty"]> };

export const BANK_TOPIC_IDS = Object.keys(BANK_LOADERS);

/** Questions in the bank for a topic (0 for a topic without a file), without loading anything. */
export const bankSize = (topicId: string) => BANK_SIZES[topicId] ?? 0;

export const BANK_TOTAL = Object.values(BANK_SIZES).reduce((a, b) => a + b, 0);

const cache = new Map<string, MCQ[]>();
const pending = new Map<string, Promise<MCQ[]>>();

/** One topic's questions, tagged with their topic id. Empty for a topic that has no file. */
export function loadTopicBank(topicId: string): Promise<MCQ[]> {
  const hit = cache.get(topicId);
  if (hit) return Promise.resolve(hit);
  const loader = BANK_LOADERS[topicId];
  if (!loader) return Promise.resolve([]);
  let p = pending.get(topicId);
  if (!p) {
    p = loader()
      .then((m) => {
        const qs = m.default.map((q) => ({ ...q, topicId }));
        cache.set(topicId, qs);
        return qs;
      })
      .finally(() => pending.delete(topicId));
    pending.set(topicId, p);
  }
  return p;
}

/** The questions of several topics, in topic order. */
export async function loadBank(topicIds: string[]): Promise<MCQ[]> {
  return (await Promise.all([...new Set(topicIds)].map(loadTopicBank))).flat();
}

/** Every question in the bank. Loads every chunk: fine on the server and in scripts, avoid in the browser. */
export const loadAllBank = () => loadBank(BANK_TOPIC_IDS);

/** A topic's questions if that topic has already been loaded. */
export const cachedBank = (topicId: string) => cache.get(topicId);

/** Bank ids are `<topic id>-<n>` (or `<topic id>-pyq-<n>`); the longest topic id that prefixes the question id is its topic. */
export function topicOfQuestion(questionId: string): string | undefined {
  let best: string | undefined;
  for (const id of BANK_TOPIC_IDS) {
    if (questionId.startsWith(id + "-") && (!best || id.length > best.length)) best = id;
  }
  return best;
}

/** Looks bank questions up by id, loading only the topics they belong to. Unknown ids are left out. */
export async function findQuestions(ids: Iterable<string>): Promise<Map<string, MCQ>> {
  const wanted = [...new Set(ids)];
  const topics = new Set(wanted.map(topicOfQuestion).filter((t): t is string => !!t));
  const qs = await loadBank([...topics]);
  const byId = new Map(qs.map((q) => [q.id, q]));
  return new Map(wanted.flatMap((id) => (byId.has(id) ? [[id, byId.get(id)!]] : [])));
}
