import type { NextRequest } from "next/server";
import { z } from "zod";
import { getUser } from "@/server/auth";
import { clientIp, json, parseBody, route } from "@/server/http";
import { createReport, REPORT_REASONS } from "@/server/quality";
import { rateLimit } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

const Body = z.object({
  questionId: z.string().min(1).max(80),
  reason: z.enum(REPORT_REASONS),
  note: z.string().trim().max(1000, "Please keep the note under 1,000 characters.").optional(),
});

/** "Report this question": open to everyone, signed in or not, with a per-IP limit. */
export const POST = route(async (req: NextRequest) => {
  await rateLimit("report:" + clientIp(req), 20, 60 * 60_000);
  const { questionId, reason, note } = await parseBody(req, Body);
  const user = await getUser(req).catch(() => null);
  await createReport(user, questionId, reason, note);
  return json({ ok: true }, 201);
});
