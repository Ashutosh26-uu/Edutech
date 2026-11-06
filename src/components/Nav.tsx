"use client";

import { Flame, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { dueCards, level, streak } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

const LINKS = [
  { href: "/today", label: "Today" },
  { href: "/video", label: "Videos" },
  { href: "/exams", label: "Exams" },
  { href: "/last-minute", label: "Exam tomorrow" },
  { href: "/review", label: "Flashcards" },
  { href: "/learn", label: "Learn" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/progress", label: "Progress" },
];

/** Extra pages listed in the phone menu, where there is room for them. */
const MORE = [
  { href: "/saved", label: "Saved questions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const isActive = (path: string, href: string) => path.startsWith(href) || (href === "/exams" && path.startsWith("/practice"));

export function Nav() {
  const path = usePathname();
  const store = useStore();
  const due = store ? dueCards(store).length : 0;
  return (
    <nav className="hidden gap-0.5 overflow-x-auto text-sm [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden">
      {LINKS.map((l) => {
        const active = isActive(path, l.href);
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

/** Menu button and drop-down panel with every page, for phones and small tablets. */
export function MobileNav() {
  const path = usePathname();
  const store = useStore();
  const [open, setOpen] = useState(false);
  const due = store ? dueCards(store).length : 0;

  // Close on navigation and on Escape; stop the page behind from scrolling while open.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const s = store ? streak(store) : 0;
  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="grid h-9 w-9 place-items-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open &&
        // Rendered on <body>: the header's backdrop blur would otherwise make it the panel's containing block.
        createPortal(
        <>
          <div className="fixed inset-0 top-14 z-30 bg-black/30" onClick={() => setOpen(false)} aria-hidden />
          <div id="mobile-menu" className="fixed inset-x-0 top-14 z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-surface px-4 pb-6 pt-3 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("studyclip:palette"));
              }}
              className="mb-3 flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
            >
              <Search className="h-4 w-4" /> Search exams, topics, pages…
            </button>
            <nav className="grid grid-cols-2 gap-1.5 text-sm" aria-label="Main">
              {LINKS.map((l) => {
                const active = isActive(path, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2.5 ${active ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {l.label}
                    {l.href === "/review" && due > 0 && <span className="rounded bg-brand-600 px-1.5 text-[10px] font-semibold leading-4 text-white">{due}</span>}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <nav className="grid grid-cols-2 gap-1.5 text-sm" aria-label="More">
                {MORE.map((l) => (
                  <Link key={l.href} href={l.href} className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
            {store && (
              <Link href="/today" className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
                <Flame className={`h-4 w-4 ${s ? "text-orange-500" : ""}`} /> {s}-day streak · Level {level(store.xp).level} · {store.xp} XP
              </Link>
            )}
          </div>
        </>,
        document.body,
      )}
    </div>
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
