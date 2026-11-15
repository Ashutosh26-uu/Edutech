import "server-only";
import type { NextRequest } from "next/server";
import { requireUser, roleEmail, type SessionUser } from "./auth";
import { HttpError } from "./http";

/** Admins are the accounts listed in ADMIN_EMAILS (comma-separated, any case). */
const ADMINS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export const isAdmin = (user: SessionUser | null) => !!roleEmail(user) && ADMINS.has(roleEmail(user)!);

export async function requireAdmin(req: NextRequest): Promise<SessionUser> {
  const user = await requireUser(req);
  if (!isAdmin(user)) throw new HttpError(403, "Admins only.", "forbidden");
  return user;
}
