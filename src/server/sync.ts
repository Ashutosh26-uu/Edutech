import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { EMPTY_SYNC, mergeSync, type SyncDoc } from "@/lib/sync";
import type { SessionUser } from "./auth";

const KEY = "sync";

export async function getSync(user: SessionUser): Promise<SyncDoc> {
  const [row] = await db.select({ value: schema.userData.value }).from(schema.userData).where(and(eq(schema.userData.userId, user.id), eq(schema.userData.key, KEY)));
  return (row?.value as SyncDoc | undefined) ?? EMPTY_SYNC;
}

/** Merges the browser's copy into the account's (row-locked, so two devices syncing at once both land) and returns the result. */
export async function pushSync(user: SessionUser, incoming: SyncDoc): Promise<SyncDoc> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .select({ value: schema.userData.value })
      .from(schema.userData)
      .where(and(eq(schema.userData.userId, user.id), eq(schema.userData.key, KEY)))
      .for("update");
    const merged = mergeSync((row?.value as SyncDoc | undefined) ?? EMPTY_SYNC, incoming);
    await tx
      .insert(schema.userData)
      .values({ userId: user.id, key: KEY, value: merged })
      .onConflictDoUpdate({ target: [schema.userData.userId, schema.userData.key], set: { value: merged, updatedAt: new Date() } });
    return merged;
  });
}
