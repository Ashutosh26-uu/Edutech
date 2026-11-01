import type { NextRequest } from "next/server";
import { handlePractice } from "@/lib/handlers";
import { clientIp, json, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

export const POST = route(async (req: NextRequest) => {
  await rateLimit("practice:" + clientIp(req), 120, 60_000);
  const body = await req.json().catch(() => ({}));
  const { status, json: data } = await handlePractice(body);
  return json(data, status);
});
