import { NextResponse } from "next/server";
import { handleSolve } from "@/lib/handlers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await handleSolve(body);
  return NextResponse.json(json, { status });
}
