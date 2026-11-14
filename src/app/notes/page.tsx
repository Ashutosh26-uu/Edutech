"use client";

import { ArrowLeft, Download, FileDown, FileText, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { NOTES_LOADERS } from "@/data/notes";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import { downloadText } from "@/lib/exportNotes";
import { type MyNote, MY_NOTE_MAX, createNote, deleteNote, noteText, printMyNotes, updateNote, useMyNotes } from "@/lib/myNotes";

const topicName = (id?: string) => (id ? TOPIC_BY_ID.get(id)?.name : undefined);
const when = (t: number) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const fileName = (title: string, ext: string) => `${title.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "notes"}.${ext}`;

export default function NotesPage() {
  return (
    <Suspense fallback={null}>
      <Notebook />
    </Suspense>
  );
}

function Notebook() {
  const notes = useMyNotes();
  const params = useSearchParams();
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const handled = useRef(false);

  // /notes?topic=<id> (from a topic page) opens that topic's note, creating it the first time.
  useEffect(() => {
    if (!notes || handled.current) return;
    handled.current = true;
    const topic = params.get("topic");
    if (!topic || !TOPIC_BY_ID.has(topic)) return;
    const existing = notes.find((n) => n.topicId === topic);
    setOpenId(existing ? existing.id : createNote({ title: `${topicName(topic)} – my notes`, topicId: topic }).id);
    router.replace("/notes", { scroll: false });
  }, [notes, params, router]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!notes || !q) return notes ?? [];
    return notes.filter((n) => `${n.title} ${topicName(n.topicId) ?? ""} ${n.body}`.toLowerCase().includes(q));
  }, [notes, query]);

  if (!notes) return null;
  const open = notes.find((n) => n.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        path="/notes"
        title="My notes"
        intro="Write your own notes for any topic and download them as a PDF. Notes are saved in this browser as you type."
        aside={
          <div className="flex flex-wrap gap-2">
            {notes.length > 1 && (
              <button className="btn-ghost" onClick={() => printMyNotes(notes, topicName)}>
                <FileDown className="h-4 w-4" /> All as PDF
              </button>
            )}
            <button className="btn-primary" onClick={() => setOpenId(createNote().id)}>
              <Plus className="h-4 w-4" /> New note
            </button>
          </div>
        }
      />

      {notes.length === 0 ? (
        <div className="card space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">No notes yet</p>
          <p>Start a blank note, or open any topic and tap “My notes” to write notes for it. You can fill a topic note with StudyClip’s key points in one tap and edit from there.</p>
          <button className="btn-primary" onClick={() => setOpenId(createNote().id)}>
            <Plus className="h-4 w-4" /> Write your first note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <section className={`min-w-0 space-y-3 ${open ? "hidden lg:block" : ""}`} aria-label="Your notes">
            {notes.length > 4 && (
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input className="input pl-9" placeholder="Search your notes" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            )}
            <ul className="space-y-2">
              {shown.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setOpenId(n.id)}
                    className={`card w-full text-left transition hover:border-brand-300 ${n.id === openId ? "border-brand-400 ring-1 ring-brand-400" : ""}`}
                  >
                    <span className="flex items-center gap-2 font-medium text-slate-900">
                      <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                      <span className="truncate">{n.title}</span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {topicName(n.topicId) ? `${topicName(n.topicId)} · ` : ""}
                      {when(n.updatedAt)} · {n.body.trim() ? n.body.trim().replace(/\s+/g, " ").slice(0, 80) : "Empty"}
                    </span>
                  </button>
                </li>
              ))}
              {shown.length === 0 && <li className="text-sm text-slate-500">No note matches “{query}”.</li>}
            </ul>
          </section>

          {open ? (
            <Editor key={open.id} note={open} onClose={() => setOpenId(null)} />
          ) : (
            <p className="hidden text-sm text-slate-500 lg:block">Pick a note on the left, or start a new one.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Editor({ note, onClose }: { note: MyNote; onClose: () => void }) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [topicId, setTopicId] = useState(note.topicId ?? "");
  const [saved, setSaved] = useState(true);
  const [filling, setFilling] = useState(false);
  const topics = useMemo(() => [...TOPICS].sort((a, b) => a.subject.localeCompare(b.subject) || a.name.localeCompare(b.name)), []);

  // Save shortly after typing stops.
  useEffect(() => {
    if (title === note.title && body === note.body && topicId === (note.topicId ?? "")) return;
    setSaved(false);
    const t = setTimeout(() => {
      updateNote(note.id, { title: title.trim() || "Untitled note", body, topicId: topicId || undefined });
      setSaved(true);
    }, 400);
    return () => clearTimeout(t);
  }, [title, body, topicId, note]);

  const current = (): MyNote => ({ ...note, title: title.trim() || "Untitled note", body, topicId: topicId || undefined, updatedAt: Date.now() });

  async function fillFromTopic() {
    const topic = TOPIC_BY_ID.get(topicId);
    if (!topic) return;
    setFilling(true);
    const lines = [`# Key points`, ...topic.keyPoints.map((k) => `- ${k}`)];
    try {
      const n = (await NOTES_LOADERS[topicId]?.())?.default;
      for (const s of n?.sections ?? []) lines.push("", `# ${s.heading}`, ...s.points.map((p) => `- ${p}`));
      if (n?.formulas?.length) lines.push("", "# Formulas", ...n.formulas.map((f) => `- ${f}`));
      if (n?.traps?.length) lines.push("", "# Common traps", ...n.traps.map((f) => `- ${f}`));
    } catch {
      /* offline: key points alone */
    }
    setBody((b) => (b.trim() ? `${b.trimEnd()}\n\n` : "") + lines.join("\n"));
    setFilling(false);
  }

  return (
    <section className="card min-w-0 space-y-3" aria-label="Edit note">
      <div className="flex items-center justify-between gap-2">
        <button className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 lg:hidden" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" /> All notes
        </button>
        <span className="ml-auto text-xs text-slate-500" aria-live="polite">
          {saved ? "Saved" : "Saving…"}
        </span>
      </div>
      <input className="input text-base font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" aria-label="Note title" />
      <div className="flex flex-wrap items-center gap-2">
        <select className="input min-w-0 flex-1 basis-56 text-sm" value={topicId} onChange={(e) => setTopicId(e.target.value)} aria-label="Topic">
          <option value="">No topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.subject} · {t.name}
            </option>
          ))}
        </select>
        {topicId && (
          <button className="btn-ghost text-sm" onClick={fillFromTopic} disabled={filling}>
            <Sparkles className="h-4 w-4" /> {filling ? "Adding…" : "Add StudyClip key points"}
          </button>
        )}
      </div>
      <textarea
        className="input min-h-[22rem] font-mono text-sm leading-relaxed"
        value={body}
        maxLength={MY_NOTE_MAX}
        onChange={(e) => setBody(e.target.value)}
        placeholder={"# Heading\n- A point to remember\n- **Bold** for formulas or traps"}
        aria-label="Note text"
      />
      <p className="text-xs text-slate-500">Tip: start a line with # for a heading or - for a bullet; wrap words in **double stars** for bold. The PDF keeps this formatting.</p>
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={() => printMyNotes([current()], topicName)}>
          <FileDown className="h-4 w-4" /> Download PDF
        </button>
        <button className="btn-ghost" onClick={() => downloadText(fileName(title, "txt"), noteText(current(), topicName(topicId)), "text/plain")}>
          <Download className="h-4 w-4" /> Text file
        </button>
        <button
          className="btn-ghost ml-auto text-rose-600"
          onClick={() => {
            if (confirm(`Delete “${title || "Untitled note"}”? This cannot be undone.`)) {
              deleteNote(note.id);
              onClose();
            }
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </section>
  );
}
