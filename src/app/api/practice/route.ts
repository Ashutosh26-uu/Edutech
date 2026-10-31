import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";
import { TOPIC_BY_ID } from "@/data/topics";

export async function POST(req: Request) {
  const { topicIds, count } = (await req.json().catch(() => ({}))) as { topicIds?: string[]; count?: number };
  const ids = (topicIds ?? []).filter((id) => TOPIC_BY_ID.has(id));
  if (!ids.length) return NextResponse.json({ error: "Pick at least one topic." }, { status: 400 });
  const questions = await getProvider().practiceQuestions({ topicIds: ids, count: Math.min(50, Math.max(1, count ?? 10)) });
  return NextResponse.json({ questions });
}
