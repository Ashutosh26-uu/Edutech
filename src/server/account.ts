import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";
import type { SessionUser } from "./auth";

export interface Account {
  user: { id: string; email: string; name: string | null };
  credits: number;
  /**
   * examId -> expiry of revision-pack access, epoch ms (active only). An Exam Pass includes the
   * revision pack, so this is the later of the revision pack and the Exam Pass for that exam.
   */
  revisionPasses: Record<string, number>;
  /** examId -> expiry of the Exam Pass, epoch ms (active only): unlimited timed tests for that exam */
  examPasses: Record<string, number>;
  freeTestsUsed: string[];
}

export async function getAccount(user: SessionUser): Promise<Account> {
  const [passes, examPassRows, free, fresh] = await Promise.all([
    db
      .select({ examId: schema.revisionPasses.examId, expiresAt: schema.revisionPasses.expiresAt })
      .from(schema.revisionPasses)
      .where(and(eq(schema.revisionPasses.userId, user.id), gt(schema.revisionPasses.expiresAt, new Date()))),
    db
      .select({ examId: schema.examPasses.examId, expiresAt: schema.examPasses.expiresAt })
      .from(schema.examPasses)
      .where(and(eq(schema.examPasses.userId, user.id), gt(schema.examPasses.expiresAt, new Date()))),
    db.select({ examId: schema.freeTests.examId }).from(schema.freeTests).where(eq(schema.freeTests.userId, user.id)),
    db.select({ credits: schema.users.credits }).from(schema.users).where(eq(schema.users.id, user.id)),
  ]);
  const examPasses: Record<string, number> = Object.fromEntries(examPassRows.map((p) => [p.examId, p.expiresAt.getTime()]));
  const revisionPasses: Record<string, number> = { ...examPasses };
  for (const p of passes) revisionPasses[p.examId] = Math.max(revisionPasses[p.examId] ?? 0, p.expiresAt.getTime());
  return {
    user: { id: user.id, email: user.email, name: user.name },
    credits: fresh[0]?.credits ?? user.credits,
    revisionPasses,
    examPasses,
    freeTestsUsed: free.map((f) => f.examId),
  };
}

/**
 * Deletes the account and the personal data tied to it (the privacy page promises this).
 * Removing the users row cascades to progress, attempts, notes, batches the user runs, plays,
 * doubts and the rest. Rows that only point at the user with "set null" are cleaned here too:
 * contact messages and report notes are removed or emptied, push reminders deleted, and access
 * granted by email (editor, co-trainer, institute staff) revoked so the next owner of that
 * address doesn't inherit it. Payment records stay, without the user, as tax law requires.
 * Last, the Neon Auth login itself is deleted where the auth service allows it.
 */
export async function deleteAccount(user: SessionUser): Promise<{ loginDeleted: boolean }> {
  const email = user.email.toLowerCase();
  await db.transaction(async (tx) => {
    await tx.delete(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.userId, user.id));
    await tx.delete(schema.contactMessages).where(eq(schema.contactMessages.userId, user.id));
    await tx.update(schema.questionReports).set({ note: null }).where(eq(schema.questionReports.userId, user.id));
    if (user.emailVerified) {
      await tx.delete(schema.contentEditors).where(eq(schema.contentEditors.email, email));
      await tx.delete(schema.batchTrainers).where(eq(schema.batchTrainers.email, email));
      await tx.delete(schema.institutionStaff).where(eq(schema.institutionStaff.email, email));
    }
    await tx.delete(schema.users).where(eq(schema.users.id, user.id));
  });
  let loginDeleted = false;
  try {
    const { neonAuth } = await import("./neon-auth");
    const del = (neonAuth as unknown as { deleteUser?: (body: object) => Promise<{ error?: unknown } | undefined> }).deleteUser;
    const res = del ? await del({}) : undefined;
    loginDeleted = !!del && !res?.error;
  } catch (e) {
    console.error("[account] Neon Auth user delete failed", e);
  }
  return { loginDeleted };
}
