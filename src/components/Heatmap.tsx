"use client";

import { dayKey } from "@/lib/storage";

const SHADES = ["bg-slate-100", "bg-brand-200", "bg-brand-500", "bg-brand-700"];

/** GitHub-style activity grid: one square per day, darker for more XP. */
export function Heatmap({ activity, weeks = 18 }: { activity: Record<string, number>; weeks?: number }) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const now = Date.now();
  const shade = (xp: number) => (xp <= 0 ? 0 : xp < 30 ? 1 : xp < 100 ? 2 : 3);

  return (
    <div className="overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
        {days.map((d) => {
          const k = dayKey(d);
          const xp = activity[k] ?? 0;
          const future = d.getTime() > now;
          return <div key={k} title={`${d.toDateString()}: ${xp} XP`} className={`h-3 w-3 rounded-sm ${future ? "bg-transparent" : SHADES[shade(xp)]}`} />;
        })}
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        Less {SHADES.map((s) => <span key={s} className={`h-3 w-3 rounded-sm ${s}`} />)} More
      </div>
    </div>
  );
}
