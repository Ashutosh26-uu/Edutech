import type { NextRequest } from "next/server";
import { handleVideo } from "@/lib/handlers";
import { clientIp, json, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

export const POST = route(async (req: NextRequest) => {
  await rateLimit("video:" + clientIp(req), 10, 60_000);
  // Public and unauthenticated: a small body cap keeps one request from tying up the CPU.
  const body = (await readJson(req, 300_000).catch((e) => {
    if (e instanceof Error && "status" in e && (e as { status: number }).status === 413) throw e;
    return {};
  })) as Parameters<typeof handleVideo>[0];
  const { status, json: data } = await handleVideo(body, { canFetchCaptions: true });
  return json(data, status);
});
