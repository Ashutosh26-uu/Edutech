/** A tiny RSS 2.0 reader for public headline feeds: titles, links and dates only (no article text). */

export interface Headline {
  title: string;
  link: string;
  /** Publication time in ms, when the feed gives one. */
  date: number | null;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === "#") {
        const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/\s+/g, " ")
    .trim();
}

const tag = (block: string, name: string) => block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"))?.[1];

const hostOf = (u: URL) => u.hostname.toLowerCase().replace(/^www\./, "");

/**
 * Reads `<item>`s from an RSS feed. Keeps only https links on an allowed host (or its www.
 * form), drops duplicates and empty titles, and returns at most `max` items in feed order.
 */
export function parseRss(xml: string, allowedHosts: string[], max = 40): Headline[] {
  const out: Headline[] = [];
  const seen = new Set<string>();
  for (const m of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const block = m[1];
    const title = decodeXml(tag(block, "title") ?? "").slice(0, 300);
    let link: URL;
    try {
      link = new URL(decodeXml(tag(block, "link") ?? ""));
    } catch {
      continue;
    }
    if (!title || link.protocol !== "https:" || !allowedHosts.includes(hostOf(link)) || seen.has(link.href)) continue;
    seen.add(link.href);
    const pub = tag(block, "pubDate") ?? tag(block, "dc:date");
    const t = pub ? Date.parse(decodeXml(pub)) : NaN;
    out.push({ title, link: link.href, date: Number.isFinite(t) ? t : null });
    if (out.length >= max) break;
  }
  return out;
}
