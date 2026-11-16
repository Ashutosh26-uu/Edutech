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

/**
 * Best-effort client IP for rate limits. Set IP_HEADER to the one header your host sets and a
 * client can't (Netlify: x-nf-client-connection-ip, Cloudflare: cf-connecting-ip, most proxies:
 * x-real-ip); only that header is then read. Without it, the platform headers come first.
 */
export function clientIp(req: NextRequest): string {
  const only = process.env.IP_HEADER?.trim().toLowerCase();
  if (only) return req.headers.get(only)?.split(",")[0].trim() || "local";
  // Headers the platform sets itself come first: a client can put anything in X-Forwarded-For.
  return req.headers.get("x-nf-client-connection-ip") || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

/**
 * Blocks cross-site form posts (CSRF). Session cookies are SameSite=Lax, and every state-changing
 * request must also come from this site's own origin.
 */
function assertSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) {
    // No Origin: older browsers' same-origin requests and server-to-server calls. A browser that
    // says the request came from another site is still blocked.
    const site = req.headers.get("sec-fetch-site");
    if (site && site !== "same-origin" && site !== "none") throw new HttpError(403, "Cross-site request blocked.");
    return;
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let from: string;
  try {
    from = new URL(origin).host;
  } catch {
    throw new HttpError(403, "Cross-site request blocked."); // "Origin: null" (sandboxed frames, file://)
  }
  if (from !== host) throw new HttpError(403, "Cross-site request blocked.");
}

/** Default cap on a JSON body; the biggest legitimate ones (institute question sets) are well under it. */
const MAX_JSON_BYTES = 1_000_000;

/** Reads a JSON body without trusting Content-Length: anything over `maxBytes` is refused before parsing. */
export async function readJson(req: NextRequest, maxBytes = MAX_JSON_BYTES): Promise<unknown> {
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) throw new HttpError(413, "Request too large.");
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "Request too large.");
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "Request body must be JSON.");
  }
}

export async function parseBody<T extends z.ZodType>(req: NextRequest, schema: T, maxBytes = MAX_JSON_BYTES): Promise<z.infer<T>> {
  const raw = await readJson(req, maxBytes);
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
