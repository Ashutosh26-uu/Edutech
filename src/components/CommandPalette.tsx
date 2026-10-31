"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { EXAMS } from "@/data/exams";
import { TOPICS } from "@/data/topics";
import { load } from "@/lib/storage";
import { parseVideoId } from "@/lib/youtube";
import { toggleTheme } from "./ThemeToggle";

interface Item {
  label: string;
  hint: string;
  group: string;
  run: () => void;
}

/** Global quick-search (Ctrl/⌘ + K): pages, exams, topics, recent videos and actions. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName);
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("studyclip:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("studyclip:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);

  const go = (href: string) => () => router.push(href);

  const items = useMemo<Item[]>(() => {
    if (!open) return [];
    const store = load();
    const examId = store.examId;
    return [
      { label: "Today’s plan", hint: "Daily goal, streak and tasks", group: "Pages", run: go("/today") },
      { label: "Review flashcards", hint: "Spaced repetition", group: "Pages", run: go("/review") },
      { label: "Break down a video", hint: "Paste a YouTube link", group: "Pages", run: go("/video") },
      { label: "My progress", hint: "Accuracy and weak topics", group: "Pages", run: go("/progress") },
      ...(examId ? [{ label: "Start smart practice", hint: "Adaptive questions for your exam", group: "Actions", run: go(`/practice?exam=${examId}&smart=1`) }] : []),
      ...(examId ? [{ label: "Take a mock test", hint: "Timed, with negative marking", group: "Actions", run: go(`/practice?exam=${examId}&mock=1`) }] : []),
      { label: "Toggle dark mode", hint: "Switch theme", group: "Actions", run: toggleTheme },
      ...EXAMS.map((e) => ({ label: e.name, hint: e.fullName, group: "Exams", run: go(`/exams/${e.id}`) })),
      ...TOPICS.map((t) => ({ label: t.name, hint: t.subject, group: "Topics", run: go(`/learn?topic=${encodeURIComponent(t.name)}`) })),
      ...store.videos.map((v) => ({ label: v.title, hint: `${v.chapters} chapters`, group: "Recent videos", run: go(`/video?v=${v.videoId}`) })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const videoId = parseVideoId(q);
    const special: Item[] = videoId ? [{ label: "Break down this video", hint: videoId, group: "Video", run: go(`/video?v=${videoId}`) }] : [];
    if (!query) return [...special, ...items.slice(0, 8)];
    const words = query.split(/\s+/);
    const scored = items
      .map((it) => {
        const hay = `${it.label} ${it.hint}`.toLowerCase();
        if (!words.every((w) => hay.includes(w))) return null;
        return { it, score: it.label.toLowerCase().startsWith(query) ? 0 : it.label.toLowerCase().includes(query) ? 1 : 2 };
      })
      .filter((x): x is { it: Item; score: number } => !!x)
      .sort((a, b) => a.score - b.score)
      .map((x) => x.it);
    const fallback: Item[] = scored.length || videoId ? [] : [{ label: `Search topics for “${q.trim()}”`, hint: "Open Learn", group: "Search", run: go(`/learn?topic=${encodeURIComponent(q.trim())}`) }];
    return [...special, ...scored.slice(0, 12), ...fallback];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, items]);

  if (!open) return null;

  const run = (it: Item) => {
    setOpen(false);
    it.run();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Quick search">
        <input
          ref={input}
          className="w-full border-b border-slate-200 bg-transparent px-5 py-4 text-base text-slate-900 outline-none"
          placeholder="Search topics, exams, pages… or paste a YouTube link"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => Math.min(results.length - 1, s + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => Math.max(0, s - 1));
            } else if (e.key === "Enter" && results[sel]) run(results[sel]);
          }}
        />
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((it, i) => (
            <li key={`${it.group}-${it.label}`}>
              <button onMouseEnter={() => setSel(i)} onClick={() => run(it)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${i === sel ? "bg-brand-50" : ""}`}>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900">{it.label}</span>
                  <span className="block truncate text-xs text-slate-500">{it.hint}</span>
                </span>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{it.group}</span>
              </button>
            </li>
          ))}
          {!results.length && <li className="px-3 py-6 text-center text-sm text-slate-500">No results</li>}
        </ul>
        <div className="flex gap-4 border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500">
          <span>↑↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}

export function PaletteButton() {
  return (
    <button onClick={() => window.dispatchEvent(new Event("studyclip:palette"))} className="hidden shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-50 md:flex" title="Quick search (Ctrl + K)">
      🔍 Search <kbd className="rounded bg-slate-100 px-1 font-sans text-[10px]">Ctrl K</kbd>
    </button>
  );
}
