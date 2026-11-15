"use client";

import { request } from "./api";

/** JSON from a trainer-mode API route; a failed call comes back as { error }. Never throws. */
export async function batchApi<T>(path: string, init?: { method?: string; body?: object }): Promise<{ status: number; data: T | null; error?: string }> {
  try {
    const res = await request(`/api/batches${path}`, {
      method: init?.method ?? "GET",
      cache: "no-store",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) return { status: res.status, data: null, error: json?.error ?? "Something went wrong. Please try again." };
    return { status: res.status, data: json as T };
  } catch {
    return { status: 0, data: null, error: "You seem to be offline. Check your connection and try again." };
  }
}

export const joinLink = (code: string) => `${location.origin}/batches?join=${code}`;

export const fmtDate = (t: number) => new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export const fmtMinutes = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
