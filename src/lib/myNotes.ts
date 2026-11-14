"use client";

import { useSyncExternalStore } from "react";

/**
 * The student's own notebook: free-text notes, optionally tied to a topic. Browser-only
 * (localStorage), like question notes; every write fires an event so open pages refresh.
 * Text uses a tiny markdown subset: "# heading", "- bullet", "**bold**".
 */

export const MY_NOTES_KEY = "studyclip:my-notes";
const EVENT = "studyclip:my-notes-update";
export const MY_NOTE_MAX = 20000;

export interface MyNote {
  id: string;
  title: string;
  topicId?: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

let cacheRaw: string | null = null;
let cache: MyNote[] = [];
const EMPTY: MyNote[] = [];

function read(): MyNote[] {
  let raw = "";
  try {
    raw = localStorage.getItem(MY_NOTES_KEY) ?? "";
  } catch {
    return cache;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const v = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(v) ? v.filter((n) => n && typeof n.id === "string" && typeof n.body === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list: MyNote[]) {
  try {
    localStorage.setItem(MY_NOTES_KEY, JSON.stringify(list));
  } catch {
    /* storage full or unavailable */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === MY_NOTES_KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** All notes, newest edit first; null until the browser store has been read. */
export function useMyNotes(): MyNote[] | null {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated) return null;
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createNote(init: Partial<Pick<MyNote, "title" | "topicId" | "body">> = {}): MyNote {
  const now = Date.now();
  const note: MyNote = {
    id: `n${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title: init.title?.trim() || "Untitled note",
    topicId: init.topicId,
    body: (init.body ?? "").slice(0, MY_NOTE_MAX),
    createdAt: now,
    updatedAt: now,
  };
  write([...read(), note]);
  return note;
}

export function updateNote(id: string, patch: Partial<Pick<MyNote, "title" | "topicId" | "body">>) {
  write(read().map((n) => (n.id === id ? { ...n, ...patch, body: (patch.body ?? n.body).slice(0, MY_NOTE_MAX), updatedAt: Date.now() } : n)));
}

export function deleteNote(id: string) {
  write(read().filter((n) => n.id !== id));
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

/** The markdown subset as HTML, for the PDF page. */
export function noteHtml(body: string): string {
  const out: string[] = [];
  let list = false;
  for (const line of body.split("\n")) {
    const t = line.trim();
    const bullet = /^[-*•]\s+(.*)/.exec(t);
    if (bullet) {
      if (!list) out.push("<ul>");
      list = true;
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }
    if (list) out.push("</ul>");
    list = false;
    if (!t) continue;
    const h = /^(#{1,3})\s+(.*)/.exec(t);
    out.push(h ? `<h3>${inline(h[2])}</h3>` : `<p>${inline(t)}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("");
}

/**
 * Opens a clean, printable page with the given notes; the browser's print dialog has
 * "Save as PDF", so this works on phones and computers with no PDF library.
 */
export function printMyNotes(notes: MyNote[], topicName: (id?: string) => string | undefined): boolean {
  const title = notes.length === 1 ? notes[0].title : "My StudyClip notes";
  const date = (t: number) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>body{font:14px/1.6 system-ui,Segoe UI,Arial,sans-serif;max-width:720px;margin:32px auto;color:#1e293b;padding:0 16px}
article{break-inside:auto;margin-bottom:28px}article+article{border-top:1px solid #e2e8f0;padding-top:20px}
h1{font-size:22px;margin:0 0 2px}h2{font-size:19px;margin:0 0 2px}h3{font-size:15px;margin:16px 0 6px;color:#4338ca}
.meta{color:#64748b;font-size:12px;margin-bottom:12px}p{margin:6px 0}ul{margin:6px 0;padding-left:20px}li{margin:3px 0}
footer{color:#94a3b8;font-size:11px;margin-top:24px}@media print{body{margin:0 auto}}</style></head><body>
${notes.length > 1 ? `<h1>${esc(title)}</h1><div class="meta">${notes.length} notes · ${date(Date.now())}</div>` : ""}
${notes
  .map((n) => {
    const topic = topicName(n.topicId);
    return `<article><${notes.length > 1 ? "h2" : "h1"}>${esc(n.title)}</${notes.length > 1 ? "h2" : "h1"}><div class="meta">${topic ? `${esc(topic)} · ` : ""}Updated ${date(n.updatedAt)}</div>${noteHtml(n.body) || "<p><i>Empty note</i></p>"}</article>`;
  })
  .join("")}
<footer>Written with StudyClip · studyclip.netlify.app</footer>
<script>window.onload=()=>setTimeout(()=>print(),300)</script></body></html>`;
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}

/** Plain-text version of a note for the .txt download. */
export function noteText(n: MyNote, topic?: string): string {
  return [n.title, topic ? `Topic: ${topic}` : "", "", n.body, "", "Written with StudyClip"].filter((l, i) => i !== 1 || l).join("\n");
}
