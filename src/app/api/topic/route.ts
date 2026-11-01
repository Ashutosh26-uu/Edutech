import { NextResponse } from "next/server";
import { handleTopic } from "@/lib/handlers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await handleTopic(body);
  return NextResponse.json(json, { status });
}
