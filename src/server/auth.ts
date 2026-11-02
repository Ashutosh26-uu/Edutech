import "server-only";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db, schema } from "@/db";
import { HttpError } from "./http";
import { neonAuth } from "./neon-auth";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
}

/**
 * The logged-in user, or null. Identity comes from Neon Auth; the app's own `users` row (credits,
 * tests, payments) shares the Neon Auth user id and is created on the first authenticated request.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUser(_req: NextRequest): Promise<SessionUser | null> {
  const { data: session } = await neonAuth.getSession();
  const authUser = session?.user;
  if (!authUser) return null;

  const cols = { id: schema.users.id, email: schema.users.email, name: schema.users.name, credits: schema.users.credits };
  const [existing] = await db.select(cols).from(schema.users).where(eq(schema.users.id, authUser.id)).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(schema.users)
    .values({ id: authUser.id, email: authUser.email.toLowerCase(), name: authUser.name || null })
    .onConflictDoUpdate({ target: schema.users.id, set: { email: authUser.email.toLowerCase() } })
    .returning(cols);
  return created;
}

export async function requireUser(req: NextRequest): Promise<SessionUser> {
  const user = await getUser(req);
  if (!user) throw new HttpError(401, "Please log in to continue.", "unauthenticated");
  return user;
}
