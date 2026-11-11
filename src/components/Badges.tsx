"use client";

import { Award, CalendarCheck, ClipboardCheck, Crown, Flame, GraduationCap, Layers, Medal, Rocket, Star, Target, Trophy, Video, X, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { computeBadges, type Badge } from "@/lib/badges";
import { dayKey, markBadgesAnnounced, type Store } from "@/lib/storage";

const ICONS: Record<string, LucideIcon> = {
  "first-set": Target,
  "q-100": Medal,
  "q-1000": Trophy,
  "streak-7": Flame,
  "streak-30": Rocket,
  "mock-1": ClipboardCheck,
  "mock-5": GraduationCap,
  "topic-master": Crown,
  "cards-50": Layers,
  "video-1": Video,
  "daily-7": CalendarCheck,
  "level-5": Star,
  "level-10": Award,
};

export function BadgesSection({ store }: { store: Store }) {
  const badges = computeBadges(store, dayKey());
  const earned = badges.filter((b) => b.earned).length;
  return (
    <section className="card">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">Badges</h2>
        <span className="chip bg-amber-50 text-amber-800">
          {earned}/{badges.length} earned
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map((b) => {
          const Icon = ICONS[b.id] ?? Award;
          return (
            <li key={b.id} className={`flex gap-2.5 rounded-xl border p-2.5 ${b.earned ? "border-amber-200 bg-amber-50/60" : "border-slate-200"}`} title={b.detail}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${b.earned ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400"}`}>
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-sm font-semibold ${b.earned ? "text-slate-900" : "text-slate-500"}`}>{b.name}</div>
                <div className="text-[11px] leading-snug text-slate-500">{b.detail}</div>
                {!b.earned && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-slate-400" style={{ width: `${(b.have / b.need) * 100}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-slate-500">
                      {b.have}/{b.need}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Celebrates badges earned since the last visit, once each. The very first time it runs it only
 * notes what is already earned, so people with existing progress are not flooded with toasts.
 */
export function BadgeToast({ store }: { store: Store }) {
  const [shown, setShown] = useState<Badge[]>([]);
  const earned = computeBadges(store, dayKey()).filter((b) => b.earned);
  const announced = store.announcedBadges;
  const fresh = announced ? earned.filter((b) => !announced.includes(b.id)) : [];
  const key = fresh.map((b) => b.id).join(",");

  useEffect(() => {
    if (!announced) {
      markBadgesAnnounced(earned.map((b) => b.id));
      return;
    }
    if (!fresh.length) return;
    setShown(fresh);
    markBadgesAnnounced(fresh.map((b) => b.id));
    // Keyed on the ids, not the arrays, which are rebuilt on every render.
  }, [key, !announced]);

  useEffect(() => {
    if (!shown.length) return;
    const t = setTimeout(() => setShown([]), 6000);
    return () => clearTimeout(t);
  }, [shown]);

  if (!shown.length) return null;
  const first = shown[0];
  const Icon = ICONS[first.id] ?? Award;
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-amber-200 bg-surface p-3 shadow-lg">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-400 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <div className="font-semibold text-slate-900">🎉 Badge earned: {first.name}</div>
        <div className="text-xs text-slate-600">{shown.length > 1 ? `And ${shown.length - 1} more. See them in Badges below.` : first.detail}</div>
      </div>
      <button className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={() => setShown([])} aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
