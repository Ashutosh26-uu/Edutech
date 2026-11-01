import { getAccount } from "@/server/account";
import { getUser } from "@/server/auth";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async (req) => {
  const user = await getUser(req);
  return json(user ? await getAccount(user) : null, { headers: { "Cache-Control": "no-store" } });
});
