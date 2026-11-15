"use client";

import { request } from "./api";

/** JSON from an institute API route; failures come back as { error }. Never throws. */
export async function instApi<T>(path: string, method = "GET", body?: object): Promise<{ status: number; data: T | null; error?: string }> {
  try {
    const r = await request(`/api/institutes${path}`, { method, cache: "no-store", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => null);
    return r.ok ? { status: r.status, data: j as T } : { status: r.status, data: null, error: j?.error ?? "Something went wrong. Please try again." };
  } catch {
    return { status: 0, data: null, error: "You seem to be offline. Check your connection and try again." };
  }
}

export const instituteHref = (slug: string) => `/institute?slug=${slug}`;
