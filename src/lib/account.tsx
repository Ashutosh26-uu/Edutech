"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IS_STATIC, request } from "./api";
import { authAttempt, authClient, sendVerificationCode, verifyEmailCode, type AuthError } from "./auth-client";
import { load } from "./storage";
import { useStore } from "./useStore";

/**
 * The signed-in account. On a server deployment it comes from /api/me and every credit,
 * pass and purchase is enforced by the backend. In the static (GitHub Pages) build there is
 * no backend, so the same shape is derived from browser storage in demo mode.
 */

export interface AccountState {
  mode: "server" | "local";
  ready: boolean;
  user: { id: string; email: string; name: string | null } | null;
  credits: number;
  revisionPasses: Record<string, number>;
  freeTestsUsed: string[];
  payments: "live" | "demo" | "off";
  razorpayKeyId: string | null;
  refresh: () => Promise<void>;
  /** Null on success. An `EMAIL_NOT_VERIFIED` error means the account still needs its code. */
  login: (email: string, password: string) => Promise<AuthError | null>;
  /** "verify" when the account was created and a code was emailed; null if it was signed in directly. */
  signup: (email: string, password: string, name?: string) => Promise<AuthError | "verify" | null>;
  /** Checks the emailed code and signs the user in. */
  verifyEmail: (email: string, otp: string) => Promise<AuthError | null>;
  /** Emails a new code to an account that has not verified yet. */
  resendCode: (email: string) => Promise<AuthError | null>;
  logout: () => Promise<void>;
}

interface ServerAccount {
  user: AccountState["user"];
  credits: number;
  revisionPasses: Record<string, number>;
  freeTestsUsed: string[];
}

const Ctx = createContext<AccountState | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  const [server, setServer] = useState<ServerAccount | null>(null);
  const [config, setConfig] = useState<{ payments: AccountState["payments"]; razorpayKeyId: string | null }>({ payments: IS_STATIC ? "demo" : "off", razorpayKeyId: null });
  const [ready, setReady] = useState(IS_STATIC);

  const refresh = useCallback(async () => {
    if (IS_STATIC) return;
    const [me, cfg] = await Promise.all([request("/api/me", { cache: "no-store" }).then((r) => r.json()).catch(() => null), request("/api/config").then((r) => r.json()).catch(() => null)]);
    setServer(me);
    if (cfg) setConfig(cfg);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Neon Auth owns passwords and sessions; after it answers, /api/me loads the app account.
  const login = useCallback(
    async (email: string, password: string) => {
      const err = await authAttempt(() => authClient.signIn.email({ email: email.trim().toLowerCase(), password }), "Could not log in.");
      if (!err) await refresh();
      return err;
    },
    [refresh],
  );

  // The Neon Auth branch requires email verification: sign-up creates the account, emails a
  // 6-digit code and returns no session. The session arrives once the code is verified.
  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      const clean = email.trim().toLowerCase();
      let signedIn = false;
      const err = await authAttempt(async () => {
        const res = await authClient.signUp.email({ email: clean, password, name: name?.trim() || clean.split("@")[0] });
        signedIn = !!res.data?.token;
        return res;
      }, "Could not create your account.");
      if (err) return err;
      if (!signedIn) return "verify";
      await refresh();
      return null;
    },
    [refresh],
  );

  const verifyEmail = useCallback(
    async (email: string, otp: string) => {
      const err = await verifyEmailCode(email.trim().toLowerCase(), otp.trim());
      if (!err) await refresh();
      return err;
    },
    [refresh],
  );

  const resendCode = useCallback((email: string) => sendVerificationCode(email.trim().toLowerCase()), []);

  const logout = useCallback(async () => {
    await authClient.signOut().catch(() => {});
    setServer(null);
  }, []);

  const value = useMemo<AccountState>(() => {
    if (IS_STATIC) {
      const s = store ?? load();
      return {
        mode: "local",
        ready: !!store,
        user: null,
        credits: s.credits,
        revisionPasses: Object.fromEntries(Object.entries(s.revisionPasses).filter(([, t]) => t > Date.now())),
        freeTestsUsed: Object.keys(s.freeMockUsed).filter((k) => s.freeMockUsed[k]),
        payments: "demo",
        razorpayKeyId: null,
        refresh,
        login,
        signup,
        verifyEmail,
        resendCode,
        logout,
      };
    }
    return {
      mode: "server",
      ready,
      user: server?.user ?? null,
      credits: server?.credits ?? 0,
      revisionPasses: server?.revisionPasses ?? {},
      freeTestsUsed: server?.freeTestsUsed ?? [],
      ...config,
      refresh,
      login,
      signup,
      verifyEmail,
      resendCode,
      logout,
    };
  }, [store, server, config, ready, refresh, login, signup, verifyEmail, resendCode, logout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount(): AccountState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAccount must be used inside AccountProvider");
  return v;
}

/** What starting a timed test for this exam will use. */
export function testAccessFor(a: AccountState, examId?: string): "free" | "credit" | "none" {
  if (examId && !a.freeTestsUsed.includes(examId)) return "free";
  return a.credits > 0 ? "credit" : "none";
}

export const hasPass = (a: AccountState, examId: string) => (a.revisionPasses[examId] ?? 0) > Date.now();
