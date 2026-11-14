"use client";

import { ChevronDown, Flame, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MENU_EVENT } from "@/components/BottomNav";
import { activeSection, COMPANY_LINKS, isCurrent, NAV_SECTIONS, type NavItem, type NavSection, visible } from "@/data/sitemap-nav";
import { useAccount } from "@/lib/account";
import { dueCards, level, streak } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

const openPalette = () => window.dispatchEvent(new Event("studyclip:palette"));

function DueBadge({ n }: { n: number }) {
  return n > 0 ? <span className="rounded bg-brand-600 px-1.5 text-[10px] font-semibold leading-4 text-white">{n}</span> : null;
}

/** Desktop header: a "Today" link and a drop-down menu for each other section. */
export function Nav() {
  const path = usePathname();
  const store = useStore();
  const due = store ? dueCards(store).length : 0;
  const [open, setOpen] = useState<string | null>(null);
  const active = activeSection(path);

  useEffect(() => setOpen(null), [path]);

  return (
    <nav aria-label="Main" className="hidden items-center gap-0.5 text-sm lg:flex">
      {NAV_SECTIONS.map((s, i) => {
        const isActive = active === s.id;
        if (s.items.length === 1) {
          const item = s.items[0];
          return (
            <Link
              key={s.id}
              href={item.href}
              aria-current={isCurrent(path, item.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 transition-colors ${isActive ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
            >
              {s.title}
            </Link>
          );
        }
        return (
          <NavMenu
            key={s.id}
            section={s}
            path={path}
            active={isActive}
            open={open === s.id}
            onOpenChange={(o) => setOpen(o ? s.id : null)}
            alignRight={i >= NAV_SECTIONS.length - 2}
            due={s.items.some((it) => it.href === "/review") ? due : 0}
          />
        );
      })}
    </nav>
  );
}

function NavMenu({ section, path, active, open, onOpenChange, alignRight, due }: { section: NavSection; path: string; active: boolean; open: boolean; onOpenChange: (open: boolean) => void; alignRight: boolean; due: number }) {
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = `nav-${section.id}`;

  // Click outside closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && onOpenChange(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onOpenChange]);

  const links = () => Array.from(box.current?.querySelectorAll<HTMLAnchorElement>("[data-nav-item]") ?? []);
  const focusItem = (index: number) => {
    const all = links();
    if (all.length) all[(index + all.length) % all.length].focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      onOpenChange(false);
      button.current?.focus();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    const all = links();
    const at = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        onOpenChange(true);
        // Wait for the panel to render before moving focus into it.
        requestAnimationFrame(() => focusItem(e.key === "ArrowUp" ? -1 : 0));
      }
      return;
    }
    e.preventDefault();
    if (e.key === "Home") focusItem(0);
    else if (e.key === "End") focusItem(-1);
    else focusItem(at < 0 ? (e.key === "ArrowUp" ? -1 : 0) : at + (e.key === "ArrowDown" ? 1 : -1));
  };

  return (
    <div
      ref={box}
      className="relative"
      onKeyDown={onKeyDown}
      // Tabbing out of the menu closes it.
      onBlur={(e) => open && !box.current?.contains(e.relatedTarget as Node) && onOpenChange(false)}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 transition-colors ${active ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"} ${open ? "text-slate-900" : ""}`}
      >
        {section.title}
        {due > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-label={`${due} flashcards due`} />}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div id={panelId} className={`absolute top-full z-30 mt-2 w-72 rounded-xl border border-slate-200 bg-surface p-1.5 shadow-lg ${alignRight ? "right-0" : "left-0"}`}>
          <ul>
            {section.items.map((it) => (
              <li key={`${it.href}-${it.label}`}>
                <MenuLink item={it} current={isCurrent(path, it.href)} due={it.href === "/review" ? due : 0} onNavigate={() => onOpenChange(false)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MenuLink({ item, current, due, onNavigate }: { item: NavItem; current: boolean; due: number; onNavigate: () => void }) {
  return (
    <Link
      href={item.href}
      data-nav-item
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={`block rounded-lg px-3 py-2 outline-none hover:bg-slate-50 focus-visible:bg-slate-100 ${current ? "bg-slate-50" : ""}`}
    >
      <span className={`flex items-center gap-2 text-sm ${current ? "font-semibold text-slate-900" : "font-medium text-slate-800"}`}>
        {item.label} <DueBadge n={due} />
      </span>
      <span className="mt-0.5 block text-xs leading-snug text-slate-500">{item.description}</span>
    </Link>
  );
}

/** Menu button and drop-down panel with every page, for phones and small tablets. */
export function MobileNav() {
  const path = usePathname();
  const store = useStore();
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const due = store ? dueCards(store).length : 0;

  // Close on navigation and on Escape; stop the page behind from scrolling while open.
  useEffect(() => setOpen(false), [path]);
  // The phone tab bar's "More" button toggles this menu, and shows it as pressed while open.
  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener(MENU_EVENT, onToggle);
    return () => window.removeEventListener(MENU_EVENT, onToggle);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(`${MENU_EVENT}-state`, { detail: open }));
  }, [open]);
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
  // Bottom row: pricing, invite, help and log in (account pages are dropped on the static build).
  const link = (href: string) => visible(COMPANY_LINKS.filter((l) => l.href === href));
  const signedOut = account.mode !== "local" && account.ready && !account.user;
  const bottom: (NavItem | "help")[] = [...link("/start"), ...link("/pricing"), ...link("/invite"), "help", ...(signedOut ? link("/login") : [])];
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
            <div id="mobile-menu" className="fixed inset-x-0 top-14 z-40 max-h-[calc(100dvh-3.5rem-var(--bottom-nav-h,0px))] overflow-y-auto border-b border-slate-200 bg-surface px-4 pb-6 pt-3 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPalette();
                }}
                className="mb-1 flex h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
              >
                <Search className="h-4 w-4" /> Search exams, topics, pages…
              </button>
              <nav aria-label="Main">
                {NAV_SECTIONS.map((sec) => (
                  <div key={sec.id} className="mt-3">
                    <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{sec.title}</h2>
                    <ul className="mt-1 grid grid-cols-2 gap-1 text-sm">
                      {sec.items.map((l) => {
                        const current = isCurrent(path, l.href);
                        return (
                          <li key={`${l.href}-${l.label}`}>
                            <Link
                              href={l.href}
                              aria-current={current ? "page" : undefined}
                              className={`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 ${current ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                              {l.label}
                              {l.href === "/review" && <DueBadge n={due} />}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
              <div className="mt-4 flex flex-wrap items-center gap-x-1 border-t border-slate-200 pt-3 text-sm text-slate-500">
                {bottom.map((l, i) => (
                  <span key={l === "help" ? l : l.href} className="flex items-center">
                    {i > 0 && <span aria-hidden>·</span>}
                    {l === "help" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          // HelpBot has no open event; press its floating launcher.
                          document.querySelector<HTMLButtonElement>('button[aria-label="Open help chat"]')?.click();
                        }}
                        className="flex min-h-11 items-center px-2 hover:text-slate-900"
                      >
                        Help
                      </button>
                    ) : (
                      <Link href={l.href} className="flex min-h-11 items-center px-2 hover:text-slate-900">
                        {l.label}
                      </Link>
                    )}
                  </span>
                ))}
              </div>
              {store && (
                <Link href="/today" className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
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

/** Small "New here?" link to the Start here guide, shown in the header until an exam is chosen. */
export function NewHereLink() {
  const path = usePathname();
  const store = useStore();
  if (!store || store.examId || path === "/start") return null;
  return (
    <Link href="/start" className="shrink-0 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 lg:hidden 2xl:inline-flex">
      New here?
    </Link>
  );
}

/** Compact streak and level indicator for the header. */
export function HeaderStats() {
  const store = useStore();
  // Same footprint before progress loads, so the header doesn't shift when the numbers arrive.
  if (!store) return <span className="hidden h-8 min-w-[5.5rem] shrink-0 sm:block" aria-hidden />;
  const s = streak(store);
  return (
    <Link href="/today" className="hidden h-8 min-w-[5.5rem] shrink-0 items-center justify-center gap-2 rounded-md px-2 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:flex" title={`${s}-day streak · level ${level(store.xp).level}`}>
      <Flame className={`h-3.5 w-3.5 ${s ? "text-orange-500" : ""}`} strokeWidth={2.25} />
      <span className="font-medium tabular-nums text-slate-700">{s}</span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="tabular-nums">Lv {level(store.xp).level}</span>
    </Link>
  );
}
