/**
 * Privacy-friendly visitor stats. `track(name)` sends an event name and the page path, nothing
 * else: no cookies, ids or IPs are stored, only daily counters (see POST /api/event). It is a
 * no-op on the static build and on localhost.
 */

export const EVENT_NAMES = ["page_view", "practice_start", "mock_start", "mock_submit", "video_breakdown", "signup", "purchase_click", "helpbot_open", "share_click"] as const;
export type EventName = (typeof EVENT_NAMES)[number];

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function track(name: EventName, path?: string) {
  if (process.env.NEXT_PUBLIC_STATIC === "1" || typeof window === "undefined") return;
  if (LOCAL_HOSTS.has(location.hostname) || location.hostname.endsWith(".localhost")) return;
  try {
    const body = JSON.stringify({ name, path: path ?? location.pathname });
    if (navigator.sendBeacon?.("/api/event", new Blob([body], { type: "text/plain" }))) return;
    fetch("/api/event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  } catch {
    /* stats must never break the page */
  }
}
