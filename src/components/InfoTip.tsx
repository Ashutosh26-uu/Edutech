"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { GLOSSARY, type GlossaryId } from "@/lib/glossary";

/**
 * A small "?" button that explains one of the site's words in plain language (see lib/glossary.ts).
 * Tap or click opens it; Esc, tapping elsewhere or the button again closes it. Built from <span>s
 * so it can sit inside a sentence; don't place it inside a link.
 */
export function InfoTip({ id, className = "" }: { id: GlossaryId; className?: string }) {
  const entry = GLOSSARY[id];
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const box = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  // Keep the bubble inside the screen on narrow phones.
  useLayoutEffect(() => {
    if (!open || !panel.current) return setShift(0);
    const r = panel.current.getBoundingClientRect();
    const pad = 8;
    const over = r.right - (window.innerWidth - pad);
    const under = pad - r.left;
    setShift(over > 0 ? -over : under > 0 ? under : 0);
  }, [open]);

  return (
    <span ref={box} className={`relative inline-flex align-middle ${className}`}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`What is “${entry.term}”?`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`grid h-5 w-5 place-items-center rounded-full border text-[11px] font-semibold leading-none transition-colors ${open ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-800"}`}
      >
        ?
      </button>
      {open && (
        <span
          ref={panel}
          id={panelId}
          role="note"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
          className="absolute left-1/2 top-full z-50 mt-2 block w-64 max-w-[calc(100vw-1rem)] rounded-xl border border-slate-200 bg-surface p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-slate-700 shadow-lg"
        >
          <span className="block text-sm font-semibold text-slate-900">{entry.term}</span>
          <span className="mt-1 block">{entry.text}</span>
          <span lang="hi-Latn" className="mt-1.5 block italic text-slate-500">
            {entry.hi}
          </span>
        </span>
      )}
    </span>
  );
}
