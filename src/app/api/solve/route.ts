import type { NextRequest } from "next/server";
import { handleSolve } from "@/lib/handlers";
import { clientIp, json, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

export const POST = route(async (req: NextRequest) => {
  await rateLimit("solve:" + clientIp(req), 120, 60_000);
  // Public and unauthenticated: a small body cap keeps one request from tying up the CPU.
  const body = (await readJson(req, 20_000).catch((e) => {
    if (e instanceof Error && "status" in e && (e as { status: number }).status === 413) throw e;
    return {};
  })) as Parameters<typeof handleSolve>[0];
  const { status, json: data } = await handleSolve(body);
  return json(data, status);
});
