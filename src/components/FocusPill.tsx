"use client";

import { Coffee, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatClock, isActive, timeLeft, useFocus } from "@/lib/focus";

/**
 * Mounted from the layout on every page: keeps the focus timer finishing its blocks while the
 * student browses, and shows a tiny clock in the corner while a block is running or paused.
 */
export function FocusPill() {
  const focus = useFocus();
  const path = usePathname();
  if (!focus || path.startsWith("/focus") || !isActive(focus.state)) return null;
  const { state, now } = focus;
  const Icon = state.phase === "focus" ? Timer : Coffee;
  return (
    <Link
      href="/focus"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-30 flex items-center gap-1.5 rounded-full border border-slate-200 bg-surface px-3 py-2 text-xs font-medium text-slate-700 shadow-lg transition hover:border-slate-300 print:hidden"
      aria-label={`Focus timer: ${state.phase}, ${formatClock(timeLeft(state, now))} left${state.running ? "" : ", paused"}. Open timer`}
    >
      <Icon className={`h-3.5 w-3.5 ${state.phase === "focus" ? "text-brand-600" : "text-emerald-600"}`} />
      <span className="font-mono tabular-nums">{formatClock(timeLeft(state, now))}</span>
      {!state.running && <span className="text-slate-500">paused</span>}
    </Link>
  );
}
