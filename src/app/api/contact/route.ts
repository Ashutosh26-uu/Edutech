import type { NextRequest } from "next/server";
import { z } from "zod";
import { CONTACT_TOPICS, type ContactTopic } from "@/data/site";
import { db, schema } from "@/db";
import { getUser } from "@/server/auth";
import { clientIp, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
  topic: z.enum(Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]], { message: "Choose what your message is about." }),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(4000, "Please keep the message under 4,000 characters."),
  // Hidden field that people never fill in; bots usually do.
  website: z.string().max(0, "Could not send your message. Please try again.").optional(),
});

/** Saves a Contact-page message. Signed-in users are linked to their account. */
export const POST = route(async (req: NextRequest) => {
  await rateLimit("contact:" + clientIp(req), 5, 10 * 60_000);
  const body = await parseBody(req, Body);
  const user = await getUser(req).catch(() => null);
  const [row] = await db
    .insert(schema.contactMessages)
    .values({ userId: user?.id ?? null, name: body.name || null, email: body.email, topic: body.topic, message: body.message })
    .returning({ id: schema.contactMessages.id });
  // A short reference the user can quote in follow-ups.
  return json({ ok: true, reference: row.id.slice(0, 8).toUpperCase() }, 201);
});
