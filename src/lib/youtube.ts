import type { TranscriptLine } from "./types";

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Accepts a bare ID or any common YouTube URL form and returns the 11-char video ID. */
export function parseVideoId(input: string): string | null {
  const s = input.trim();
  if (VIDEO_ID.test(s)) return s;
  try {
    const url = new URL(s.startsWith("http") ? s : `https://${s}`);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return VIDEO_ID.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && VIDEO_ID.test(v)) return v;
      const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export interface VideoTranscript {
  title: string;
  author: string;
  lengthSeconds: number;
  language: string;
  lines: TranscriptLine[];
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string;
  name?: { simpleText?: string; runs?: { text: string }[] };
}

const PREFERRED_LANGS = ["en", "hi", "en-IN"];

function pickTrack(tracks: CaptionTrack[]): CaptionTrack {
  const score = (t: CaptionTrack) => {
    const lang = PREFERRED_LANGS.findIndex((l) => t.languageCode.startsWith(l));
    // Manual captions beat auto-generated ("asr"); preferred languages beat others.
    return (t.kind === "asr" ? 10 : 0) + (lang === -1 ? 5 : lang);
  };
  return [...tracks].sort((a, b) => score(a) - score(b))[0];
}

/** Fetches caption tracks through YouTube's player endpoint (the same one the Android app uses). */
async function fetchPlayer(videoId: string) {
  const res = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "com.google.android.youtube/20.10.38 (Linux; U; Android 14)" },
    body: JSON.stringify({
      videoId,
      context: { client: { clientName: "ANDROID", clientVersion: "20.10.38", androidSdkVersion: 34, hl: "en" } },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`YouTube player request failed (${res.status})`);
  return res.json();
}

/** Fallback: read the caption track list embedded in the public watch page. */
async function fetchWatchPage(videoId: string) {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
    headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36" },
    cache: "no-store",
  });
  const html = await res.text();
  const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;\s*(?:var\s|<\/script>)/s);
  if (!m) throw new Error("Could not read the YouTube watch page");
  return JSON.parse(m[1]);
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
const decode = (s: string) =>
  s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (e) => ENTITIES[e]).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/<[^>]+>/g, "");

/** Parses both timedtext XML formats: legacy <text start dur> (seconds) and srv3 <p t d> (milliseconds). */
export function parseTimedText(xml: string): TranscriptLine[] {
  const lines: TranscriptLine[] = [];
  for (const m of xml.matchAll(/<text start="([\d.]+)"(?: dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g)) {
    lines.push({ start: +m[1], dur: +(m[2] ?? 0), text: decode(m[3]).replace(/\s+/g, " ").trim() });
  }
  if (!lines.length) {
    for (const m of xml.matchAll(/<p t="(\d+)"(?: d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g)) {
      lines.push({ start: +m[1] / 1000, dur: +(m[2] ?? 0) / 1000, text: decode(m[3]).replace(/\s+/g, " ").trim() });
    }
  }
  return lines.filter((l) => l.text);
}

export async function fetchTranscript(videoId: string): Promise<VideoTranscript> {
  let player: any;
  let tracks: CaptionTrack[] = [];
  for (const source of [fetchPlayer, fetchWatchPage]) {
    try {
      player = await source(videoId);
      tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
      if (tracks.length) break;
    } catch {
      /* try the next source */
    }
  }
  if (!tracks.length) {
    throw new Error("No captions found for this video. Paste the transcript manually instead.");
  }
  const track = pickTrack(tracks);
  const res = await fetch(track.baseUrl.replace(/&fmt=[^&]*/, ""), { cache: "no-store" });
  const lines = parseTimedText(await res.text());
  if (!lines.length) throw new Error("YouTube returned an empty transcript. Paste the transcript manually instead.");

  const d = player?.videoDetails ?? {};
  return {
    title: d.title ?? "YouTube video",
    author: d.author ?? "",
    lengthSeconds: +(d.lengthSeconds ?? 0) || Math.ceil(lines.at(-1)!.start + lines.at(-1)!.dur),
    language: track.languageCode,
    lines,
  };
}

/**
 * Parses a transcript pasted from YouTube's "Show transcript" panel.
 * Handles "0:00 text" on one line as well as the timestamp and text on separate lines.
 */
export function parsePastedTranscript(raw: string): TranscriptLine[] {
  const ts = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/;
  const lines: TranscriptLine[] = [];
  let pending: number | null = null;
  for (const row of raw.split(/\r?\n/).map((r) => r.trim()).filter(Boolean)) {
    const m = row.match(ts);
    if (m) {
      const secs = +(m[1] ?? 0) * 3600 + +m[2] * 60 + +m[3];
      if (m[4]) lines.push({ start: secs, dur: 0, text: m[4] });
      else pending = secs;
    } else if (pending !== null) {
      lines.push({ start: pending, dur: 0, text: row });
      pending = null;
    } else if (lines.length) {
      lines.at(-1)!.text += " " + row;
    }
  }
  // No timestamps at all: spread plain text evenly at ~150 words per minute.
  if (!lines.length && raw.trim()) {
    const words = raw.trim().split(/\s+/);
    for (let i = 0; i < words.length; i += 25) {
      lines.push({ start: (i / 150) * 60, dur: 10, text: words.slice(i, i + 25).join(" ") });
    }
  }
  for (let i = 0; i < lines.length - 1; i++) lines[i].dur ||= Math.max(1, lines[i + 1].start - lines[i].start);
  if (lines.length) lines.at(-1)!.dur ||= 5;
  return lines;
}

export function formatTime(secs: number): string {
  const s = Math.floor(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}
