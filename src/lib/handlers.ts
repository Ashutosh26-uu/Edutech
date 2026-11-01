import { TOPIC_BY_ID } from "@/data/topics";
import { getProvider } from "./ai";
import type { VideoBreakdown } from "./types";
import { fetchTranscript, parsePastedTranscript, parseVideoId, type VideoTranscript } from "./youtube";

/**
 * Request handlers shared by the API routes (server deployment) and the browser
 * (static deployment on GitHub Pages, where there is no server).
 */

export interface HandlerResult {
  status: number;
  json: unknown;
}

const ok = (json: unknown): HandlerResult => ({ status: 200, json });
const fail = (status: number, error: string, extra: object = {}): HandlerResult => ({ status, json: { error, ...extra } });

// Each video is analysed once per process and then served from memory.
const videoCache = new Map<string, VideoBreakdown>();

export async function handleVideo(body: { url?: string; transcript?: string }, opts: { canFetchCaptions: boolean }): Promise<HandlerResult> {
  const videoId = parseVideoId(body.url ?? "");
  if (!videoId) return fail(400, "That doesn’t look like a YouTube link.");

  const provider = getProvider();
  const key = `${provider.name}:${videoId}`;
  const pasted = body.transcript?.trim();
  if (!pasted && videoCache.has(key)) return ok({ ...videoCache.get(key), cached: true });

  let transcript: VideoTranscript;
  if (pasted) {
    const lines = parsePastedTranscript(pasted);
    if (lines.length < 3) return fail(400, "The pasted transcript is too short to analyse.");
    const last = lines.at(-1)!;
    transcript = { title: "YouTube video", author: "", lengthSeconds: Math.ceil(last.start + last.dur), language: "en", lines };
  } else if (!opts.canFetchCaptions) {
    return fail(422, "This online version can’t fetch YouTube captions automatically. Paste the video’s transcript below and it will be analysed in your browser.", { needsTranscript: true });
  } else {
    try {
      transcript = await fetchTranscript(videoId);
    } catch (e) {
      return fail(422, (e as Error).message, { needsTranscript: true });
    }
  }

  const result = await provider.breakdownVideo(videoId, transcript);
  if (!pasted) videoCache.set(key, result);
  return ok(result);
}

export async function handlePractice(body: { topicIds?: string[]; count?: number; weights?: Record<string, number> }): Promise<HandlerResult> {
  const ids = (body.topicIds ?? []).filter((id) => TOPIC_BY_ID.has(id));
  if (!ids.length) return fail(400, "Pick at least one topic.");
  const weights = body.weights && Object.fromEntries(ids.map((id) => [id, Math.max(0, Number(body.weights![id]) || 0)]));
  const questions = await getProvider().practiceQuestions({ topicIds: ids, count: Math.min(50, Math.max(1, body.count ?? 10)), weights });
  return ok({ questions });
}

export async function handleTopic(body: { query?: string }): Promise<HandlerResult> {
  if (!body.query?.trim()) return fail(400, "Type a topic to search.");
  return ok(await getProvider().explainTopic(body.query));
}

export async function handleSolve(body: { question?: string }): Promise<HandlerResult> {
  if (!body.question?.trim()) return fail(400, "Type or paste a question.");
  return ok(await getProvider().solveQuestion(body.question));
}
