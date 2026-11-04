import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { startTest } from "@/server/tests";

const Body = z.object({ examId: z.string().max(64), topicIds: z.array(z.string().max(64)).max(50).optional(), section: z.string().max(80).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`test-start:${user.id}`, 20, 60_000);
  const { examId, topicIds, section } = await parseBody(req, Body);
  return json(await startTest(user, examId, { topicIds, section }), 201);
});
