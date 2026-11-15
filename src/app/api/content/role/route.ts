import { getUser } from "@/server/auth";
import { roleOf } from "@/server/content";
import { json, route } from "@/server/http";

/** Whether the user may publish content (editor) or also manage access (admin). */
export const GET = route(async (req) => json(await roleOf(await getUser(req)), { headers: { "Cache-Control": "no-store" } }));
