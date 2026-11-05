import { z } from "zod";
import { requireUser } from "@/server/auth";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { getSync, pushSync } from "@/server/sync";
import { MAX_BOOKMARKS, MAX_CARDS } from "@/lib/sync";

const MAX_BYTES = 4_000_000;
const id = z.string().min(1).max(300);

const Card = z.looseObject({
  id,
  front: z.string().max(5000),
  back: z.string().max(10000),
  source: z.string().max(300),
  created: z.number(),
  due: z.number(),
  stability: z.number(),
  difficulty: z.number(),
  reps: z.number(),
  lapses: z.number(),
  lastReview: z.number().optional(),
});

const Question = z.looseObject({
  id,
  question: z.string().max(5000),
  options: z.array(z.string().max(1000)).min(2).max(6),
  answer: z.number().int().min(0).max(5),
  explanation: z.string().max(5000),
});

const Body = z.object({
  cards: z.record(id, Card).refine((m) => Object.keys(m).length <= MAX_CARDS, "Too many flashcards."),
  bookmarks: z.record(id, z.object({ id, question: Question, savedAt: z.number() })).refine((m) => Object.keys(m).length <= MAX_BOOKMARKS, "Too many saved questions."),
  deleted: z.record(z.string().max(320), z.number()).refine((m) => Object.keys(m).length <= MAX_CARDS + MAX_BOOKMARKS, "Too many deletions."),
});

/** The account's flashcards and saved questions. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json(await getSync(user));
});

/** Sends this browser's copy; the reply is the merged copy to keep. */
export const PUT = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`sync:${user.id}`, 30, 60_000);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) throw new HttpError(413, "Too much to sync at once.");
  const doc = await parseBody(req, Body);
  return json(await pushSync(user, doc as never));
});
