import { Check, X } from "lucide-react";

/**
 * Static illustration of a practice question for the home page: the answer and a short
 * explanation appear right after you choose. It is a sample, not real data, and is hidden
 * from assistive technology.
 */
const OPTIONS: { label: string; state?: "right" | "wrong" }[] = [
  { label: "10%" },
  { label: "12.5%", state: "right" },
  { label: "15%", state: "wrong" },
  { label: "17.5%" },
];

const STATE = {
  right: "border-emerald-200 bg-emerald-50 text-emerald-700",
  wrong: "border-red-200 bg-red-50 text-red-700",
};

export function PracticePreview() {
  return (
    <div aria-hidden className="relative select-none rounded-xl border border-slate-200 bg-surface p-4 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)] sm:p-5">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>Question 3 of 10 · Profit and Loss</span>
        <span className="rounded-md bg-slate-100 px-2 py-0.5">Sample</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-slate-100">
        <div className="h-1.5 w-[30%] rounded-full bg-brand-500" />
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed text-slate-900 sm:text-[15px]">
        A shopkeeper marks an article 25% above its cost price and then gives a 10% discount. What is his profit per cent?
      </p>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((o, i) => (
          <li key={o.label} className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${o.state ? STATE[o.state] : "border-slate-200 text-slate-700"}`}>
            <span>
              <span className="mr-2 font-mono text-xs opacity-70">{"ABCD"[i]}</span>
              {o.label}
            </span>
            {o.state === "right" && <Check className="h-4 w-4" />}
            {o.state === "wrong" && <X className="h-4 w-4" />}
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg bg-slate-50 p-3">
        <div className="eyebrow text-[10px]">Explanation</div>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
          Let the cost price be 100. Marked price = 125. Discount = 10% of 125 = 12.5, so selling price = 112.5. Profit = 12.5%.
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <span>Weak topic found: Profit and Loss</span>
        <span className="font-medium">You will get more of these</span>
      </div>
    </div>
  );
}
