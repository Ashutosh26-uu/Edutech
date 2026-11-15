import { z } from "zod";
import type { NextRequest } from "next/server";
import { requireUser } from "@/server/auth";
import { HttpError, json, parseBody, route } from "@/server/http";
import { manageInstitution, updateInstitution } from "@/server/institutions";

const slugOf = (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!/^[a-z0-9-]{1,60}$/.test(slug)) throw new HttpError(404, "Institute not found.");
  return slug;
};

/** Staff view of an institute page: details, staff, sets (drafts too) and the join code. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json(await manageInstitution(user, slugOf(req)), { headers: { "Cache-Control": "no-store" } });
});

const Body = z.object({ name: z.string().trim().min(3).max(120), city: z.string().trim().max(80).optional(), about: z.string().trim().max(600).optional(), website: z.string().trim().max(200).optional() });

export const PATCH = route(async (req) => {
  const user = await requireUser(req);
  await updateInstitution(user, slugOf(req), await parseBody(req, Body));
  return json({ ok: true });
});
