import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";
import type { VideoBreakdown } from "@/lib/types";
import { fetchTranscript, parsePastedTranscript, parseVideoId, type VideoTranscript } from "@/lib/youtube";

// Each video is analysed once per server process and then served from memory.
const cache = new Map<string, VideoBreakdown>();

export async function POST(req: Request) {
  const { url, transcript: pasted } = (await req.json().catch(() => ({}))) as { url?: string; transcript?: string };
  const videoId = parseVideoId(url ?? "");
  if (!videoId) return NextResponse.json({ error: "That doesn’t look like a YouTube link." }, { status: 400 });

  const provider = getProvider();
  const key = `${provider.name}:${videoId}`;
  if (!pasted && cache.has(key)) return NextResponse.json({ ...cache.get(key), cached: true });

  let transcript: VideoTranscript;
  try {
    if (pasted?.trim()) {
      const lines = parsePastedTranscript(pasted);
      if (lines.length < 3) return NextResponse.json({ error: "The pasted transcript is too short to analyse." }, { status: 400 });
      const last = lines.at(-1)!;
      transcript = { title: "YouTube video", author: "", lengthSeconds: Math.ceil(last.start + last.dur), language: "en", lines };
    } else {
      transcript = await fetchTranscript(videoId);
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message, needsTranscript: true }, { status: 422 });
  }

  const result = await provider.breakdownVideo(videoId, transcript);
  if (!pasted) cache.set(key, result);
  return NextResponse.json(result);
}
