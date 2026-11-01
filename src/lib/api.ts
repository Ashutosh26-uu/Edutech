/**
 * Client-side API access. With a server, requests go to /api/*. In the static build
 * (NEXT_PUBLIC_STATIC=1, used for GitHub Pages) the same handlers run in the browser.
 */

export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";

type Endpoint = "video" | "practice" | "topic" | "solve";

export async function api<T = any>(endpoint: Endpoint, body: object): Promise<{ ok: boolean; json: T }> {
  if (IS_STATIC) {
    const h = await import("./handlers");
    const run = { video: (b: object) => h.handleVideo(b, { canFetchCaptions: false }), practice: h.handlePractice, topic: h.handleTopic, solve: h.handleSolve }[endpoint];
    const { status, json } = await run(body);
    return { ok: status < 400, json: json as T };
  }
  const res = await fetch(`/api/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { ok: res.ok, json: await res.json() };
}
