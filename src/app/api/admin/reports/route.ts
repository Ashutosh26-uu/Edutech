import { z } from "zod";
import { requireAdmin } from "@/server/admin";
import { json, parseBody, route } from "@/server/http";
import { listReports, setReportStatus, suspectKeys } from "@/server/quality";

/** Reported questions (grouped by question) and questions whose key looks wrong from answer statistics. */
export const GET = route(async (req) => {
  await requireAdmin(req);
  const s = req.nextUrl.searchParams.get("status");
  const status = s === "resolved" || s === "dismissed" ? s : "open";
  const [reports, suspects] = await Promise.all([listReports(status), status === "open" ? suspectKeys() : Promise.resolve([])]);
  return json({ reports, suspects });
});

const Body = z.object({ questionId: z.string().min(1).max(80), status: z.enum(["open", "resolved", "dismissed"]) });

export const PATCH = route(async (req) => {
  await requireAdmin(req);
  const { questionId, status } = await parseBody(req, Body);
  return json({ updated: await setReportStatus(questionId, status) });
});
