import "server-only";
import { HttpError } from "./http";

/**
 * Fixed-window rate limiting. With UPSTASH_REDIS_REST_URL/TOKEN set, counters live in Redis and are
 * shared by every server instance. Otherwise each instance keeps its own in-memory counters, which
 * still stops bursts from a single client.
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const memory = new Map<string, { count: number; resetAt: number }>();
let lastSweep = Date.now();

function memoryHit(key: string, windowMs: number): number {
  const now = Date.now();
  if (now - lastSweep > 60_000) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    lastSweep = now;
  }
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  return ++entry.count;
}

async function redisHit(key: string, windowMs: number): Promise<number> {
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, String(windowMs), "NX"],
    ]),
    cache: "no-store",
  });
  const out = (await res.json()) as { result: number }[];
  return out[0].result;
}

/** Throws 429 once `limit` requests for `key` have been made in the current window. */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<void> {
  const bucket = `rl:${key}:${Math.floor(Date.now() / windowMs)}`;
  let count: number;
  try {
    count = UPSTASH_URL && UPSTASH_TOKEN ? await redisHit(bucket, windowMs) : memoryHit(bucket, windowMs);
  } catch {
    count = memoryHit(bucket, windowMs); // fail open to per-instance limits if Redis is unreachable
  }
  if (count > limit) throw new HttpError(429, "Too many requests. Please wait a minute and try again.", "rate_limited");
}
