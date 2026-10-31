import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";

export async function POST(req: Request) {
  const { query } = (await req.json().catch(() => ({}))) as { query?: string };
  if (!query?.trim()) return NextResponse.json({ error: "Type a topic to search." }, { status: 400 });
  return NextResponse.json(await getProvider().explainTopic(query));
}
