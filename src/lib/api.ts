/**
 * Client-side API access. With a server, requests go to /api/*. In the static build
 * (NEXT_PUBLIC_STATIC=1, used for GitHub Pages) the same handlers run in the browser.
 */

export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";

/** Shown instead of a raw "Failed to fetch" when the request never reached the server. */
export const NETWORK_ERROR = "Couldn’t reach StudyClip. Check your internet connection and try again.";
/** Shown when the server answered with something that isn't our JSON (a proxy error page, say). */
export const SERVER_ERROR = "Something went wrong on our side. Please try again in a moment.";

export class NetworkError extends Error {
  constructor() {
    super(NETWORK_ERROR);
    this.name = "NetworkError";
  }
}

const RETRY_DELAY_MS = 800;

/**
 * fetch() with a friendly error when the network fails. GET and HEAD are safe to repeat, so a
 * failed one is retried once after a short pause (patchy mobile data often recovers in that time);
 * other methods are never retried, so nothing is submitted twice.
 */
export async function request(input: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  const tries = method === "GET" || method === "HEAD" ? 2 : 1;
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(input, init);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") throw e;
      if (attempt >= tries || init?.signal?.aborted) throw new NetworkError();
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
}

/** POSTs JSON and reads JSON back. Never throws: a network failure comes back as status 0 with a friendly error. */
export async function postJson<T = any>(path: string, body: object): Promise<{ status: number; data: T & { error?: string } }> {
  try {
    const res = await request(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: res.status, data: await res.json().catch(() => (res.ok ? {} : { error: SERVER_ERROR })) };
  } catch {
    return { status: 0, data: { error: NETWORK_ERROR } as T & { error?: string } };
  }
}

type Endpoint = "video" | "practice" | "topic" | "solve";

export async function api<T = any>(endpoint: Endpoint, body: object): Promise<{ ok: boolean; json: T }> {
  if (IS_STATIC) {
    const h = await import("./handlers");
    const run = { video: (b: object) => h.handleVideo(b, { canFetchCaptions: false }), practice: h.handlePractice, topic: h.handleTopic, solve: h.handleSolve }[endpoint];
    const { status, json } = await run(body);
    return { ok: status < 400, json: json as T };
  }
  const { status, data } = await postJson<T>(`/api/${endpoint}`, body);
  return { ok: status >= 200 && status < 400, json: data };
}
