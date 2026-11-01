import { Play } from "lucide-react";

/**
 * Static illustration of the video-breakdown screen for the landing page. It is a UI sample,
 * not real data, and is hidden from assistive technology.
 */
const CHAPTERS: { t: string; title: string; level: "High" | "Medium" | "Low"; w: number }[] = [
  { t: "0:00", title: "What are Fundamental Rights?", level: "Medium", w: 8 },
  { t: "6:42", title: "Right to Equality: Articles 14–18", level: "High", w: 18 },
  { t: "24:10", title: "Six freedoms under Article 19", level: "High", w: 22 },
  { t: "51:35", title: "Doctrine of eclipse and severability", level: "Low", w: 12 },
  { t: "1:08:20", title: "Writs under Article 32", level: "High", w: 20 },
];

const LEVEL = {
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-800 ring-amber-200",
  Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function ProductPreview() {
  return (
    <div aria-hidden className="relative select-none rounded-xl border border-slate-200 bg-surface p-3 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-1.5 px-1 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="ml-3 truncate rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500">studyclip.app/video</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
        <div className="space-y-2.5">
          <div className="relative grid aspect-video place-items-center overflow-hidden rounded-lg bg-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90">
              <Play className="h-4 w-4 translate-x-px fill-zinc-900 text-zinc-900" />
            </span>
            {/* Timeline with the important stretches highlighted */}
            <div className="absolute inset-x-3 bottom-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
              {CHAPTERS.map((c) => (
                <span key={c.t} style={{ flexGrow: c.w }} className={c.level === "High" ? "bg-red-400" : "bg-white/30"} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-900">Indian Polity: Fundamental Rights (full lecture)</div>
            <div className="text-[11px] text-slate-500">2:14:08 · 5 chapters · important parts: 41 min</div>
          </div>
          <div className="space-y-1.5 rounded-lg bg-slate-50 p-2.5">
            <div className="eyebrow text-[10px]">Key points</div>
            {["Article 17 abolishes untouchability", "Article 32: Supreme Court can issue five writs"].map((k) => (
              <div key={k} className="flex gap-2 text-[11px] text-slate-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {k}
              </div>
            ))}
          </div>
        </div>
        <ul className="space-y-1.5">
          {CHAPTERS.map((c, i) => (
            <li key={c.t} className={`rounded-lg border px-2.5 py-2 ${i === 1 ? "border-brand-200 bg-brand-50" : "border-slate-200"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-slate-500">{c.t}</span>
                <span className={`rounded px-1.5 text-[9px] font-medium ring-1 ring-inset ${LEVEL[c.level]}`}>{c.level}</span>
              </div>
              <div className="mt-0.5 truncate text-[11px] font-medium text-slate-800">{c.title}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
