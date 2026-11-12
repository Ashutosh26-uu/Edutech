"use client";

import { BookOpen, CalendarCheck, ClipboardList, Menu, PenLine, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { activeSection } from "@/data/sitemap-nav";
import { dueCards } from "@/lib/storage";
import { useTimedTestRunning } from "@/lib/timedTest";
import { useStore } from "@/lib/useStore";

/** Opens (or closes) the phone menu in the header; see MobileNav. */
export const MENU_EVENT = "studyclip:menu";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
}

/**
 * Tab bar along the bottom of phone screens, so the main places are one thumb-tap away.
 * Hidden on wider screens, during timed tests and on admin pages. While shown it sets
 * <body data-bottom-nav>, which pads the page and lifts the floating buttons (globals.css).
 */
export function BottomNav() {
  const path = usePathname() ?? "/";
  const store = useStore();
  const inTimedTest = useTimedTestRunning();
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = inTimedTest || path.startsWith("/admin");

  useEffect(() => {
    if (hidden) return;
    document.body.dataset.bottomNav = "1";
    return () => {
      delete document.body.dataset.bottomNav;
    };
  }, [hidden]);

  // Follow the phone menu's open state so "More" shows as pressed.
  useEffect(() => {
    const onState = (e: Event) => setMenuOpen((e as CustomEvent<boolean>).detail);
    window.addEventListener(`${MENU_EVENT}-state`, onState);
    return () => window.removeEventListener(`${MENU_EVENT}-state`, onState);
  }, []);

  if (hidden) return null;

  const examId = store?.examId;
  const due = store ? dueCards(store).length : 0;
  const tabs: Tab[] = [
    { id: "today", label: "Today", icon: CalendarCheck, href: "/today" },
    { id: "practise", label: "Practise", icon: PenLine, href: examId ? `/exams/${examId}` : "/exams" },
    { id: "tests", label: "Tests", icon: ClipboardList, href: examId ? `/practice?exam=${examId}&mock=1` : "/exams" },
    { id: "learn", label: "Learn", icon: BookOpen, href: "/topics" },
    { id: "more", label: "More", icon: Menu },
  ];
  const section = activeSection(path);
  const current = menuOpen ? "more" : section === "today" || section === "practise" || section === "tests" || section === "learn" ? section : section ? "more" : undefined;

  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-0 bottom-0 z-[35] border-t border-slate-200 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden print:hidden"
    >
      <ul className="grid h-14 grid-cols-5">
        {tabs.map((t) => {
          const active = current === t.id;
          const inner = (
            <>
              <span className="relative">
                <t.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                {t.id === "learn" && due > 0 && <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-brand-600" aria-hidden />}
              </span>
              <span className={`text-[11px] leading-none ${active ? "font-semibold" : "font-medium"}`}>{t.label}</span>
            </>
          );
          const cls = `flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${active ? "text-brand-700" : "text-slate-500 hover:text-slate-900"}`;
          return (
            <li key={t.id}>
              {t.href ? (
                <Link href={t.href} aria-current={active && section === t.id ? "page" : undefined} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => window.dispatchEvent(new Event(MENU_EVENT))} className={cls}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
