import { requireUser } from "@/server/auth";
import { json, route } from "@/server/http";
import { listAttempts } from "@/server/tests";

/** The user's test history, newest first. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json({ attempts: await listAttempts(user) });
});
