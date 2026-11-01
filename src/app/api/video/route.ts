import { NextResponse } from "next/server";
import { handleVideo } from "@/lib/handlers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await handleVideo(body, { canFetchCaptions: true });
  return NextResponse.json(json, { status });
}
