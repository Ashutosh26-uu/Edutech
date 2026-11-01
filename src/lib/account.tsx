"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IS_STATIC } from "./api";
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
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string, name?: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

interface ServerAccount {
  user: AccountState["user"];
  credits: number;
  revisionPasses: Record<string, number>;
  freeTestsUsed: string[];
}

const Ctx = createContext<AccountState | null>(null);

async function post(path: string, body: object) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  const [server, setServer] = useState<ServerAccount | null>(null);
  const [config, setConfig] = useState<{ payments: AccountState["payments"]; razorpayKeyId: string | null }>({ payments: IS_STATIC ? "demo" : "off", razorpayKeyId: null });
  const [ready, setReady] = useState(IS_STATIC);

  const refresh = useCallback(async () => {
    if (IS_STATIC) return;
    const [me, cfg] = await Promise.all([fetch("/api/me", { cache: "no-store" }).then((r) => r.json()).catch(() => null), fetch("/api/config").then((r) => r.json()).catch(() => null)]);
    setServer(me);
    if (cfg) setConfig(cfg);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await post("/api/auth/login", { email, password });
    if (!r.ok) return r.data.error ?? "Could not log in.";
    setServer(r.data);
    return null;
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    const r = await post("/api/auth/signup", { email, password, name });
    if (!r.ok) return r.data.error ?? "Could not create your account.";
    setServer(r.data);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await post("/api/auth/logout", {});
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
      logout,
    };
  }, [store, server, config, ready, refresh, login, signup, logout]);

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
