"use client";

import { Headphones, Info, Moon, Pause, Play, SkipBack, SkipForward, Sun } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXAM_BY_ID } from "@/data/exams";
import { buildPlaylist, examTopicList, STARTER_TOPICS, weakTopicIds, type PlaylistSource, type Track } from "@/lib/revisionAudio";
import { useStore } from "@/lib/useStore";

const HINDI = /[ऀ-ॿ]/;
const RATES = [0.8, 0.9, 1, 1.1, 1.25, 1.5];
const SLEEP = [0, 15, 30] as const;

function pickVoice(hindi: boolean): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  return hindi ? voices.find((v) => v.lang.toLowerCase().startsWith("hi")) : (voices.find((v) => v.lang === "en-IN") ?? voices.find((v) => v.lang.startsWith("en")));
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Commute-friendly revision: reads the key points and short notes of weak or due topics aloud, one after another. */
export function AudioRevision() {
  const store = useStore();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [hasHindiVoice, setHasHindiVoice] = useState(true);
  const [source, setSource] = useState<PlaylistSource | null>(null);
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [pos, setPos] = useState({ t: 0, l: 0 });
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [hindiVoice, setHindiVoice] = useState(true);
  const [sleepAt, setSleepAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [keepAwake, setKeepAwake] = useState(false);

  // Refs mirror the state so speech callbacks always see the latest values.
  const tracksRef = useRef<Track[]>([]);
  const posRef = useRef(pos);
  const rateRef = useRef(rate);
  const hindiRef = useRef(hindiVoice);
  const playingRef = useRef(false);
  const tokenRef = useRef(0);
  const lockRef = useRef<WakeLockSentinel | null>(null);

  const weak = useMemo(() => (store ? weakTopicIds(store) : []), [store]);
  const examIds = useMemo(() => (store ? examTopicList(store) : []), [store]);
  const exam = store?.examId ? EXAM_BY_ID.get(store.examId) : undefined;
  const chosen: PlaylistSource = source ?? (weak.length ? "weak" : examIds.length ? "exam" : "starter");
  const ids = chosen === "weak" ? weak : chosen === "exam" ? examIds : STARTER_TOPICS;
  const idsKey = ids.join(",");

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(ok);
    if (!ok) return;
    const check = () => {
      const v = speechSynthesis.getVoices();
      setHasHindiVoice(!v.length || v.some((x) => x.lang.toLowerCase().startsWith("hi")));
    };
    check();
    speechSynthesis.addEventListener("voiceschanged", check);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", check);
      tokenRef.current++;
      speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    tokenRef.current++;
    playingRef.current = false;
    setPlaying(false);
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }, []);

  // A new list of topics: stop, rebuild the lines and start from the top.
  useEffect(() => {
    if (!store) return;
    let alive = true;
    stop();
    setTracks(null);
    buildPlaylist(idsKey ? idsKey.split(",") : []).then((list) => {
      if (!alive) return;
      tracksRef.current = list;
      posRef.current = { t: 0, l: 0 };
      setPos({ t: 0, l: 0 });
      setTracks(list);
    });
    return () => {
      alive = false;
    };
    // `store` changes on every save; only the topic list matters here.
  }, [idsKey, !!store, stop]);

  const speak = useCallback(() => {
    const list = tracksRef.current;
    const { t, l } = posRef.current;
    const track = list[t];
    if (!track) return stop();
    const text = track.lines[l];
    const token = ++tokenRef.current;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const hindi = HINDI.test(text) && hindiRef.current;
    u.lang = hindi ? "hi-IN" : "en-IN";
    const v = pickVoice(hindi);
    if (v) u.voice = v;
    u.rate = rateRef.current;
    const advance = () => {
      if (token !== tokenRef.current || !playingRef.current) return;
      const cur = posRef.current;
      const tr = tracksRef.current[cur.t];
      let next = { t: cur.t, l: cur.l + 1 };
      if (!tr || next.l >= tr.lines.length) next = { t: cur.t + 1, l: 0 };
      if (next.t >= tracksRef.current.length) {
        posRef.current = { t: 0, l: 0 };
        setPos({ t: 0, l: 0 });
        stop();
        return;
      }
      posRef.current = next;
      setPos(next);
      speak();
    };
    u.onend = advance;
    u.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") advance();
    };
    speechSynthesis.speak(u);
  }, [stop]);

  const play = () => {
    if (!tracksRef.current.length) return;
    playingRef.current = true;
    setPlaying(true);
    speak();
  };

  const jump = (t: number) => {
    const list = tracksRef.current;
    if (!list.length) return;
    const next = { t: Math.max(0, Math.min(list.length - 1, t)), l: 0 };
    posRef.current = next;
    setPos(next);
    if (playingRef.current) speak();
  };

  const changeRate = (r: number) => {
    rateRef.current = r;
    setRate(r);
    if (playingRef.current) speak(); // restart the current line at the new speed
  };

  const toggleHindi = () => {
    hindiRef.current = !hindiRef.current;
    setHindiVoice(hindiRef.current);
  };

  // Sleep timer.
  useEffect(() => {
    if (!sleepAt) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= sleepAt) {
        stop();
        setSleepAt(null);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [sleepAt, stop]);

  // Lock-screen and headset buttons, where the browser shows them.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !tracks?.length) return;
    const ms = navigator.mediaSession;
    try {
      ms.metadata = new MediaMetadata({ title: tracks[pos.t]?.name ?? "Revision", artist: "StudyClip audio revision" });
      ms.playbackState = playing ? "playing" : "paused";
      ms.setActionHandler("play", () => play());
      ms.setActionHandler("pause", () => stop());
      ms.setActionHandler("nexttrack", () => jump(posRef.current.t + 1));
      ms.setActionHandler("previoustrack", () => jump(posRef.current.t - 1));
    } catch {
      /* some browsers support only part of the Media Session API */
    }
  }, [tracks, pos.t, playing]);

  // Optional: keep the screen on, for phones that stop speech when locked.
  useEffect(() => {
    if (!keepAwake || !("wakeLock" in navigator)) return;
    let released = false;
    const request = () =>
      navigator.wakeLock
        .request("screen")
        .then((l) => {
          if (released) l.release();
          else lockRef.current = l;
        })
        .catch(() => setKeepAwake(false));
    request();
    const onVisible = () => document.visibilityState === "visible" && request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisible);
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
    };
  }, [keepAwake]);

  if (!store || supported === null) return null;

  const track = tracks?.[pos.t];
  const line = track?.lines[pos.l];
  const progress = track ? Math.round(((pos.l + 1) / track.lines.length) * 100) : 0;
  const sleepLeft = sleepAt ? sleepAt - now : 0;
  const canWake = typeof navigator !== "undefined" && "wakeLock" in navigator;

  return (
    <div className="space-y-5">
      <PageHeader
        path="/listen"
        title={
          <span className="flex items-center gap-2">
            <Headphones className="h-6 w-6 text-brand-600" aria-hidden /> Audio revision
          </span>
        }
        intro="Revise while you travel: your phone reads out the key points of the topics you need most, one after another. Put on earphones and press play."
      />

      {!supported ? (
        <div className="card space-y-3 text-sm text-slate-700">
          <p>This browser can’t read text aloud. Try Chrome, Edge or Safari on a recent phone or computer, or read the same notes yourself.</p>
          <Link href="/topics" className="btn-primary">
            Read topic notes
          </Link>
        </div>
      ) : (
        <>
          <section className="card space-y-4">
            <div className="flex flex-wrap gap-1.5 text-sm" role="radiogroup" aria-label="What to revise">
              {(
                [
                  ["weak", `Weak & due topics${weak.length ? ` (${weak.length})` : ""}`, weak.length > 0],
                  ["exam", exam ? `${exam.name} syllabus` : "My exam syllabus", examIds.length > 0],
                  ["starter", "General studies", true],
                ] as const
              ).map(([id, label, enabled]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={chosen === id}
                  disabled={!enabled}
                  onClick={() => setSource(id)}
                  className={`rounded-lg border px-3 py-1.5 font-medium disabled:opacity-40 ${chosen === id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {!weak.length && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                <p>
                  Weak topics appear once you’ve answered at least 5 questions in a topic. {exam ? "Until then, listen to your exam’s syllabus." : "Choose your exam to revise its syllabus."}
                </p>
                <Link href={exam ? `/practice?exam=${exam.id}&smart=1` : "/exams"} className="btn-ghost px-3 py-1.5 text-xs">
                  {exam ? "Practise to find weak topics" : "Choose your exam"}
                </Link>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-500">{tracks ? (track ? `Topic ${pos.t + 1} of ${tracks.length}` : "Nothing to play") : "Loading notes…"}</div>
              <div className="mt-0.5 text-lg font-semibold text-slate-900">{track?.name ?? " "}</div>
              <p className="mt-2 min-h-[3rem] text-sm text-slate-700" aria-live="polite">
                {line ?? ""}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button type="button" className="btn-ghost h-11 w-11 p-0" onClick={() => jump(pos.t - 1)} disabled={!tracks?.length || pos.t === 0} aria-label="Previous topic">
                <SkipBack className="h-5 w-5" />
              </button>
              <button type="button" className="btn-primary h-14 w-14 rounded-full p-0" onClick={playing ? stop : play} disabled={!tracks?.length} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              <button type="button" className="btn-ghost h-11 w-11 p-0" onClick={() => jump(pos.t + 1)} disabled={!tracks?.length || pos.t >= tracks.length - 1} aria-label="Next topic">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <label className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Speed</span>
                <select className="input w-auto py-1.5" value={rate} onChange={(e) => changeRate(Number(e.target.value))}>
                  {RATES.map((r) => (
                    <option key={r} value={r}>
                      {r}×
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Moon className="h-4 w-4" /> Sleep timer
                </span>
                <select className="input w-auto py-1.5" value={sleepAt ? "on" : "0"} onChange={(e) => {
                  const m = Number(e.target.value);
                  setNow(Date.now());
                  setSleepAt(m ? Date.now() + m * 60_000 : null);
                }}>
                  {sleepAt && <option value="on">{fmt(sleepLeft)} left</option>}
                  {SLEEP.map((m) => (
                    <option key={m} value={m}>
                      {m ? `${m} minutes` : "Off"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Hindi voice for Hindi text</span>
                <input type="checkbox" className="h-4 w-4" checked={hindiVoice} onChange={toggleHindi} />
              </label>
              {canWake && (
                <label className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Sun className="h-4 w-4" /> Keep screen on
                  </span>
                  <input type="checkbox" className="h-4 w-4" checked={keepAwake} onChange={(e) => setKeepAwake(e.target.checked)} />
                </label>
              )}
            </div>
            {hindiVoice && !hasHindiVoice && <p className="text-xs text-amber-700">No Hindi voice is installed on this device, so Hindi lines may be skipped or read oddly. You can add one in your phone’s text-to-speech settings.</p>}
          </section>

          <section className="card">
            <h2 className="font-semibold text-slate-900">Playlist</h2>
            <ol className="mt-2 divide-y divide-slate-100 text-sm">
              {(tracks ?? []).map((t, i) => (
                <li key={t.topicId}>
                  <button type="button" onClick={() => jump(i)} className={`flex w-full items-center justify-between gap-2 py-2.5 text-left ${i === pos.t ? "font-semibold text-brand-700" : "text-slate-700 hover:text-slate-900"}`} aria-current={i === pos.t ? "true" : undefined}>
                    <span className="min-w-0">
                      {i + 1}. {t.name}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">{t.lines.length} lines</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <p className="flex gap-2 text-xs text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Uses your device’s built-in voices; nothing is uploaded. Some phones stop reading when the screen locks or the browser goes to the background. If that happens, turn on “Keep screen on” and lower the brightness.
            </span>
          </p>
        </>
      )}
    </div>
  );
}
