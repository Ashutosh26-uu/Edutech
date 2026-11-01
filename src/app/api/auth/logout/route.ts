import { NextResponse } from "next/server";
import { destroySession } from "@/server/auth";
import { route } from "@/server/http";

export const POST = route(async (req) => {
  const res = NextResponse.json({ ok: true });
  await destroySession(req, res);
  return res;
});
