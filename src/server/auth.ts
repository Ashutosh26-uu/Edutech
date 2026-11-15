import "server-only";
import { and, eq, ne, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db, schema } from "@/db";
import { HttpError } from "./http";
import { neonAuth } from "./neon-auth";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  /** From Neon Auth: whether the account confirmed its email with the emailed code. */
  emailVerified: boolean;
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
  const email = authUser.email.toLowerCase();
  const emailVerified = !!authUser.emailVerified;
  const [existing] = await db.select(cols).from(schema.users).where(eq(schema.users.id, authUser.id)).limit(1);
  if (existing) {
    // An email changed in Neon Auth is copied here, so email-based roles follow the account.
    if (existing.email !== email) {
      await releaseEmail(email, authUser.id);
      await db.update(schema.users).set({ email }).where(eq(schema.users.id, authUser.id));
      return { ...existing, email, emailVerified };
    }
    return { ...existing, emailVerified };
  }
  // A Neon Auth account that was deleted and signed up again gets a new id; the old row would
  // otherwise hold the unique email and fail every request for this person.
  await releaseEmail(email, authUser.id);
  const [created] = await db
    .insert(schema.users)
    .values({ id: authUser.id, email, name: authUser.name || null })
    .onConflictDoUpdate({ target: schema.users.id, set: { email } })
    .returning(cols);
  return { ...created, emailVerified };
}

/** Frees an email held by another (orphaned) users row, keeping that row's history under a placeholder address. */
async function releaseEmail(email: string, ownerId: string) {
  await db
    .update(schema.users)
    .set({ email: sql`'replaced+' || ${schema.users.id}::text || '@invalid.local'` })
    .where(and(eq(schema.users.email, email), ne(schema.users.id, ownerId)));
}

/**
 * The email that may carry roles (trainer, staff, editor, admin): only once the account proved it
 * owns the address, so nobody can claim a colleague's not-yet-registered email.
 */
export const roleEmail = (user: SessionUser | null) => (user && user.emailVerified ? user.email.toLowerCase() : null);

export async function requireUser(req: NextRequest): Promise<SessionUser> {
  const user = await getUser(req);
  if (!user) throw new HttpError(401, "Please log in to continue.", "unauthenticated");
  return user;
}
