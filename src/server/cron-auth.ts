import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Checks `Authorization: Bearer <secret>` for cron-only routes. "unset" when no secret is
 * configured (the route should then answer 404). Both sides are hashed first so the comparison
 * is constant-time and does not leak the secret's length.
 */
export function checkBearer(header: string | null, secret: string | undefined): "unset" | "ok" | "bad" {
  if (!secret) return "unset";
  const m = /^Bearer\s+(.+)$/i.exec(header?.trim() ?? "");
  if (!m) return "bad";
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(m[1].trim()), digest(secret)) ? "ok" : "bad";
}
