import "server-only";
import { findQuestions } from "@/lib/bank";
import { buildExplainPrompt, cleanExplanation, explainable, type ExplainLang } from "@/lib/explainShared";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";
import { providers, type Provider } from "./interviewAi";
import { lockedQuestionIds } from "./locks";

/**
 * "Explain more": a short AI explanation of one bank question, shaped by the option the student
 * picked. Uses the same free model tiers as the mock-interview feedback (Groq, Gemini, OpenRouter,
 * tried in order), so the same keys switch it on. The question, options, key and our explanation
 * are read from the bank by id on the server: the client only says which question, which option
 * and which language, so the endpoint can't be used as a general chatbot.
 */

export const explainAiEnabled = () => providers().length > 0;

/** Devanagari takes about twice the tokens of English for the same answer, so Hindi gets more room. */
const maxTokens = (lang: ExplainLang) => (lang === "hi" ? 800 : 450);

async function ask(p: Provider, system: string, user: string, lang: ExplainLang): Promise<string | null> {
  const res = await fetch(p.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.key}`, ...p.headers },
    body: JSON.stringify({
      model: p.model,
      temperature: 0.3,
      max_tokens: maxTokens(lang),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    console.error(`[explain-ai] ${p.name} answered ${res.status}`);
    return null;
  }
  const data = (await res.json().catch(() => null)) as { choices?: { message?: { content?: string } }[] } | null;
  // Empty or unusable text comes back as null, which hands over to the next provider.
  return cleanExplanation(data?.choices?.[0]?.message?.content);
}

/**
 * The same question + option + language gets the same explanation, so recent answers are kept in
 * memory (per instance) and the free tiers are spent only on new ones.
 */
const cache = new Map<string, { text: string; provider: string }>();
const CACHE_MAX = 500;

export async function explainQuestion(
  user: SessionUser,
  input: { questionId: string; chosen: number | null; lang: ExplainLang },
  /** Which question ids are locked for a user; replaced in tests, which run without a database. */
  lockedFor: (userId: string) => Promise<Set<string>> = lockedQuestionIds,
) {
  if (!user.emailVerified) throw new HttpError(403, "Verify your email to get an AI explanation.", "email_unverified");
  const q = (await findQuestions([input.questionId])).get(input.questionId);
  if (!q || !explainable(q) || q.answer >= q.options.length) throw new HttpError(404, "Question not found.");
  if (input.chosen !== null && input.chosen >= q.options.length) throw new HttpError(400, "That option does not exist.");
  const list = providers();
  if (!list.length) throw new HttpError(503, "AI explanations are not switched on yet.", "explain_ai_off");

  // A paper the student is still taking, or a shared paper whose key is still hidden: no explanation
  // yet, the same rule as practice and the mistake notebook. Checked before the cache, and a failed
  // lookup is an error (never "not locked").
  if ((await lockedFor(user.id)).has(q.id)) throw new HttpError(403, "The answer opens after the paper closes.", "answers_locked");

  const key = `${q.id}:${input.chosen ?? "-"}:${input.lang}`;
  const hit = cache.get(key);
  if (hit) return { ...hit, cached: true };

  const { system, user: prompt } = buildExplainPrompt(q, input.chosen, input.lang);
  for (const p of list) {
    try {
      const text = await ask(p, system, prompt, input.lang);
      if (text) {
        if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
        const out = { text, provider: p.name };
        cache.set(key, out);
        return { ...out, cached: false };
      }
    } catch (e) {
      console.error(`[explain-ai] ${p.name} failed`, e instanceof Error ? e.message : e);
    }
  }
  throw new HttpError(503, "The AI helper is busy. Try again in a minute.", "explain_ai_busy");
}
