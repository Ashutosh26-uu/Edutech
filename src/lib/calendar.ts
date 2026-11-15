/** Shared labels and helpers for exam-calendar events (calendar page, dashboard strip, editor). */

export type EventKind = "notification" | "apply-start" | "apply-end" | "admit-card" | "exam" | "result" | "other";

export interface ExamEvent {
  id: string;
  examId: string | null;
  examName: string | null;
  kind: EventKind;
  title: string;
  day: string;
  endDay: string | null;
  link: string | null;
  note: string | null;
}

export const KIND: Record<EventKind, { label: string; tone: string }> = {
  notification: { label: "Notification", tone: "bg-sky-50 text-sky-700" },
  "apply-start": { label: "Apply from", tone: "bg-emerald-50 text-emerald-700" },
  "apply-end": { label: "Last date to apply", tone: "bg-red-50 text-red-700" },
  "admit-card": { label: "Admit card", tone: "bg-violet-50 text-violet-700" },
  exam: { label: "Exam", tone: "bg-brand-50 text-brand-700" },
  result: { label: "Result", tone: "bg-amber-50 text-amber-800" },
  other: { label: "Update", tone: "bg-slate-100 text-slate-700" },
};

const toUtc = (day: string) => Date.parse(`${day}T00:00:00Z`);

/** Whole days from today (India) to the event: negative once it has passed. */
export function daysFrom(today: string, day: string) {
  return Math.round((toUtc(day) - toUtc(today)) / 86_400_000);
}

export function whenLabel(today: string, e: Pick<ExamEvent, "day" | "endDay">) {
  const start = daysFrom(today, e.day);
  const end = e.endDay ? daysFrom(today, e.endDay) : start;
  if (start <= 0 && end >= 0) return start === 0 && end === 0 ? "Today" : "On now";
  if (start === 1) return "Tomorrow";
  if (start > 1) return `In ${start} days`;
  return "Passed";
}

export const fmtDay = (day: string) => new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** "Add to Google Calendar" link for an all-day event. */
export function googleCalendarUrl(e: ExamEvent) {
  const start = e.day.replace(/-/g, "");
  const end = new Date(toUtc(e.endDay ?? e.day) + 86_400_000).toISOString().slice(0, 10).replace(/-/g, "");
  const p = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${start}/${end}`, details: [e.note, e.link, "From StudyClip’s exam calendar"].filter(Boolean).join("\n") });
  return `https://calendar.google.com/calendar/render?${p}`;
}
