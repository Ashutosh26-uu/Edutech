import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import type { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { HttpError } from "./http";

const COOKIE = "sc_session";
const SESSION_DAYS = 30;
const DAY = 86_400_000;

// ---------- Passwords (scrypt, a memory-hard KDF built into Node) ----------

const SCRYPT = { N: 1 << 15, r: 8, p: 1, keyLen: 64, maxmem: 64 * 1024 * 1024 };

function scryptAsync(password: string, salt: Buffer, N: number, r: number, p: number, keyLen: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, keyLen, { N, r, p, maxmem: SCRYPT.maxmem }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, SCRYPT.N, SCRYPT.r, SCRYPT.p, SCRYPT.keyLen);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, N, r, p, salt, hash] = stored.split("$");
  if (alg !== "scrypt") return false;
  const expected = Buffer.from(hash, "base64");
  const key = await scryptAsync(password, Buffer.from(salt, "base64"), +N, +r, +p, expected.length);
  return timingSafeEqual(key, expected);
}

/** Used when an email isn't registered, so a login takes the same time either way. */
export const DUMMY_HASH = "scrypt$32768$8$1$c3R1ZHljbGlwLWR1bW15$" + Buffer.alloc(64).toString("base64");

// ---------- Sessions ----------

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string, res: NextResponse) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY);
  await db.insert(schema.sessions).values({ id: hashToken(token), userId, expiresAt });
  setCookie(res, token, expiresAt);
}

function setCookie(res: NextResponse, token: string, expires: Date) {
  res.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires });
}

export async function destroySession(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get(COOKIE)?.value;
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.id, hashToken(token)));
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
}

/** The logged-in user, or null. Sessions are extended when they are more than halfway to expiry. */
export async function getUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  const id = hashToken(token);
  const rows = await db
    .select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, credits: schema.users.credits, expiresAt: schema.sessions.expiresAt })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() - Date.now() < (SESSION_DAYS / 2) * DAY) {
    await db.update(schema.sessions).set({ expiresAt: new Date(Date.now() + SESSION_DAYS * DAY) }).where(eq(schema.sessions.id, id));
  }
  return { id: row.id, email: row.email, name: row.name, credits: row.credits };
}

export async function requireUser(req: NextRequest): Promise<SessionUser> {
  const user = await getUser(req);
  if (!user) throw new HttpError(401, "Please log in to continue.", "unauthenticated");
  return user;
}

/** Deletes expired sessions. Cheap; called occasionally from login. */
export async function sweepExpiredSessions() {
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));
}
