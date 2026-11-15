import { z } from "zod";
import { deleteQuiz, editorQuizzes, requireEditor, upsertQuiz } from "@/server/content";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.");
const Body = z.object({
  day: Day,
  title: z.string().trim().min(3, "Give the quiz a title.").max(120),
  published: z.boolean(),
  questions: z
    .array(z.object({ question: z.string().max(1000), options: z.array(z.string().max(300)).length(4), answer: z.number().int(), explanation: z.string().max(2000).optional() }))
    .min(3)
    .max(25),
});

export const GET = route(async (req) => {
  await requireEditor(req);
  return json({ quizzes: await editorQuizzes() }, { headers: { "Cache-Control": "no-store" } });
});

export const POST = route(async (req) => {
  const user = await requireEditor(req);
  await rateLimit(`content:${user.id}`, 120, 60 * 60_000);
  return json(await upsertQuiz(user, await parseBody(req, Body)));
});

export const DELETE = route(async (req) => {
  await requireEditor(req);
  const day = req.nextUrl.searchParams.get("day") ?? "";
  if (!Day.safeParse(day).success) throw new HttpError(400, "Pick a date.");
  await deleteQuiz(day);
  return json({ ok: true });
});
