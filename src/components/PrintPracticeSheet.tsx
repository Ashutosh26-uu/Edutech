"use client";

import { Printer, X } from "lucide-react";
import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/data/site";
import { loadTopicBank } from "@/lib/bank";
import type { Difficulty, MCQ } from "@/lib/types";

/**
 * "Print practice sheet" on a topic page: picks 10, 20 or 30 questions from the topic's bank (loaded
 * in the browser) in a chosen difficulty mix and opens a clean A4 page for the browser's print or
 * "Save as PDF". Questions first, then the answer key with short explanations on its own page.
 */

const COUNTS = [10, 20, 30] as const;
const TIERS: Difficulty[] = ["easy", "moderate", "hard", "very-hard"];
const MIXES = {
  balanced: { label: "Balanced", share: [0.3, 0.4, 0.2, 0.1] },
  easier: { label: "Easier", share: [0.5, 0.4, 0.1, 0] },
  harder: { label: "Harder", share: [0, 0.3, 0.45, 0.25] },
} as const;
type Mix = keyof typeof MIXES;
const LETTERS = "ABCDEFGH";

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Picks `count` questions in the mix's proportions, topping up from other tiers when one runs short; easy first. */
export function pickSheet(bank: MCQ[], count: number, mix: Mix): MCQ[] {
  const byTier = TIERS.map((t) => shuffle(bank.filter((q) => (q.difficulty ?? "moderate") === t)));
  const want = MIXES[mix].share.map((s) => Math.round(s * count));
  const picked: MCQ[] = [];
  TIERS.forEach((_, i) => picked.push(...byTier[i].splice(0, want[i])));
  // Top up (or trim) to exactly `count`, preferring the tiers the mix leans on.
  const order = TIERS.map((_, i) => i).sort((a, b) => MIXES[mix].share[b] - MIXES[mix].share[a]);
  for (const i of order) while (picked.length < count && byTier[i].length) picked.push(byTier[i].shift()!);
  const rank = (q: MCQ) => TIERS.indexOf(q.difficulty ?? "moderate");
  return picked.slice(0, count).sort((a, b) => rank(a) - rank(b));
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Question text with ``` code blocks kept as monospaced blocks and line breaks kept. */
function rich(text: string): string {
  return text
    .split("```")
    .map((part, i) => (i % 2 ? `<pre>${esc(part.replace(/^[a-z+#]*\n/i, "").replace(/\n$/, ""))}</pre>` : esc(part.replace(/^\n|\n$/g, "")).replace(/\n/g, "<br>")))
    .join("");
}

/** The first sentence or two of an explanation, about 220 characters at most. */
function short(text: string): string {
  const plain = text.replace(/```[\s\S]*?```/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= 220) return plain;
  const cut = plain.slice(0, 220);
  const stop = cut.lastIndexOf(". ");
  return stop > 80 ? cut.slice(0, stop + 1) : `${cut.replace(/\s+\S*$/, "")}…`;
}

export function sheetHtml(topicName: string, qs: MCQ[], mixLabel: string): string {
  const site = SITE_URL.replace(/^https?:\/\//, "");
  const shortOpts = (q: MCQ) => q.options.every((o) => o.length <= 28 && !o.includes("\n"));
  const questions = qs
    .map(
      (q) => `<li class="q"><div class="qt">${rich(q.question)}</div><ol class="opts${shortOpts(q) ? " grid" : ""}">${q.options.map((o, k) => `<li><b>(${LETTERS[k]})</b> ${esc(o)}</li>`).join("")}</ol></li>`,
    )
    .join("");
  const key = qs.map((q, n) => `<span><b>${n + 1}.</b> ${LETTERS[q.answer]}</span>`).join("");
  const solutions = qs.map((q, n) => `<li><b>${n + 1}. (${LETTERS[q.answer]}) ${esc(q.options[q.answer])}</b> ${esc(short(q.explanation))}</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(topicName)} – practice sheet</title>
<style>
@page{size:A4;margin:16mm 14mm 18mm}
*{box-sizing:border-box}
body{font:12.5px/1.5 system-ui,"Segoe UI",Arial,"Noto Sans Devanagari",sans-serif;color:#0f172a;margin:0 auto;max-width:182mm;padding:0 4mm}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0f172a;padding-bottom:6px;margin-bottom:10px}
h1{font-size:18px;margin:0}h2{font-size:15px;margin:0 0 8px}
.meta{font-size:11px;color:#475569}
.fill{display:flex;gap:18px;font-size:11.5px;margin:0 0 12px}.fill span{flex:1;border-bottom:1px solid #94a3b8;padding-bottom:2px}
ol.qs{padding-left:22px;margin:0}
li.q{margin:0 0 12px;break-inside:avoid;page-break-inside:avoid}
.qt{font-weight:600;margin-bottom:4px}
ol.opts{list-style:none;padding:0;margin:0}ol.opts li{margin:1px 0}
ol.opts.grid{display:grid;grid-template-columns:1fr 1fr;column-gap:16px}
pre{font:11.5px/1.4 Consolas,monospace;background:#f1f5f9;padding:6px 8px;border-radius:4px;white-space:pre-wrap;margin:4px 0;font-weight:400}
.answers{break-before:page;page-break-before:always}
.key{display:grid;grid-template-columns:repeat(5,1fr);gap:4px 12px;border:1px solid #cbd5e1;border-radius:6px;padding:8px 10px;margin-bottom:12px}
ol.sol{list-style:none;padding:0;margin:0}ol.sol li{margin:0 0 7px;break-inside:avoid}
footer{position:fixed;bottom:0;left:0;right:0;text-align:center;font-size:10px;color:#64748b}
@media screen{body{padding:24px 16px 48px}footer{position:static;margin-top:24px}.answers{margin-top:32px;border-top:2px dashed #cbd5e1;padding-top:16px}}
</style></head><body>
<header><div><h1>${esc(topicName)}: practice sheet</h1><div class="meta">${qs.length} questions · ${esc(mixLabel)} difficulty · ${SITE_NAME}</div></div><div class="meta">Answers on the last page</div></header>
<div class="fill"><span>Name:</span><span>Date:</span><span>Score: &nbsp;&nbsp;&nbsp;/ ${qs.length}</span></div>
<ol class="qs">${questions}</ol>
<section class="answers"><h2>Answer key</h2><div class="key">${key}</div><h2>Short explanations</h2><ol class="sol">${solutions}</ol></section>
<footer>Practise more free questions at ${esc(site)}</footer>
<script>window.onload=()=>setTimeout(()=>print(),400)</script></body></html>`;
}

export function PrintPracticeSheet({ topicId, topicName }: { topicId: string; topicName: string }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number>(20);
  const [mix, setMix] = useState<Mix>("balanced");
  const [error, setError] = useState("");

  const print = async () => {
    setError("");
    // Open the window inside the click so pop-up blockers allow it, then fill it once the bank loads.
    const w = window.open("", "_blank");
    if (!w) {
      setError("Your browser blocked the new window. Allow pop-ups for this site and try again.");
      return;
    }
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Preparing…</title><p style="font:14px system-ui;padding:24px">Preparing your practice sheet…</p>`);
    try {
      const bank = await loadTopicBank(topicId);
      if (!bank.length) throw new Error("empty");
      const qs = pickSheet(bank, count, mix);
      w.document.open();
      w.document.write(sheetHtml(topicName, qs, MIXES[mix].label));
      w.document.close();
    } catch {
      w.close();
      setError("Couldn't load the questions. Check your connection and try again.");
    }
  };

  if (!open)
    return (
      <button type="button" className="btn-ghost mt-2 w-full" onClick={() => setOpen(true)}>
        <Printer className="h-4 w-4" /> Print practice sheet
      </button>
    );

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-slate-200 p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900">Print practice sheet</span>
        <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <fieldset>
        <legend className="mb-1 text-xs font-medium text-slate-500">Questions</legend>
        <div className="flex gap-1.5">
          {COUNTS.map((c) => (
            <button key={c} type="button" onClick={() => setCount(c)} aria-pressed={count === c} className={`flex-1 rounded-lg border px-2 py-1.5 font-medium ${count === c ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}>
              {c}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-xs font-medium text-slate-500">Difficulty mix</legend>
        <div className="flex gap-1.5">
          {(Object.keys(MIXES) as Mix[]).map((m) => (
            <button key={m} type="button" onClick={() => setMix(m)} aria-pressed={mix === m} className={`flex-1 rounded-lg border px-2 py-1.5 font-medium ${mix === m ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}>
              {MIXES[m].label}
            </button>
          ))}
        </div>
      </fieldset>
      <button type="button" className="btn-primary w-full" onClick={print}>
        <Printer className="h-4 w-4" /> Open printable sheet
      </button>
      <p className="text-xs text-slate-500">A4 page with numbered questions; the answer key and short explanations print on a separate last page. Use “Save as PDF” to keep a copy.</p>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
