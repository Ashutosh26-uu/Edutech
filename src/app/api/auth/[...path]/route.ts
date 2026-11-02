import type { NextRequest } from "next/server";
import { clientIp, HttpError, json } from "@/server/http";
import { neonAuth } from "@/server/neon-auth";
import { rateLimit } from "@/server/rate-limit";

const handlers = neonAuth.handler();
type Ctx = { params: Promise<{ path: string[] }> };

// Neon Auth handles sign-up, sign-in, sign-out and sessions. Writes are rate limited per IP here
// so password guessing and sign-up floods are cut off before they reach it.
export const GET = handlers.GET;
export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    await rateLimit(`auth-ip:${clientIp(req)}`, 20, 60_000);
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message, code: e.code }, e.status);
    throw e;
  }
  return handlers.POST(req, ctx);
}
