import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

/**
 * AI doubt solver, backed by Claude. Off unless ANTHROPIC_API_KEY is set; every call costs money,
 * so it needs an account and each account gets DOUBT_DAILY_LIMIT questions a day (default 10).
 */

export const doubtEnabled = () => !!process.env.ANTHROPIC_API_KEY;
const model = () => process.env.CLAUDE_MODEL || "claude-opus-5-5";
const dailyLimit = () => Math.max(1, Number(process.env.DOUBT_DAILY_LIMIT) || 10);

const Answer = z.object({
  answer: z.string().describe("The final answer in one short line, e.g. '₹1,250' or 'Article 21'."),
  steps: z.array(z.string()).describe("2 to 8 short worked steps or reasoning points a student can follow."),
  concept: z.string().describe("The rule, formula or fact the question tests, in one or two sentences."),
  tip: z.string().describe("One exam tip or shortcut for questions like this; empty string if none."),
  confident: z.boolean().describe("False if the question is ambiguous, missing data, or the answer depends on facts that may have changed."),
});
export type DoubtAnswer = z.infer<typeof Answer>;

const SYSTEM = `You are StudyClip's doubt solver for Indian competitive exams (SSC, banking, railways, UPSC prelims, state PSCs, teaching exams).
A student pastes a question they are stuck on, often an MCQ with options. Solve it the way a good teacher would at the board: short, correct, exam-focused.
Reply in the language the question is written in (Hindi questions get Hindi answers in Devanagari; Hinglish gets simple English).
For maths and reasoning, show the working; prefer the fastest method an exam topper would use. For general awareness, state the fact and why it is so.
If the options are given, name the correct option. If the question is incomplete or ambiguous, say what is missing and set confident to false.
Never invent current-affairs facts: if the answer depends on recent events you cannot be sure of, say so and set confident to false.
If the message is not a study question, set answer to a one-line note that you only help with exam questions, leave steps empty and set confident to false.`;

let client: Anthropic | null = null;

/** Today's counter key, by Indian date. */
const quotaKey = () => `doubts:${new Date(Date.now() + 5.5 * 3_600_000).toISOString().slice(0, 10)}`;

/** Counts today's use and refuses past the daily limit. Returns the questions left after this one. */
async function useQuota(user: SessionUser, key: string): Promise<number> {
  const rows = await db.execute<{ n: number }>(sql`
    insert into user_data (user_id, key, value) values (${user.id}, ${key}, '{"n":1}'::jsonb)
    on conflict (user_id, key) do update set value = jsonb_build_object('n', (user_data.value->>'n')::int + 1), updated_at = now()
    returning (value->>'n')::int as n`);
  const n = Number(rows[0]?.n ?? 1);
  const limit = dailyLimit();
  if (n > limit) throw new HttpError(429, `You have used today's ${limit} AI doubts. They reset at midnight.`, "doubt_limit");
  return limit - n;
}

export async function solveDoubt(user: SessionUser, question: string): Promise<{ result: DoubtAnswer; left: number }> {
  if (!doubtEnabled()) throw new HttpError(503, "The AI doubt solver is not switched on yet.", "doubt_off");
  const key = quotaKey();
  const left = await useQuota(user, key);
  // A failed call gives the question back.
  const refund = () =>
    db.execute(sql`update user_data set value = jsonb_build_object('n', greatest(0, (value->>'n')::int - 1)) where user_id = ${user.id} and key = ${key}`).catch(() => {});
  client ??= new Anthropic({ timeout: 60_000, maxRetries: 1 });
  try {
    const response = await client.beta.messages.parse({
      model: model(),
      max_tokens: 4000,
      system: SYSTEM,
      // A request a safety classifier declines is retried on the fallback model inside the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(Answer) },
      messages: [{ role: "user", content: question }],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) {
      throw new HttpError(422, "Sorry, this question could not be answered. Try rephrasing it.", "doubt_refused");
    }
    return { result: response.parsed_output, left };
  } catch (e) {
    await refund();
    if (e instanceof HttpError) throw e;
    if (e instanceof Anthropic.RateLimitError) throw new HttpError(503, "The doubt solver is busy. Please try again in a minute.", "doubt_busy");
    if (e instanceof Anthropic.APIError) {
      console.error("[doubt] Claude API error", e.status, e.message);
      throw new HttpError(502, "The doubt solver could not answer right now. Please try again.", "doubt_error");
    }
    throw e;
  }
}
