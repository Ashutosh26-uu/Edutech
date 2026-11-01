import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

/** An error that is safe to show to the user, with the HTTP status to send. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export const json = (data: unknown, init?: number | ResponseInit) => NextResponse.json(data, typeof init === "number" ? { status: init } : init);

/** Best-effort client IP behind Vercel / proxies. */
export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

/**
 * Blocks cross-site form posts (CSRF). Session cookies are SameSite=Lax, and every state-changing
 * request must also come from this site's own origin.
 */
function assertSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return; // same-origin fetches from older browsers, server-to-server calls
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (new URL(origin).host !== host) throw new HttpError(403, "Cross-site request blocked.");
}

export async function parseBody<T extends z.ZodType>(req: NextRequest, schema: T): Promise<z.infer<T>> {
  const raw = await req.json().catch(() => {
    throw new HttpError(400, "Request body must be JSON.");
  });
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid request.");
  return parsed.data;
}

type Handler = (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>;

/**
 * Load shedding: past this many in-flight API requests, an instance answers 503 straight away
 * instead of queueing work it can't finish in time. Clients retry, and on serverless hosts the
 * platform adds instances. Tune with MAX_INFLIGHT.
 */
const MAX_INFLIGHT = Number(process.env.MAX_INFLIGHT ?? 200);
let inflight = 0;

/** Wraps a route: load shedding, CSRF check on writes, consistent JSON errors, and no stack traces leaked to clients. */
export function route(handler: Handler, opts: { csrf?: boolean } = {}): Handler {
  return async (req, ctx) => {
    if (inflight >= MAX_INFLIGHT) {
      return json({ error: "We’re busy right now. Please try again in a moment.", code: "overloaded" }, { status: 503, headers: { "Retry-After": "2" } });
    }
    inflight++;
    try {
      if (opts.csrf !== false && req.method !== "GET" && req.method !== "HEAD") assertSameOrigin(req);
      return await handler(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message, code: e.code }, e.status);
      console.error(`[api] ${req.method} ${req.nextUrl.pathname}`, e);
      return json({ error: "Something went wrong. Please try again." }, 500);
    } finally {
      inflight--;
    }
  };
}
