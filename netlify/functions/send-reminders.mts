// Hourly trigger for the daily study reminders: asks the app to send the ones due this India hour.
// Netlify runs scheduled functions on published production deploys only. Needs CRON_SECRET.
export default async () => {
  const secret = process.env.CRON_SECRET;
  if (!secret || !process.env.URL) return new Response("not configured", { status: 200 });
  // The sender stops after ~7 s and reports `more` if rows are left; call again a few times.
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`${process.env.URL}/api/push/send`, { method: "POST", headers: { Authorization: `Bearer ${secret}` } });
    const body = await res.json().catch(() => ({}));
    console.log("[send-reminders]", res.status, JSON.stringify(body));
    if (!res.ok || !body.more) break;
  }
  return new Response("ok");
};

// Minute 30 UTC is the top of the hour in India (UTC+5:30): a 7 pm reminder goes out at 7:00 pm IST.
export const config = { schedule: "30 * * * *" };
