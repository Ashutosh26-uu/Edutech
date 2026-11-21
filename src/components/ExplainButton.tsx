"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAccount } from "@/lib/account";
import { IS_STATIC, postJson, request } from "@/lib/api";
import { explainable } from "@/lib/explainShared";
import type { Lang } from "@/lib/lang";
import { useTimedTestRunning } from "@/lib/timedTest";
import type { MCQ } from "@/lib/types";

/**
 * "Explain more": a short AI explanation of a question the student has answered, shaped by the
 * option they picked. Two parts that share one small store, so the chip can sit with Report /
 * Note / Save while the answer shows under the built-in explanation:
 *   <ExplainButton question chosen lang />   the chip
 *   <ExplainAnswer question chosen lang />   the box
 * Render them only for a question whose answer is already shown (never during a running test).
 */

type Entry = { state: "loading" } | { state: "done"; text: string } | { state: "error"; error: string } | { state: "login"; next: string };

// Answers for this page session, per question + chosen option + language: a second tap is instant.
const entries = new Map<string, Entry>();
const open = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;
const changed = () => {
  version++;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const useExplainStore = () => useSyncExternalStore(subscribe, () => version, () => 0);

// Whether the server has a model key set: asked once per page load, shared by every button.
let enabled: Promise<boolean> | null = null;
const isEnabled = () =>
  (enabled ??= IS_STATIC
    ? Promise.resolve(false)
    : request("/api/explain", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { enabled: false }))
        .then((d) => !!d.enabled)
        .catch(() => false));

const BUSY = "The AI helper is busy. Try again in a minute.";

interface Props {
  question: MCQ;
  /** The option the student picked; null when skipped. */
  chosen: number | null;
  lang: Lang;
}

const keyOf = ({ question, chosen, lang }: Props) => `${question.id}:${chosen ?? "-"}:${lang}`;

async function fetchExplanation(key: string, p: Props) {
  entries.set(key, { state: "loading" });
  changed();
  const { status, data } = await postJson<{ text?: string; code?: string }>("/api/explain", { questionId: p.question.id, chosen: p.chosen, lang: p.lang });
  if (status === 200 && data.text) entries.set(key, { state: "done", text: data.text });
  else if (status === 401) entries.set(key, { state: "login", next: location.pathname + location.search });
  // Our own clear messages (verify your email, hourly limit) are shown as they are; anything else is "busy".
  else entries.set(key, { state: "error", error: (status === 403 || status === 429) && data.error ? data.error : BUSY });
  changed();
}

/** Shown only when the AI helper is on, outside running timed tests, for bank questions whose answer is known. */
function useCanExplain(question: MCQ) {
  const [on, setOn] = useState(false);
  const timedRunning = useTimedTestRunning();
  const ok = !IS_STATIC && explainable(question);
  useEffect(() => {
    let alive = true;
    if (ok) isEnabled().then((v) => alive && setOn(v));
    return () => {
      alive = false;
    };
  }, [ok]);
  return ok && on && !timedRunning;
}

export function ExplainButton(props: Props) {
  const account = useAccount();
  useExplainStore();
  const can = useCanExplain(props.question);
  if (!can) return null;
  const key = keyOf(props);
  const entry = entries.get(key);
  const isOpen = open.has(key);

  const tap = () => {
    if (isOpen) {
      open.delete(key);
      return changed();
    }
    open.add(key);
    if (account.ready && !account.user) {
      entries.set(key, { state: "login", next: location.pathname + location.search });
      return changed();
    }
    // Cached answers show at once; errors (and a guest who has since logged in) try again.
    if (entry?.state === "done" || entry?.state === "loading") return changed();
    void fetchExplanation(key, props);
  };

  return (
    <button type="button" onClick={tap} aria-expanded={isOpen} disabled={entry?.state === "loading"} className="chip bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 pointer-coarse:min-h-10 pointer-coarse:px-3" title="Get a step-by-step AI explanation of this question">
      <Sparkles className="h-3.5 w-3.5" /> {entry?.state === "loading" ? "Explaining…" : "Explain more"}
    </button>
  );
}

export function ExplainAnswer(props: Props & { className?: string }) {
  useExplainStore();
  const can = useCanExplain(props.question);
  const key = keyOf(props);
  const entry = entries.get(key);
  if (!can || !open.has(key) || !entry) return null;

  return (
    <div className={`rounded-lg border border-slate-200 bg-surface p-3 text-sm font-normal text-slate-700 ${props.className ?? ""}`} aria-live="polite">
      {entry.state === "loading" && <p className="text-slate-500">Writing an explanation for you…</p>}
      {entry.state === "login" && (
        <Link href={`/login?next=${encodeURIComponent(entry.next)}`} className="font-medium text-brand-700 underline">
          Log in to get an AI explanation
        </Link>
      )}
      {entry.state === "error" && (
        <p className="text-slate-600">
          {entry.error}{" "}
          <button type="button" className="font-medium text-brand-700 underline" onClick={() => void fetchExplanation(key, props)}>
            Try again
          </button>
        </p>
      )}
      {entry.state === "done" && (
        <>
          <p className="text-xs text-slate-500">AI explanation · may contain mistakes, the answer key above is correct</p>
          {/* Plain text from the model: React escapes it, and pre-line keeps its line breaks and "1." steps. */}
          <p className="mt-1 whitespace-pre-line break-words" lang={props.lang === "hi" ? "hi" : undefined}>
            {entry.text}
          </p>
        </>
      )}
    </div>
  );
}
