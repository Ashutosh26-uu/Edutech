/** A tiny bar sparkline drawn with CSS only: one bar per value, oldest on the left, the best one highlighted. */
export function Sparkline({ values, label, unit = "" }: { values: number[]; label: string; unit?: string }) {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const best = values.lastIndexOf(Math.max(...values));
  return (
    <div role="img" aria-label={`${label}: ${values.join(", ")}${unit}`} className="flex h-12 items-end gap-0.5">
      {values.map((v, i) => (
        <span
          key={i}
          title={`${v}${unit}`}
          className={`w-full max-w-3 min-w-1 rounded-t-sm ${i === best ? "bg-brand-600" : i === values.length - 1 ? "bg-slate-500" : "bg-slate-300"}`}
          style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
