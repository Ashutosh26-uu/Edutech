"use client";

import { MessageCircleQuestion, RotateCcw, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import type { BotContext, BotLink, Lang } from "@/lib/helpbot";
import { useTimedTestRunning } from "@/lib/timedTest";
import { track } from "@/lib/track";

type Engine = typeof import("@/lib/helpbot");

interface Msg {
  from: "user" | "bot";
  text: string;
  links?: BotLink[];
  suggestions?: string[];
  unsure?: boolean;
}

const KEY = "studyclip:helpbot";
const GREETING: Record<Lang, string> = {
  en: "Hi! I’m the StudyClip help bot. Ask me anything about using the site: mock tests, practice, flashcards, payments, your account, resume builder and more.",
  hi: "Namaste! Main StudyClip ka help bot hoon. Site ke baare mein kuch bhi pucho: mock test, practice, flashcards, payment, account, resume builder aur bhi bahut kuch.",
};

/** **bold** inside a line. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

/** Answer text: lines starting with "- " become a list, the rest paragraphs. */
function Body({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const line of text.split("\n")) {
    const list = /^\s*[-•]\s+/.test(line);
    const clean = line.replace(/^\s*[-•]\s+/, "");
    if (!clean.trim()) continue;
    const last = blocks[blocks.length - 1];
    if (last && last.list === list && list) last.lines.push(clean);
    else blocks.push({ list, lines: [clean] });
  }
  return (
    <div className="space-y-1.5">
      {blocks.map((b, i) =>
        b.list ? (
          <ul key={i} className="list-disc space-y-0.5 pl-4">
            {b.lines.map((l, j) => (
              <li key={j}>
                <Inline text={l} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={b.lines[0]} />
          </p>
        ),
      )}
    </div>
  );
}

/** Floating help chat. Answers come from an offline FAQ (src/data/faq.ts); nothing is sent anywhere. */
export function HelpBot() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [ctx, setCtx] = useState<BotContext>({});
  const [lang, setLang] = useState<Lang>("en");
  // Set when the user picks a reply language with the EN/हिं button; otherwise it follows how they write.
  const [pinned, setPinned] = useState(false);
  const [input, setInput] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  // The floating button stays hidden while a timed test runs (see lib/timedTest.ts).
  const inTimedTest = useTimedTestRunning();

  // Restore this tab's conversation.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as { msgs: Msg[]; ctx: BotContext; lang: Lang } | null;
      if (saved?.msgs?.length) {
        setMsgs(saved.msgs);
        setCtx(saved.ctx ?? {});
        setLang(saved.lang ?? "en");
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (msgs.length) sessionStorage.setItem(KEY, JSON.stringify({ msgs: msgs.slice(-40), ctx, lang }));
      else sessionStorage.removeItem(KEY);
    } catch {}
  }, [msgs, ctx, lang]);

  // The FAQ and exam data load only when the chat is first opened.
  useEffect(() => {
    if (!open || engine) return;
    import("@/lib/helpbot").then(setEngine);
  }, [open, engine]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Jump to the latest message when the chat opens; glide when a new one arrives.
  const opened = useRef(false);
  useEffect(() => {
    if (!open) {
      opened.current = false;
      return;
    }
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: opened.current ? "smooth" : "auto" });
    opened.current = true;
  }, [msgs, open, engine]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || !engine) return;
    const replyLang: Lang = pinned ? lang : engine.detectLang(q) === "hi" || (lang === "hi" && q.split(/\s+/).length <= 2) ? "hi" : "en";
    const { reply, ctx: next } = engine.answer(q, ctx, replyLang);
    setLang(replyLang);
    setCtx(next);
    setMsgs((m) => [...m, { from: "user", text: q }, { from: "bot", text: reply.text, links: reply.links, suggestions: reply.suggestions, unsure: reply.unsure }]);
    setInput("");
  };

  const reset = () => {
    setMsgs([]);
    setCtx({});
  };

  // Not on admin pages, and out of the way of the resume print view.
  if (path?.startsWith("/admin")) return null;

  const starters = engine?.STARTERS[lang] ?? [];
  const lastBot = [...msgs].reverse().find((m) => m.from === "bot");

  return (
    <div className="print:hidden">
      {!open && !inTimedTest && (
        <button
          onClick={() => {
            setOpen(true);
            track("helpbot_open");
          }}
          aria-label="Open help chat"
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-on-ink shadow-lg transition hover:opacity-90"
        >
          <MessageCircleQuestion className="h-5 w-5" />
          <span className="hidden sm:inline">Help</span>
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label="StudyClip help"
          className="fixed inset-x-0 bottom-0 z-40 flex h-[85dvh] flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-surface shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:h-[min(600px,80dvh)] sm:w-[380px] sm:rounded-2xl"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <MessageCircleQuestion className="h-5 w-5 text-brand-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">StudyClip Help</p>
              <p className="text-[11px] text-slate-500">{lang === "hi" ? "Turant jawab · Hindi ya English mein pucho" : "Instant answers · ask in English or Hindi"}</p>
            </div>
            <button onClick={() => {
                setLang(lang === "hi" ? "en" : "hi");
                setPinned(true);
              }} className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100" title="Switch reply language">
              {lang === "hi" ? "EN" : "हिं"}
            </button>
            {msgs.length > 0 && (
              <button onClick={reset} aria-label="Start over" title="Start over" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setOpen(false)} aria-label="Close help chat" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-slate-800">{GREETING[lang]}</div>
            {!engine && <div className="skeleton h-8 w-40 rounded-xl" />}
            {msgs.map((m, i) =>
              m.from === "user" ? (
                <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-3 py-2 text-on-ink">
                  {m.text}
                </div>
              ) : (
                <div key={i} className="max-w-[92%] space-y-2">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-slate-800">
                    <Body text={m.text} />
                  </div>
                  {!!m.links?.length && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          onClick={() => window.innerWidth < 640 && setOpen(false)}
                          className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="space-y-2 border-t border-slate-200 px-3 py-3">
            {engine && (
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                {(lastBot?.suggestions?.length ? lastBot.suggestions : starters).map((s) => (
                  <button key={s} onClick={() => ask(s)} className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <input
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === "hi" ? "Apna sawaal likho…" : "Type your question…"}
                aria-label="Your question"
                maxLength={300}
                className="input flex-1 py-2 text-sm"
              />
              <button type="submit" disabled={!engine || !input.trim()} aria-label="Send" className="btn-primary px-3">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
