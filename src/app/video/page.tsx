"use client";

import { ClipboardPaste, Download, ExternalLink, Layers, NotebookPen, Printer, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { SpeakButton } from "@/components/Speak";
import { VideoLinkForm } from "@/components/VideoLinkForm";
import { YouTubePlayer, type PlayerHandle } from "@/components/YouTubePlayer";
import { api } from "@/lib/api";
import { cardsForVideo } from "@/lib/cards";
import { downloadText, myNotesMarkdown, notesMarkdown, printNotes } from "@/lib/exportNotes";
import { addCards, addVideoNote, deleteVideoNote, forgetTranscript, pastedTranscript, rememberTranscript, saveVideo } from "@/lib/storage";
import type { Chapter, Importance, TranscriptLine, VideoBreakdown } from "@/lib/types";
import { useStore } from "@/lib/useStore";
import { formatTime, parsePastedTranscript } from "@/lib/youtube";

export default function VideoPage() {
  return (
    <Suspense>
      <VideoView />
    </Suspense>
  );
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string; needsTranscript: boolean }
  | { status: "done"; data: VideoBreakdown };

const IMPORTANCE_STYLE: Record<Importance, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-slate-100 text-slate-600",
};

function VideoView() {
  const params = useSearchParams();
  const videoId = params.get("v");
  const startAt = Number(params.get("t")) || 0;
  const [state, setState] = useState<State>({ status: "idle" });
  const [pasted, setPasted] = useState("");
  // True when the breakdown on screen came from a transcript pasted earlier in this browser.
  const [fromSaved, setFromSaved] = useState(false);
  // Watching without a transcript: the player and the user's own timestamped notes only.
  const [mode, setMode] = useState<"auto" | "watch" | "paste">("auto");
  const store = useStore();
  const hasOwnNotes = !!videoId && (store?.videoNotes[videoId]?.length ?? 0) > 0;

  const analyse = useCallback(
    async (typed?: string) => {
      if (!videoId) return;
      setState({ status: "loading" });
      // A transcript pasted for this video before is reused, so nobody pastes the same one twice.
      const saved = typed ? undefined : pastedTranscript(videoId);
      const transcript = typed ?? saved;
      try {
        const { ok, json } = await api("video", { url: videoId, transcript });
        if (!ok) {
          if (saved) forgetTranscript(videoId);
          setState({ status: "error", message: json.error, needsTranscript: !!json.needsTranscript });
          return;
        }
        if (typed) rememberTranscript(videoId, typed);
        setFromSaved(!!saved);
        setState({ status: "done", data: { ...json, transcript: json.transcript ?? [] } });
        saveVideo({ videoId, title: json.title, chapters: json.chapters.length, savedAt: Date.now() });
      } catch {
        setState({ status: "error", message: "Network error. Is the server running?", needsTranscript: false });
      }
    },
    [videoId],
  );

  useEffect(() => {
    setMode("auto");
    if (videoId) analyse();
    else setState({ status: "idle" });
  }, [videoId, analyse]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Video breakdown</h1>
        <p className="mt-1 text-sm text-slate-600">Paste a YouTube lecture to get chapters, notes, a live transcript and a quiz.</p>
        <div className="mt-4 max-w-3xl">
          <VideoLinkForm key={videoId ?? ""} initial={videoId ? `https://www.youtube.com/watch?v=${videoId}` : ""} />
        </div>
      </div>

      {state.status === "loading" && (
        <div className="card flex items-center gap-3 text-sm text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          Reading the transcript and finding topics…
        </div>
      )}

      {state.status === "error" && !state.needsTranscript && (
        <div className="card">
          <p className="text-sm font-medium text-red-700">{state.message}</p>
        </div>
      )}
      {state.status === "error" &&
        state.needsTranscript &&
        videoId &&
        // A video the user already took notes on without a transcript opens straight in that mode.
        (mode === "watch" || (mode === "auto" && hasOwnNotes) ? (
          <WatchOnly videoId={videoId} startAt={startAt} onPaste={() => setMode("paste")} />
        ) : (
          <PasteTranscript
            videoId={videoId}
            message={state.message}
            pasted={pasted}
            setPasted={setPasted}
            onAnalyse={() => analyse(pasted)}
            onWatch={() => {
              setMode("watch");
              saveVideo({ videoId, title: "YouTube lecture (my notes)", chapters: 0, savedAt: Date.now() });
            }}
          />
        ))}

      {state.status === "done" && fromSaved && videoId && (
        <p className="text-xs text-slate-500">
          Using the transcript you pasted earlier.{" "}
          <button
            className="font-medium text-brand-700 hover:underline"
            onClick={() => {
              forgetTranscript(videoId);
              setPasted("");
              setFromSaved(false);
              analyse();
            }}
          >
            Paste a different one
          </button>
        </p>
      )}
      {state.status === "done" && <Breakdown data={state.data} startAt={startAt} />}
    </div>
  );
}

/**
 * Shown when the server can't read a video's captions (YouTube often blocks cloud servers):
 * step-by-step help to copy the transcript from YouTube, then the same breakdown runs on it.
 */
function PasteTranscript({
  videoId,
  message,
  pasted,
  setPasted,
  onAnalyse,
  onWatch,
}: {
  videoId: string;
  message: string;
  pasted: string;
  setPasted: (s: string) => void;
  onAnalyse: () => void;
  onWatch: () => void;
}) {
  const lines = useMemo(() => (pasted.trim() ? parsePastedTranscript(pasted) : []), [pasted]);
  const [clipError, setClipError] = useState("");
  const fromClipboard = async () => {
    setClipError("");
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) setPasted(text);
      else setClipError("Your clipboard is empty. Copy the transcript on YouTube first.");
    } catch {
      setClipError("Your browser didn’t allow reading the clipboard. Click in the box below and press Ctrl+V (or long-press → Paste).");
    }
  };
  const tooShort = lines.length > 0 && lines.length < 3;

  return (
    <div className="card space-y-4">
      <div>
        <p className="font-semibold text-slate-900">One more step: paste the transcript</p>
        <p className="mt-1 text-sm text-slate-600">
          {message} Copy the transcript from YouTube and paste it below. You get the same chapters, notes and quiz.
        </p>
      </div>
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
        <li>
          Open the video on YouTube{" "}
          <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline">
            (open it here <ExternalLink className="h-3.5 w-3.5" />)
          </a>
          .
        </li>
        <li>
          Under the title, click <b>…more</b>, scroll down and click <b>Show transcript</b>.
        </li>
        <li>
          In the transcript panel, click just before the first line, scroll to the end, then <b>Shift + click</b> after the last line to select it all. Press <b>Ctrl + C</b> (<b>⌘ + C</b> on Mac).
        </li>
        <li>Come back here and paste it in the box.</li>
      </ol>
      <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
        On a phone the YouTube app doesn’t let you copy the transcript. Open YouTube in your browser, switch to the desktop site, or do this step on a computer.
      </p>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-ghost" onClick={fromClipboard}>
            <ClipboardPaste className="h-4 w-4" /> Paste from clipboard
          </button>
          {lines.length > 0 && (
            <span className={`text-xs ${tooShort ? "text-amber-700" : "text-emerald-700"}`}>
              {tooShort ? "That looks too short. Copy the whole transcript." : `${lines.length} transcript lines found${lines[0].start === 0 && lines.every((l) => l.dur === 10) ? " (no timestamps: times are estimated)" : ""}`}
            </span>
          )}
        </div>
        {clipError && <p className="text-xs text-red-700">{clipError}</p>}
        <textarea
          className="input h-40 font-mono text-xs"
          aria-label="Video transcript"
          placeholder={"0:00 Welcome to today’s lecture…\n0:12 We will start with…"}
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
        />
      </div>
      <button className="btn-primary" disabled={lines.length < 3} onClick={onAnalyse}>
        Break it down
      </button>

      <details className="rounded-xl border border-slate-200 p-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-900">Can’t find “Show transcript” on YouTube?</summary>
        <div className="mt-2 space-y-2 text-slate-600">
          <p>Then this video has no captions, so there is no transcript to copy. You can still study it:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <b>Watch and take notes</b>: play it here at your speed and write notes that remember the time in the video.
            </li>
            <li>
              <b>Paste any text about the lecture</b> in the box above (your own notes, the teacher’s handout, the video description). Notes and a quiz are made from it; chapter times are estimated.
            </li>
            <li>
              Search the topic on <Link href="/learn" className="font-medium text-brand-700 hover:underline">Learn</Link> for ready notes and practice, or pick another lecture on the same topic that has captions.
            </li>
          </ul>
          <button type="button" className="btn-ghost" onClick={onWatch}>
            <NotebookPen className="h-4 w-4" /> Watch and take notes
          </button>
        </div>
      </details>
    </div>
  );
}

/** A video with no transcript: the player, speed control and the user's own timestamped notes. */
function WatchOnly({ videoId, startAt, onPaste }: { videoId: string; startAt: number; onPaste: () => void }) {
  const player = useRef<PlayerHandle>(null);
  const [now, setNow] = useState(0);
  const [speed, setSpeed] = useState(1);
  const store = useStore();
  const myNotes = store?.videoNotes[videoId] ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <YouTubePlayer ref={player} videoId={videoId} start={startAt} onTime={setNow} />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpeed(s);
                player.current?.setRate(s);
              }}
              className={`px-2 py-1.5 font-semibold ${speed === s ? "bg-ink text-on-ink" : "bg-surface text-slate-600 hover:bg-slate-50"}`}
            >
              {s}×
            </button>
          ))}
        </div>
        <button className="btn-ghost ml-auto px-3 py-1.5 text-xs" disabled={!myNotes.length} onClick={() => downloadText("my-lecture-notes.md", myNotesMarkdown(videoId, myNotes))}>
          <Download className="h-3.5 w-3.5" /> Download my notes
        </button>
      </div>
      <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
        This video has no transcript, so there are no automatic chapters or quiz. Write notes as you watch: each one remembers the time, and tapping the time jumps back to it.
{" "}
        <button className="font-medium underline" onClick={onPaste}>
          I have a transcript to paste
        </button>
      </div>
      <MyNotes videoId={videoId} notes={myNotes} getTime={() => now} onSeek={(t) => player.current?.seek(t)} />
    </div>
  );
}

type Tab = "notes" | "transcript" | "mynotes" | "quiz";
const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

/** In smart play, returns where to jump if `t` is outside every High chapter (or null to keep playing). */
function smartPlayTarget(t: number, chapters: Chapter[]): number | null {
  const high = chapters.filter((c) => c.importance === "High");
  if (!high.length || high.some((c) => t >= c.start && t < c.end - 0.5)) return null;
  return high.find((c) => c.start > t)?.start ?? null;
}

function Breakdown({ data, startAt }: { data: VideoBreakdown; startAt: number }) {
  const player = useRef<PlayerHandle>(null);
  const [now, setNow] = useState(0);
  const [tab, setTab] = useState<Tab>("notes");
  const [importantOnly, setImportantOnly] = useState(false);
  const [smartPlay, setSmartPlay] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [flash, setFlash] = useState("");
  const store = useStore();
  const myNotes = store?.videoNotes[data.videoId] ?? [];

  const seek = (t: number, scroll = true) => {
    player.current?.seek(t);
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onTime = useCallback(
    (t: number) => {
      setNow(t);
      if (!smartPlay) return;
      const target = smartPlayTarget(t, data.chapters);
      if (target !== null) player.current?.seek(target);
    },
    [smartPlay, data.chapters],
  );

  const toast = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2500);
  };

  const chapters = importantOnly ? data.chapters.filter((c) => c.importance === "High") : data.chapters;
  const highSecs = data.chapters.filter((c) => c.importance === "High").reduce((s, c) => s + (c.end - c.start), 0);
  const quizCards = cardsForVideo(data.videoId, data.title, data.quiz);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <YouTubePlayer ref={player} videoId={data.videoId} start={startAt} onTime={onTime} />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={() => {
              setSmartPlay(!smartPlay);
              if (!smartPlay) {
                const first = data.chapters.find((c) => c.importance === "High");
                if (first && smartPlayTarget(now, data.chapters) !== null) player.current?.seek(first.start);
              }
            }}
            className={`btn px-3 py-1.5 text-xs ${smartPlay ? "bg-ink text-on-ink" : "border border-slate-200 bg-surface text-slate-700 hover:bg-slate-100"}`}
            title="Automatically skip everything except High-importance chapters"
          >
            <Zap className="h-3.5 w-3.5" /> Smart play {smartPlay ? "on" : "off"}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  player.current?.setRate(s);
                }}
                className={`px-2 py-1.5 font-semibold ${speed === s ? "bg-ink text-on-ink" : "bg-surface text-slate-600 hover:bg-slate-50"}`}
              >
                {s}×
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-1">
            <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => downloadText(`${data.title.replace(/[^\w\s-]/g, "").slice(0, 60) || "notes"}.md`, notesMarkdown(data, myNotes))}>
              <Download className="h-3.5 w-3.5" /> Markdown
            </button>
            <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => printNotes(data, myNotes)}>
              <Printer className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">{data.title}</h2>
          <p className="text-sm text-slate-500">
            {data.author && <>{data.author} · </>}
            {formatTime(data.lengthSeconds)} · {data.chapters.length} chapters · captions: {data.language}
          </p>
        </div>

        <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
          The <b>High</b> importance chapters take <b>{formatTime(highSecs)}</b> instead of {formatTime(data.lengthSeconds)}
          {speed > 1 && <> (about <b>{formatTime(highSecs / speed)}</b> at {speed}×)</>}. Turn on <b>Smart play</b> to watch only those parts.
        </div>

        {flash && <div className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{flash}</div>}

        <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
          {(
            [
              ["notes", "Notes"],
              ["transcript", "Transcript"],
              ["mynotes", `My notes (${myNotes.length})`],
              ["quiz", `Quiz (${data.quiz.length})`],
            ] as [Tab, string][]
          ).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm font-semibold ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "notes" && (
          <div className="space-y-5">
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">One-line summary</h3>
                <SpeakButton text={[data.notes.oneLine, ...data.notes.keyPoints.map((k) => k.text)].join(" ")} label="Listen to notes" />
              </div>
              <p className="mt-1 text-slate-800">{data.notes.oneLine}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {data.notes.keywords.map((k) => (
                  <span key={k} className="chip bg-slate-100 text-slate-700">{k}</span>
                ))}
              </div>
            </div>
            <NoteList title="Key points" items={data.notes.keyPoints} onSeek={seek} />
            {data.notes.facts.length > 0 && <NoteList title="Important facts and definitions" items={data.notes.facts} onSeek={seek} tone="amber" />}
          </div>
        )}

        {tab === "transcript" && <Transcript lines={data.transcript} now={now} onSeek={(t) => seek(t, false)} />}

        {tab === "mynotes" && <MyNotes videoId={data.videoId} notes={myNotes} getTime={() => player.current?.currentTime() ?? now} onSeek={seek} />}

        {tab === "quiz" && (
          <div className="card space-y-4">
            {quizCards.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                <span className="text-slate-600">Remember these for the long term with spaced repetition.</span>
                <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => toast(`Added ${addCards(quizCards)} new flashcards. Review them in Flashcards.`)}>
                  <Layers className="h-3.5 w-3.5" /> Save as flashcards
                </button>
              </div>
            )}
            <Quiz questions={data.quiz} mode="practice" onTimestamp={seek} />
          </div>
        )}
      </div>

      <aside className="space-y-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Chapters</h3>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={importantOnly} onChange={(e) => setImportantOnly(e.target.checked)} className="accent-brand-600" />
            Important only
          </label>
        </div>
        {chapters.map((c) => {
          const active = now >= c.start && now < c.end;
          const pct = active ? Math.min(100, ((now - c.start) / (c.end - c.start)) * 100) : now >= c.end ? 100 : 0;
          return (
            <button key={c.start} onClick={() => seek(c.start)} className={`block w-full overflow-hidden rounded-xl border text-left transition ${active ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-surface hover:border-brand-200"}`}>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-brand-700">
                    {formatTime(c.start)} – {formatTime(c.end)}
                  </span>
                  <span className={`chip ${IMPORTANCE_STYLE[c.importance]}`}>{c.importance}</span>
                </div>
                <div className="mt-1 font-semibold text-slate-900">{c.title}</div>
                <p className="mt-1 line-clamp-3 text-xs text-slate-600">{c.summary}</p>
              </div>
              <div className="h-1 bg-slate-100">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
        <p className="text-xs text-slate-400">Chapters, notes and quiz are generated automatically ({data.provider} engine). Always cross-check facts before an exam.</p>
      </aside>
    </div>
  );
}

/** Live transcript: follows the video, searchable, click any line to jump there. */
function Transcript({ lines, now, onSeek }: { lines: TranscriptLine[]; now: number; onSeek: (t: number) => void }) {
  const [q, setQ] = useState("");
  const [follow, setFollow] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const activeIdx = useMemo(() => {
    let i = -1;
    for (let k = 0; k < lines.length && lines[k].start <= now; k++) i = k;
    return i;
  }, [lines, now]);
  const query = q.trim().toLowerCase();
  const matches = query ? lines.filter((l) => l.text.toLowerCase().includes(query)).length : 0;

  useEffect(() => {
    if (!follow || query || activeIdx < 0 || !box.current) return;
    const el = box.current.querySelector<HTMLElement>(`[data-i="${activeIdx}"]`);
    if (el) box.current.scrollTo({ top: el.offsetTop - box.current.clientHeight / 3, behavior: "smooth" });
  }, [activeIdx, follow, query]);

  if (!lines.length) return <p className="card text-sm text-slate-500">No transcript available.</p>;

  const highlight = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"));
    return parts.map((p, i) => (i % 2 ? <mark key={i} className="rounded bg-amber-200 px-0.5 text-slate-900">{p}</mark> : p));
  };

  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input flex-1" placeholder="Search the transcript…" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} className="accent-brand-600" /> Follow video
        </label>
      </div>
      {query && <p className="text-xs text-slate-500">{matches} matching lines</p>}
      <div ref={box} className="relative max-h-[28rem] space-y-0.5 overflow-y-auto pr-1">
        {lines.map((l, i) =>
          query && !l.text.toLowerCase().includes(query) ? null : (
            <button key={i} data-i={i} onClick={() => onSeek(l.start)} className={`flex w-full gap-3 rounded-lg px-2 py-1 text-left text-sm ${i === activeIdx ? "bg-brand-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}>
              <span className="w-12 shrink-0 font-mono text-xs leading-5 text-brand-700">{formatTime(l.start)}</span>
              <span>{highlight(l.text)}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function MyNotes({ videoId, notes, getTime, onSeek }: { videoId: string; notes: { id: string; t: number; text: string }[]; getTime: () => number; onSeek: (t: number) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="card space-y-3">
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addVideoNote(videoId, getTime(), text.trim());
          setText("");
        }}
      >
        <textarea className="input h-20" placeholder="Write a note. It’s saved at the video’s current time." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary" disabled={!text.trim()}>
          + Add note at {formatTime(getTime())}
        </button>
      </form>
      {notes.length ? (
        <ul className="divide-y divide-slate-100">
          {notes.map((n) => (
            <li key={n.id} className="flex items-start gap-3 py-2 text-sm">
              <button onClick={() => onSeek(n.t)} className="shrink-0 rounded-md bg-brand-100 px-1.5 py-0.5 font-mono text-xs font-medium text-brand-700">
                {formatTime(n.t)}
              </button>
              <span className="flex-1 whitespace-pre-line text-slate-700">{n.text}</span>
              <button className="text-xs text-slate-400 hover:text-red-600" onClick={() => deleteVideoNote(videoId, n.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No notes yet. Your notes are included when you export to Markdown or PDF.</p>
      )}
    </div>
  );
}

function NoteList({ title, items, onSeek, tone = "brand" }: { title: string; items: { text: string; timestamp: number }[]; onSeek: (t: number) => void; tone?: "brand" | "amber" }) {
  return (
    <div className="card">
      <h3 className="mb-3 font-semibold text-slate-900">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((k, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <button onClick={() => onSeek(k.timestamp)} className={`h-fit shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold ${tone === "amber" ? "bg-amber-100 text-amber-800" : "bg-brand-100 text-brand-700"}`}>
              {formatTime(k.timestamp)}
            </button>
            <span className="text-slate-700">{k.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
