import { getUser } from "@/server/auth";
import { HttpError, json, route } from "@/server/http";
import { institutionPage } from "@/server/institutions";

/** The public institute page (?slug=). */
export const GET = route(async (req) => {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!/^[a-z0-9-]{1,60}$/.test(slug)) throw new HttpError(404, "Institute not found.");
  return json(await institutionPage(await getUser(req), slug), { headers: { "Cache-Control": "no-store" } });
});
