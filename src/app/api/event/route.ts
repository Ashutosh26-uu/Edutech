import type { NextRequest } from "next/server";
import { z } from "zod";
import { cleanPath, countEvent } from "@/server/events";
import { clientIp, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { EVENT_NAMES } from "@/lib/track";

export const dynamic = "force-dynamic";

const Body = z.object({ name: z.enum(EVENT_NAMES), path: z.string().max(300) });

/**
 * Visitor stats: adds one to today's counter for the event and page. The IP is used only for the
 * in-memory rate limit and is never stored; nothing identifies the visitor.
 */
export const POST = route(async (req: NextRequest) => {
  await rateLimit("event:" + clientIp(req), 120, 60_000);
  const { name, path } = await parseBody(req, Body);
  const clean = cleanPath(path);
  if (clean) await countEvent(name, clean);
  return new Response(null, { status: 204 });
});
