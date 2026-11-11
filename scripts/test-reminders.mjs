// Checks the daily-reminder logic: India hour/day selection and the cron bearer check.
// Run: npm run test:reminders
import { hourLabel, isDue, isReminderHour, istHour, sendSlot } from "../src/lib/reminders.ts";
import { checkBearer } from "../src/server/cron-auth.ts";

let fail = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    fail++;
    console.log(`x ${name}: got ${g}, want ${w}`);
  }
};

// ---- India hour and day ----
eq("13:30 UTC is 19:00 IST", istHour(Date.UTC(2026, 10, 11, 13, 30)), 19);
eq("13:29 UTC is still 18 IST", istHour(Date.UTC(2026, 10, 11, 13, 29)), 18);
eq("01:30 UTC is 7 IST", istHour(Date.UTC(2026, 10, 11, 1, 30)), 7);
eq("18:30 UTC is midnight IST, next day", sendSlot(Date.UTC(2026, 10, 11, 18, 30)), { hour: 0, day: "2026-11-12" });
eq("18:29 UTC is 23 IST, same day", sendSlot(Date.UTC(2026, 10, 11, 18, 29)), { hour: 23, day: "2026-11-11" });
eq("year rollover", sendSlot(Date.UTC(2026, 11, 31, 20, 0)), { hour: 1, day: "2027-01-01" });

// ---- which subscriptions are due ----
const at7pm = Date.UTC(2026, 10, 11, 13, 30); // 19:00 IST on 2026-11-11
eq("due: right hour, never sent", isDue({ hourIst: 19, lastSentOn: null }, at7pm), true);
eq("due: right hour, sent yesterday", isDue({ hourIst: 19, lastSentOn: "2026-11-10" }, at7pm), true);
eq("not due: already sent today", isDue({ hourIst: 19, lastSentOn: "2026-11-11" }, at7pm), false);
eq("not due: other hour", isDue({ hourIst: 20, lastSentOn: null }, at7pm), false);
// The hourly cron fires a few seconds/minutes late: still the same hour.
eq("due: cron 4 minutes late", isDue({ hourIst: 19, lastSentOn: null }, at7pm + 4 * 60_000), true);
// A 7 am reminder at 01:30 UTC must use the India date, not the UTC date of the previous evening.
eq("7 am uses India date", sendSlot(Date.UTC(2026, 10, 11, 1, 30)).day, "2026-11-11");

// ---- hour choices ----
eq("labels", [7, 13, 18, 19, 20, 21, 0, 12].map(hourLabel), ["7 am", "1 pm", "6 pm", "7 pm", "8 pm", "9 pm", "12 am", "12 pm"]);
eq("valid hour", isReminderHour(19), true);
eq("invalid hour", isReminderHour(3), false);
eq("invalid type", isReminderHour("19"), false);

// ---- bearer check ----
eq("no secret configured", checkBearer("Bearer x", undefined), "unset");
eq("empty secret configured", checkBearer("Bearer x", ""), "unset");
eq("correct", checkBearer("Bearer s3cret-value", "s3cret-value"), "ok");
eq("case-insensitive scheme", checkBearer("bearer s3cret-value", "s3cret-value"), "ok");
eq("wrong secret", checkBearer("Bearer nope", "s3cret-value"), "bad");
eq("prefix of secret", checkBearer("Bearer s3cret", "s3cret-value"), "bad");
eq("missing header", checkBearer(null, "s3cret-value"), "bad");
eq("no scheme", checkBearer("s3cret-value", "s3cret-value"), "bad");
eq("basic scheme", checkBearer("Basic s3cret-value", "s3cret-value"), "bad");

console.log(fail ? `\n${fail} problem(s)` : "\nreminders: all passed");
process.exit(fail ? 1 : 0);
