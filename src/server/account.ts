import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";
import type { SessionUser } from "./auth";

export interface Account {
  user: { id: string; email: string; name: string | null };
  credits: number;
  /** examId -> expiry, epoch ms (active passes only) */
  revisionPasses: Record<string, number>;
  freeTestsUsed: string[];
}

export async function getAccount(user: SessionUser): Promise<Account> {
  const [passes, free, fresh] = await Promise.all([
    db
      .select({ examId: schema.revisionPasses.examId, expiresAt: schema.revisionPasses.expiresAt })
      .from(schema.revisionPasses)
      .where(and(eq(schema.revisionPasses.userId, user.id), gt(schema.revisionPasses.expiresAt, new Date()))),
    db.select({ examId: schema.freeTests.examId }).from(schema.freeTests).where(eq(schema.freeTests.userId, user.id)),
    db.select({ credits: schema.users.credits }).from(schema.users).where(eq(schema.users.id, user.id)),
  ]);
  return {
    user: { id: user.id, email: user.email, name: user.name },
    credits: fresh[0]?.credits ?? user.credits,
    revisionPasses: Object.fromEntries(passes.map((p) => [p.examId, p.expiresAt.getTime()])),
    freeTestsUsed: free.map((f) => f.examId),
  };
}
