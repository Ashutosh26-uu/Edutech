import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { getAccount } from "@/server/account";
import { createSession, hashPassword } from "@/server/auth";
import { clientIp, HttpError, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({
  email: z.email("Enter a valid email address.").max(254).transform((e) => e.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  name: z.string().trim().max(80).optional(),
});

export const POST = route(async (req) => {
  await rateLimit(`signup:${clientIp(req)}`, 10, 60_000);
  const { email, password, name } = await parseBody(req, Body);
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(schema.users)
    .values({ email, passwordHash, name: name || null })
    .onConflictDoNothing({ target: schema.users.email })
    .returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name, credits: schema.users.credits });
  if (!user) throw new HttpError(409, "An account with this email already exists. Log in instead.", "email_taken");
  const res = NextResponse.json(await getAccount(user), { status: 201 });
  await createSession(user.id, res);
  return res;
});
