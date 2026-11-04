import { z } from "zod";
import { requireUser } from "@/server/auth";
import { HttpError, json, route } from "@/server/http";
import { getAttempt } from "@/server/tests";

/** A submitted test with its questions, answers and per-question times, for the analysis screen. */
export const GET = route(async (req, { params }) => {
  const user = await requireUser(req);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Test not found.");
  return json(await getAttempt(user, id));
});
