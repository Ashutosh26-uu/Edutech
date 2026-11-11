import type { NextRequest } from "next/server";
import { checkBearer } from "@/server/cron-auth";
import { json, route } from "@/server/http";
import { pushConfigured, sendDueReminders } from "@/server/push";

export const dynamic = "force-dynamic";

/**
 * Sends the daily reminders due this India hour. Called hourly by the Netlify scheduled function
 * (netlify/functions/send-reminders.mts) with `Authorization: Bearer $CRON_SECRET`. Without
 * CRON_SECRET the route does not exist (404).
 */
export const POST = route(
  async (req: NextRequest) => {
    const auth = checkBearer(req.headers.get("authorization"), process.env.CRON_SECRET);
    if (auth === "unset") return json({ error: "Not found." }, 404);
    if (auth === "bad") return json({ error: "Unauthorized." }, 401);
    if (!pushConfigured()) return json({ error: "VAPID keys are not set." }, 503);
    return json(await sendDueReminders());
  },
  { csrf: false },
);
