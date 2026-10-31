import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";
import { TOPIC_BY_ID } from "@/data/topics";

export async function POST(req: Request) {
  const { topicIds, count, weights } = (await req.json().catch(() => ({}))) as { topicIds?: string[]; count?: number; weights?: Record<string, number> };
  const ids = (topicIds ?? []).filter((id) => TOPIC_BY_ID.has(id));
  if (!ids.length) return NextResponse.json({ error: "Pick at least one topic." }, { status: 400 });
  const cleanWeights = weights && Object.fromEntries(ids.map((id) => [id, Math.max(0, Number(weights[id]) || 0)]));
  const questions = await getProvider().practiceQuestions({ topicIds: ids, count: Math.min(50, Math.max(1, count ?? 10)), weights: cleanWeights });
  return NextResponse.json({ questions });
}
