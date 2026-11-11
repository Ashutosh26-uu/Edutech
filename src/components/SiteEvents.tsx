"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "@/lib/account";
import { track } from "@/lib/track";

/** Where the login page keeps an invite code until the new account is signed in. */
export const PENDING_REF_KEY = "studyclip:ref";
export const REF_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/;

export function rememberRef(code: string | null) {
  const clean = code?.trim().toUpperCase() ?? "";
  if (!REF_RE.test(clean)) return;
  try {
    localStorage.setItem(PENDING_REF_KEY, clean);
  } catch {
    /* storage blocked: the invite is lost, nothing else breaks */
  }
}

/**
 * Counts a page view on every route change, and sends a pending invite code once the browser is
 * signed in (the server only accepts it from a new account). Renders nothing.
 */
export function SiteEvents() {
  const path = usePathname();
  const account = useAccount();
  const userId = account.mode === "server" && account.user ? account.user.id : null;

  useEffect(() => {
    if (path) track("page_view", path);
  }, [path]);

  useEffect(() => {
    if (!userId) return;
    let code: string | null = null;
    try {
      code = localStorage.getItem(PENDING_REF_KEY);
    } catch {}
    if (!code) return;
    fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) })
      .then((res) => {
        // Keep the code only when the request never reached the server.
        try {
          if (res.status < 500 && res.status !== 429) localStorage.removeItem(PENDING_REF_KEY);
        } catch {}
      })
      .catch(() => {});
  }, [userId]);

  return null;
}
