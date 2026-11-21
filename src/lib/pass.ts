"use client";

import { useEffect, useState } from "react";
import { useAccount } from "./account";
import { request } from "./api";

/**
 * Exam Pass on the client: one exam, unlimited timed tests and the revision pack until it expires.
 * The server decides access (see startTest); this only chooses what the screens say. The active
 * passes come from /api/me as { examId: expiry in epoch ms }.
 */

export interface PassData {
  examPasses?: Record<string, number> | null;
}

/** When the Exam Pass for this exam ends (epoch ms), or null without an active one. */
export function examPassUntil(data: PassData | null | undefined, examId: string | null | undefined, now = Date.now()): number | null {
  const until = examId ? data?.examPasses?.[examId] : undefined;
  return typeof until === "number" && until > now ? until : null;
}

export const hasExamPass = (data: PassData | null | undefined, examId: string | null | undefined, now = Date.now()) => examPassUntil(data, examId, now) !== null;

/** "12 March 2027", the way the pass expiry is shown. */
export const passDate = (until: number) => new Date(until).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const NONE: Record<string, number> = {};

/**
 * The signed-in user's active Exam Passes. `ready` is false while they are being (re)loaded, which
 * happens every time the account is refreshed (after a purchase or a test start), so a screen can
 * wait instead of showing the paywall to someone who has just bought a pass.
 */
export function useExamPasses(): PassData & { examPasses: Record<string, number>; ready: boolean } {
  const account = useAccount();
  const signedIn = account.mode === "server" && !!account.user;
  // A new object arrives with every account refresh, so it marks which refresh the passes belong to.
  const stamp = account.revisionPasses;
  const [loaded, setLoaded] = useState<{ stamp: object; examPasses: Record<string, number> } | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    request("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((me: PassData | null) => {
        if (live) setLoaded({ stamp, examPasses: me?.examPasses ?? NONE });
      });
    return () => {
      live = false;
    };
  }, [signedIn, stamp]);

  if (!signedIn) return { examPasses: NONE, ready: account.ready };
  if (loaded?.stamp !== stamp) return { examPasses: loaded?.examPasses ?? NONE, ready: false };
  return { examPasses: loaded.examPasses, ready: true };
}
