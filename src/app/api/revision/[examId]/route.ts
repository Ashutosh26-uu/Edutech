import { getUser } from "@/server/auth";
import { json, route } from "@/server/http";
import { getRevision } from "@/server/revision";

export const dynamic = "force-dynamic";

export const GET = route(async (req, { params }) => {
  const { examId } = await params;
  return json(await getRevision(await getUser(req), examId), { headers: { "Cache-Control": "private, no-store" } });
});
