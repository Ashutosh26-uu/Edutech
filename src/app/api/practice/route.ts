import { NextResponse } from "next/server";
import { handlePractice } from "@/lib/handlers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await handlePractice(body);
  return NextResponse.json(json, { status });
}
