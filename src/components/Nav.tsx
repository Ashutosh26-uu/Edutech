"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dueCards, level, streak } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

const LINKS = [
  { href: "/today", label: "Today" },
  { href: "/video", label: "Videos" },
  { href: "/exams", label: "Exams" },
  { href: "/last-minute", label: "Exam tomorrow" },
  { href: "/review", label: "Flashcards" },
  { href: "/learn", label: "Learn" },
  { href: "/progress", label: "Progress" },
];

export function Nav() {
  const path = usePathname();
  const store = useStore();
  const due = store ? dueCards(store).length : 0;
  return (
    <nav className="flex gap-0.5 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {LINKS.map((l) => {
        const active = path.startsWith(l.href) || (l.href === "/exams" && path.startsWith("/practice"));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 transition-colors ${active ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
          >
            {l.label}
            {l.href === "/review" && due > 0 && <span className="rounded bg-brand-600 px-1.5 text-[10px] font-semibold leading-4 text-white">{due}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Compact streak and level indicator for the header. */
export function HeaderStats() {
  const store = useStore();
  if (!store) return null;
  const s = streak(store);
  return (
    <Link href="/today" className="hidden h-8 shrink-0 items-center gap-2 rounded-md px-2 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:flex" title={`${s}-day streak · level ${level(store.xp).level}`}>
      <Flame className={`h-3.5 w-3.5 ${s ? "text-orange-500" : ""}`} strokeWidth={2.25} />
      <span className="font-medium tabular-nums text-slate-700">{s}</span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="tabular-nums">Lv {level(store.xp).level}</span>
    </Link>
  );
}
