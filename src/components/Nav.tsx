"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dueCards, level, streak } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

const LINKS = [
  { href: "/today", label: "Today" },
  { href: "/video", label: "Video Breakdown" },
  { href: "/exams", label: "Exam Prep" },
  { href: "/review", label: "Flashcards" },
  { href: "/learn", label: "Learn" },
  { href: "/progress", label: "Progress" },
];

export function Nav() {
  const path = usePathname();
  const store = useStore();
  const due = store ? dueCards(store).length : 0;
  return (
    <nav className="flex gap-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {LINKS.map((l) => {
        const active = path.startsWith(l.href) || (l.href === "/exams" && path.startsWith("/practice"));
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 font-medium ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {l.label}
            {l.href === "/review" && due > 0 && <span className="ml-1.5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{due}</span>}
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
    <Link href="/today" className="hidden shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:flex" title="Your streak and level">
      <span className={s ? "" : "opacity-40 grayscale"}>🔥 {s}</span>
      <span className="chip bg-brand-50 text-brand-700">Lv {level(store.xp).level}</span>
    </Link>
  );
}
