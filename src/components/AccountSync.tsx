"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "@/lib/account";
import { applySyncDoc, load, replaceSyncDoc, syncDoc, UPDATE_EVENT } from "@/lib/storage";
import { syncFingerprint, type SyncDoc } from "@/lib/sync";

const DEBOUNCE = 5_000;
/** Which account this browser's flashcards were last synced with. */
const OWNER_KEY = "studyclip:sync-owner";

/**
 * Keeps the flashcard deck and saved questions in step with the account: syncs once on sign-in,
 * then a few seconds after any change, and when the tab is hidden. Renders nothing.
 */
export function AccountSync() {
  const account = useAccount();
  const userId = account.mode === "server" && account.user ? account.user.id : null;
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) {
      last.current = null;
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let busy = false;
    let stopped = false;

    const sync = async () => {
      if (busy || stopped) return;
      const local = syncDoc(load());
      if (last.current === syncFingerprint(local)) return;
      busy = true;
      try {
        const res = await fetch("/api/sync", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(local), keepalive: true });
        if (!res.ok || stopped) return;
        const merged = (await res.json()) as SyncDoc;
        last.current = syncFingerprint(merged);
        // Changes made while the request was out survive the merge and go on the next round.
        applySyncDoc(merged);
      } catch {
        /* offline: the next change or visit tries again */
      } finally {
        busy = false;
      }
    };

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(sync, DEBOUNCE);
    };
    const onHide = () => document.visibilityState === "hidden" && sync();

    // Another account used this browser before: start from this account's copy instead of
    // merging the other person's cards into it.
    const start = async () => {
      let owner: string | null = null;
      try {
        owner = localStorage.getItem(OWNER_KEY);
      } catch {}
      if (owner && owner !== userId) {
        const res = await fetch("/api/sync", { cache: "no-store" }).catch(() => null);
        if (!res?.ok || stopped) return;
        replaceSyncDoc((await res.json()) as SyncDoc);
      }
      try {
        localStorage.setItem(OWNER_KEY, userId);
      } catch {}
      await sync();
    };

    start();
    window.addEventListener(UPDATE_EVENT, schedule);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      stopped = true;
      clearTimeout(timer);
      window.removeEventListener(UPDATE_EVENT, schedule);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [userId]);

  return null;
}
