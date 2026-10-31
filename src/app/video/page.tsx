"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { VideoLinkForm } from "@/components/VideoLinkForm";
import { YouTubePlayer, type PlayerHandle } from "@/components/YouTubePlayer";
import { saveVideo } from "@/lib/storage";
import type { Importance, VideoBreakdown } from "@/lib/types";
import { formatTime } from "@/lib/youtube";

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
  const videoId = useSearchParams().get("v");
  const [state, setState] = useState<State>({ status: "idle" });
  const [pasted, setPasted] = useState("");

  const analyse = useCallback(
    async (transcript?: string) => {
      if (!videoId) return;
      setState({ status: "loading" });
      try {
        const res = await fetch("/api/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoId, transcript }),
        });
        const json = await res.json();
        if (!res.ok) {
          setState({ status: "error", message: json.error, needsTranscript: !!json.needsTranscript });
          return;
        }
        setState({ status: "done", data: json });
        saveVideo({ videoId, title: json.title, chapters: json.chapters.length, savedAt: Date.now() });
      } catch {
        setState({ status: "error", message: "Network error. Is the server running?", needsTranscript: false });
      }
    },
    [videoId],
  );

  useEffect(() => {
    if (videoId) analyse();
    else setState({ status: "idle" });
  }, [videoId, analyse]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Video breakdown</h1>
        <p className="mt-1 text-sm text-slate-600">Paste a YouTube lecture to get chapters, crisp notes and a quiz.</p>
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

      {state.status === "error" && (
        <div className="card space-y-3">
          <p className="text-sm font-medium text-red-700">{state.message}</p>
          {state.needsTranscript && (
            <>
              <p className="text-sm text-slate-600">
                On YouTube, open the video, click <b>…more</b> under the title, then <b>Show transcript</b>. Copy all the lines and paste them here.
              </p>
              <textarea className="input h-40 font-mono text-xs" placeholder={"0:00 Welcome to today’s lecture…\n0:12 We will start with…"} value={pasted} onChange={(e) => setPasted(e.target.value)} />
              <button className="btn-primary" disabled={!pasted.trim()} onClick={() => analyse(pasted)}>
                Analyse pasted transcript
              </button>
            </>
          )}
        </div>
      )}

      {state.status === "done" && <Breakdown data={state.data} />}
    </div>
  );
}

function Breakdown({ data }: { data: VideoBreakdown }) {
  const player = useRef<PlayerHandle>(null);
  const [now, setNow] = useState(0);
  const [tab, setTab] = useState<"notes" | "quiz">("notes");
  const [importantOnly, setImportantOnly] = useState(false);
  const seek = (t: number) => {
    player.current?.seek(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chapters = importantOnly ? data.chapters.filter((c) => c.importance === "High") : data.chapters;
  const highSecs = data.chapters.filter((c) => c.importance === "High").reduce((s, c) => s + (c.end - c.start), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <YouTubePlayer ref={player} videoId={data.videoId} onTime={setNow} />
        <div>
          <h2 className="text-lg font-bold text-slate-900">{data.title}</h2>
          <p className="text-sm text-slate-500">
            {data.author && <>{data.author} · </>}
            {formatTime(data.lengthSeconds)} · {data.chapters.length} chapters · captions: {data.language}
          </p>
        </div>

        <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
          ⚡ Watch only the <b>High</b> importance chapters: <b>{formatTime(highSecs)}</b> instead of {formatTime(data.lengthSeconds)}.
        </div>

        <div className="flex gap-1 border-b border-slate-200">
          {(["notes", "quiz"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500"}`}>
              {t === "notes" ? "Notes" : `Quiz (${data.quiz.length})`}
            </button>
          ))}
        </div>

        {tab === "notes" ? (
          <div className="space-y-5">
            <div className="card">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">One-line summary</h3>
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
        ) : (
          <div className="card">
            <Quiz questions={data.quiz} mode="practice" onTimestamp={seek} />
          </div>
        )}
      </div>

      <aside className="space-y-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Chapters</h3>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={importantOnly} onChange={(e) => setImportantOnly(e.target.checked)} className="accent-brand-600" />
            Important only
          </label>
        </div>
        {chapters.map((c) => {
          const active = now >= c.start && now < c.end;
          return (
            <button key={c.start} onClick={() => seek(c.start)} className={`block w-full rounded-xl border p-3 text-left transition ${active ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white hover:border-brand-200"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-brand-700">
                  {formatTime(c.start)} – {formatTime(c.end)}
                </span>
                <span className={`chip ${IMPORTANCE_STYLE[c.importance]}`}>{c.importance}</span>
              </div>
              <div className="mt-1 font-semibold text-slate-900">{c.title}</div>
              <p className="mt-1 line-clamp-3 text-xs text-slate-600">{c.summary}</p>
            </button>
          );
        })}
        <p className="text-xs text-slate-400">Chapters, notes and quiz are generated automatically ({data.provider} engine). Always cross-check facts before an exam.</p>
      </aside>
    </div>
  );
}

function NoteList({ title, items, onSeek, tone = "brand" }: { title: string; items: { text: string; timestamp: number }[]; onSeek: (t: number) => void; tone?: "brand" | "amber" }) {
  return (
    <div className="card">
      <h3 className="mb-3 font-bold text-slate-900">{title}</h3>
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
