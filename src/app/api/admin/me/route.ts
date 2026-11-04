import { isAdmin } from "@/server/admin";
import { getUser } from "@/server/auth";
import { json, route } from "@/server/http";

/** Whether the signed-in user may open the admin screens. */
export const GET = route(async (req) => json({ admin: isAdmin(await getUser(req)) }));
