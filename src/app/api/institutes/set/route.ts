import { z } from "zod";
import { getUser } from "@/server/auth";
import { HttpError, json, route } from "@/server/http";
import { practiceSet } from "@/server/institutions";

/** One set to practise (?id=): public sets for anyone, members-only sets for members and staff. */
export const GET = route(async (req) => {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Set not found.");
  return json(await practiceSet(await getUser(req), id), { headers: { "Cache-Control": "no-store" } });
});
