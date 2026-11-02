import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";

/**
 * Neon Auth (Managed Better Auth). Users, passwords and sessions live in the `neon_auth` schema
 * of the same Neon branch; the browser talks to it through the /api/auth/* proxy route.
 */
export const neonAuth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});
