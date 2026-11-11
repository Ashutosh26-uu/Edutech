import { istDayKey } from "./streak";

/**
 * Daily study reminders (Web Push): the hours a reminder can go out, in India time, and the
 * "is this one due now?" rule the hourly sender uses. Shared by the /today card and the server.
 */

/** Hours (0-23, India time) a user can pick. */
export const REMINDER_HOURS = [7, 13, 18, 19, 20, 21] as const;
export const DEFAULT_REMINDER_HOUR = 19;

export const isReminderHour = (h: unknown): h is number => typeof h === "number" && (REMINDER_HOURS as readonly number[]).includes(h);

/** "7 am", "1 pm", "7 pm". */
export function hourLabel(h: number): string {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${h < 12 ? "am" : "pm"}`;
}

/** The hour (0-23) in India (UTC+5:30, no daylight saving) at `now`. */
export function istHour(now = Date.now()): number {
  return new Date(now + 330 * 60_000).getUTCHours();
}

/** The India hour and date (YYYY-MM-DD) the sender works on at `now`. */
export function sendSlot(now = Date.now()): { hour: number; day: string } {
  return { hour: istHour(now), day: istDayKey(now) };
}

/** A subscription is due when its hour is the current India hour and it has not been sent to today. */
export function isDue(sub: { hourIst: number; lastSentOn: string | null }, now = Date.now()): boolean {
  const { hour, day } = sendSlot(now);
  return sub.hourIst === hour && sub.lastSentOn !== day;
}
