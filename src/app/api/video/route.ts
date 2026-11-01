import type { NextRequest } from "next/server";
import { handleVideo } from "@/lib/handlers";
import { clientIp, json, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

export const POST = route(async (req: NextRequest) => {
  await rateLimit("video:" + clientIp(req), 10, 60_000);
  const body = await req.json().catch(() => ({}));
  const { status, json: data } = await handleVideo(body, { canFetchCaptions: true });
  return json(data, status);
});
