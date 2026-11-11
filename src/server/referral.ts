import "server-only";
import { randomBytes } from "node:crypto";
import { and, count, eq, isNull, isNotNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

/** Rewarded invites per inviter. Past this, invites still count but no longer earn credits. */
export const INVITE_CAP = 20;
/** Only accounts this young can claim an invite, so an old account cannot pick an inviter later. */
const CLAIM_WINDOW_MS = 7 * 24 * 60 * 60_000;
/** The new user's first test must have this many answered questions to unlock the reward. */
export const MIN_ANSWERED = 5;

// 31 characters with no 0/O, 1/I/L: easy to read out, and 31^8 ≈ 8.5e11 codes.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CODE_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/;

function newCode(): string {
  const bytes = randomBytes(8);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

/** The inbox an address delivers to: no "+tag", and no dots for Gmail. */
export function mailbox(email: string): string {
  const [local = "", domain = ""] = email.toLowerCase().split("@");
  let name = local.split("+")[0];
  const d = domain === "googlemail.com" ? "gmail.com" : domain;
  if (d === "gmail.com") name = name.replace(/\./g, "");
  return `${name}@${d}`;
}

/** The user's invite code, created on first use. */
async function codeFor(userId: string): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const [row] = await db.select({ code: schema.users.referralCode }).from(schema.users).where(eq(schema.users.id, userId));
    if (row?.code) return row.code;
    // The unique constraint rejects a clash with another user's code; try a fresh one.
    await db
      .update(schema.users)
      .set({ referralCode: newCode() })
      .where(and(eq(schema.users.id, userId), isNull(schema.users.referralCode)))
      .catch((e) => {
        if ((e as { code?: string })?.code !== "23505" && (e as { cause?: { code?: string } })?.cause?.code !== "23505") throw e;
      });
  }
  throw new HttpError(500, "Could not create your invite code. Please try again.");
}

export async function getInvites(user: SessionUser) {
  const code = await codeFor(user.id);
  const [stats] = await db
    .select({
      joined: count(),
      rewarded: sql<number>`count(*) filter (where ${schema.referrals.rewardedAt} is not null)`.mapWith(Number),
      credited: sql<number>`count(*) filter (where ${schema.referrals.inviterCredited})`.mapWith(Number),
    })
    .from(schema.referrals)
    .where(eq(schema.referrals.inviterId, user.id));
  const [mine] = await db.select({ rewardedAt: schema.referrals.rewardedAt }).from(schema.referrals).where(eq(schema.referrals.newUserId, user.id));
  return {
    code,
    joined: stats?.joined ?? 0,
    rewarded: stats?.rewarded ?? 0,
    credited: stats?.credited ?? 0,
    cap: INVITE_CAP,
    /** Whether this account itself joined through an invite, and if its bonus is still pending. */
    invitedBy: mine ? (mine.rewardedAt ? "rewarded" : "pending") : null,
  };
}

/**
 * Records that `user` signed up with an invite code. Only a new account (created within the last
 * week, no submitted tests yet) can claim, never with its own code, and only once (primary key).
 */
export async function claimInvite(user: SessionUser, code: string): Promise<"claimed" | "already" | "invalid" | "too-late"> {
  const [inviter] = await db.select({ id: schema.users.id, email: schema.users.email }).from(schema.users).where(eq(schema.users.referralCode, code));
  if (!inviter || inviter.id === user.id) return "invalid";
  // One inbox, one invite: a+1@gmail.com and a.b@gmail.com are the same person as a@ / ab@.
  const mine = mailbox(user.email);
  if (mailbox(inviter.email) === mine) return "invalid";
  const friends = await db
    .select({ id: schema.users.id, email: schema.users.email })
    .from(schema.referrals)
    .innerJoin(schema.users, eq(schema.users.id, schema.referrals.newUserId))
    .where(eq(schema.referrals.inviterId, inviter.id));
  if (friends.some((f) => f.id !== user.id && mailbox(f.email) === mine)) return "invalid";
  const [me] = await db.select({ createdAt: schema.users.createdAt }).from(schema.users).where(eq(schema.users.id, user.id));
  if (!me || Date.now() - me.createdAt.getTime() > CLAIM_WINDOW_MS) return "too-late";
  const [tested] = await db
    .select({ id: schema.testAttempts.id })
    .from(schema.testAttempts)
    .where(and(eq(schema.testAttempts.userId, user.id), isNotNull(schema.testAttempts.submittedAt)))
    .limit(1);
  if (tested) return "too-late";
  const rows = await db.insert(schema.referrals).values({ newUserId: user.id, inviterId: inviter.id }).onConflictDoNothing().returning({ id: schema.referrals.newUserId });
  return rows.length ? "claimed" : "already";
}

/**
 * Pays out an invite once the new user has verified their email and submitted a timed test with
 * at least MIN_ANSWERED answers: +1 credit each. Claiming the reward is a conditional UPDATE, so
 * it happens exactly once however many submits race; the inviter's row is locked while the cap
 * is checked, so two friends finishing at once cannot push the inviter past INVITE_CAP.
 */
export async function rewardInvite(user: SessionUser, answered: number): Promise<boolean> {
  if (!user.emailVerified || answered < MIN_ANSWERED) return false;
  return db.transaction(async (tx) => {
    const [ref] = await tx
      .update(schema.referrals)
      .set({ rewardedAt: new Date() })
      .where(and(eq(schema.referrals.newUserId, user.id), isNull(schema.referrals.rewardedAt)))
      .returning({ inviterId: schema.referrals.inviterId });
    if (!ref) return false;
    await tx.update(schema.users).set({ credits: sql`${schema.users.credits} + 1` }).where(eq(schema.users.id, user.id));
    await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, ref.inviterId)).for("update");
    const [{ n }] = await tx
      .select({ n: count() })
      .from(schema.referrals)
      .where(and(eq(schema.referrals.inviterId, ref.inviterId), eq(schema.referrals.inviterCredited, true)));
    if (n < INVITE_CAP) {
      await tx.update(schema.users).set({ credits: sql`${schema.users.credits} + 1` }).where(eq(schema.users.id, ref.inviterId));
      await tx.update(schema.referrals).set({ inviterCredited: true }).where(eq(schema.referrals.newUserId, user.id));
    }
    return true;
  });
}
