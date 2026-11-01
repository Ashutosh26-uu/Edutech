import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { getAccount } from "@/server/account";
import { createSession, DUMMY_HASH, sweepExpiredSessions, verifyPassword } from "@/server/auth";
import { clientIp, HttpError, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({
  email: z.string().max(254).transform((e) => e.toLowerCase().trim()),
  password: z.string().max(128),
});

export const POST = route(async (req) => {
  const ip = clientIp(req);
  await rateLimit(`login-ip:${ip}`, 20, 60_000);
  const { email, password } = await parseBody(req, Body);
  await rateLimit(`login-email:${email}`, 8, 10 * 60_000); // slows password guessing against one account

  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  // Always run the hash so response time doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, "Incorrect email or password.", "bad_credentials");

  const res = NextResponse.json(await getAccount(user));
  await createSession(user.id, res);
  if (Math.random() < 0.02) sweepExpiredSessions().catch(() => {});
  return res;
});
