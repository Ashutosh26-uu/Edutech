import "server-only";
import { parseRss, type Headline } from "@/lib/rss";

/**
 * Government press-release headlines (Press Information Bureau, English, national) for editors
 * writing the daily current-affairs quiz. Titles and links only; nothing is published from here.
 */

const FEEDS = [{ source: "PIB", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3&reg=3" }];
const HOSTS = ["pib.gov.in"];
const TTL = 30 * 60_000;
const TIMEOUT = 8_000;

export interface HeadlinesResult {
  items: (Headline & { source: string })[];
  fetchedAt: number;
  error: string | null;
}

let cache: HeadlinesResult | null = null;
let inflight: Promise<HeadlinesResult> | null = null;

const hostOk = (url: string) => HOSTS.includes(new URL(url).hostname.toLowerCase().replace(/^www\./, ""));

async function fetchFeed(url: string): Promise<string> {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; StudyClip headlines)", Accept: "application/rss+xml, application/xml, text/xml" },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  if (r.url && !hostOk(r.url)) throw new Error("unexpected redirect");
  return (await r.text()).slice(0, 2_000_000);
}

async function load(): Promise<HeadlinesResult> {
  const items: HeadlinesResult["items"] = [];
  const errors: string[] = [];
  await Promise.all(
    FEEDS.map(async (f) => {
      try {
        for (const h of parseRss(await fetchFeed(f.url), HOSTS)) items.push({ ...h, source: f.source });
      } catch (e) {
        const why = e instanceof Error ? (e.name === "TimeoutError" ? "timed out" : e.message) : "failed";
        errors.push(`${f.source} (${why})`);
      }
    }),
  );
  return { items, fetchedAt: Date.now(), error: errors.length ? `Could not load ${errors.join(", ")}.` : null };
}

/**
 * Cached for 30 minutes. A failed fetch is retried after 2 minutes and keeps showing the last
 * good list (with the error) instead of an empty one.
 */
export async function getHeadlines(fresh = false): Promise<HeadlinesResult> {
  if (cache && !fresh && Date.now() - cache.fetchedAt < (cache.error ? 2 * 60_000 : TTL)) return cache;
  inflight ??= load()
    .then((r) => {
      cache = !r.items.length && cache?.items.length ? { ...cache, error: r.error ?? "The feed was empty.", fetchedAt: r.fetchedAt } : r;
      return cache;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
