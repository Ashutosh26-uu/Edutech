import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";

export async function POST(req: Request) {
  const { question } = (await req.json().catch(() => ({}))) as { question?: string };
  if (!question?.trim()) return NextResponse.json({ error: "Type or paste a question." }, { status: 400 });
  return NextResponse.json(await getProvider().solveQuestion(question));
}
