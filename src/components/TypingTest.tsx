"use client";

import { Keyboard, RotateCcw, Timer, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkline } from "@/components/Sparkline";
import { PASSAGES, type TypingPassage } from "@/data/typing-passages";
import { readJson, writeJson } from "@/lib/localJson";
import { awardSkillXp } from "@/lib/storage";
import { liveWpm, scoreTyping, splitWords, type DiffToken, type TypingScore } from "@/lib/typing";

type Lang = "en" | "hi";
const KEY = "studyclip:typing";
const DURATIONS = [5, 10, 15] as const;
/** Speeds commonly asked for in SSC CHSL-style skill tests. */
const TARGET: Record<Lang, number> = { en: 35, hi: 30 };
const HISTORY_KEPT = 30;

interface Run {
  at: number;
  lang: Lang;
  minutes: number;
  passageId: string;
  net: number;
  gross: number;
  accuracy: number;
  mistakes: number;
}
interface Saved {
  runs: Run[];
  best: Partial<Record<Lang, number>>;
}

/** The chosen passage, followed by the next ones in the same language until there is enough text for the time. */
function buildText(first: TypingPassage, minutes: number): string {
  const same = PASSAGES.filter((p) => p.lang === first.lang);
  const need = minutes * (first.lang === "en" ? 45 : 40);
  const parts = [first.text];
  let words = splitWords(first.text).length;
  for (let k = 1; words < need && k < same.length; k++) {
    const p = same[(same.indexOf(first) + k) % same.length];
    parts.push(p.text);
    words += splitWords(p.text).length;
  }
  return parts.join(" ");
}

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function TypingTest() {
  const [lang, setLang] = useState<Lang>("en");
  const [minutes, setMinutes] = useState<number>(10);
  const [passageId, setPassageId] = useState(PASSAGES[0].id);
  const [saved, setSaved] = useState<Saved>({ runs: [], best: {} });
  const [phase, setPhase] = useState<"setup" | "running" | "done">("setup");
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<(TypingScore & { newBest: boolean; xp: number }) | null>(null);
  const [blocked, setBlocked] = useState(false);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = readJson<Saved>(KEY, { runs: [], best: {} });
    setSaved({ runs: Array.isArray(s.runs) ? s.runs : [], best: s.best ?? {} });
  }, []);

  const choices = PASSAGES.filter((p) => p.lang === lang);
  const passage = PASSAGES.find((p) => p.id === passageId && p.lang === lang) ?? choices[0];
  const text = useMemo(() => buildText(passage, minutes), [passage, minutes]);
  const words = useMemo(() => splitWords(text), [text]);

  const elapsed = startedAt ? Math.min(minutes * 60, (now - startedAt) / 1000) : 0;
  const remaining = minutes * 60 - elapsed;

  const submit = useCallback(() => {
    const secs = startedAt ? Math.min(minutes * 60, (Date.now() - startedAt) / 1000) : 0;
    const score = scoreTyping(text, typed, secs);
    const prev = saved.best[lang] ?? 0;
    const counts = secs >= 30 && score.typedWords >= 10;
    const newBest = counts && score.netWpm > prev;
    let xp = 0;
    if (counts) {
      const run: Run = { at: Date.now(), lang, minutes, passageId: passage.id, net: score.netWpm, gross: score.grossWpm, accuracy: score.accuracy, mistakes: score.fullMistakes };
      const next: Saved = { runs: [...saved.runs, run].slice(-HISTORY_KEPT), best: { ...saved.best, [lang]: Math.max(prev, score.netWpm) } };
      writeJson(KEY, next);
      setSaved(next);
      xp = Math.min(50, Math.round(score.netWpm * Math.min(1, secs / 300)));
      awardSkillXp(xp);
    }
    setResult({ ...score, newBest, xp });
    setPhase("done");
  }, [startedAt, minutes, text, typed, saved, lang, passage.id]);

  useEffect(() => {
    if (phase !== "running" || !startedAt) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [phase, startedAt]);
  useEffect(() => {
    if (phase === "running" && startedAt && remaining <= 0) submit();
  }, [phase, startedAt, remaining, submit]);

  // Keep the word being typed in view inside the passage box.
  const typedCount = splitWords(typed).length;
  const current = typed === "" || /\s$/.test(typed) ? typedCount : Math.max(0, typedCount - 1);
  useEffect(() => {
    // Scrolls only the passage box (scrollIntoView would also move the page while typing).
    const el = currentRef.current;
    const box = passageRef.current;
    if (!el || !box) return;
    if (el.offsetTop < box.scrollTop || el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - 24);
  }, [current]);

  const begin = () => {
    setTyped("");
    setStartedAt(null);
    setResult(null);
    setPhase("running");
    setTimeout(() => boxRef.current?.focus(), 0);
  };

  const block = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBlocked(true);
  };

  if (phase === "running") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className={`inline-flex items-center gap-1.5 font-mono text-lg font-semibold tabular-nums ${remaining <= 30 && startedAt ? "text-red-600" : "text-slate-900"}`}>
              <Timer className="h-4 w-4" /> {fmtTime(Math.max(0, remaining))}
            </span>
            <span className="text-slate-600">
              <b className="tabular-nums text-slate-900">{liveWpm(typed, elapsed)}</b> wpm
            </span>
            <span className="text-slate-500">{typedCount} words</span>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={() => setPhase("setup")}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={submit} disabled={!typed.trim()}>
              Submit
            </button>
          </div>
        </div>
        {!startedAt && <p className="text-sm text-slate-600">The timer starts with your first key press.</p>}
        <div ref={passageRef} lang={lang} className="card relative max-h-56 overflow-y-auto text-base leading-relaxed text-slate-800 select-none sm:max-h-64" aria-label="Passage to type">
          {words.map((w, i) => (
            <span key={i} ref={i === current ? currentRef : undefined} className={i === current ? "rounded bg-brand-100 text-brand-900" : i < current ? "text-slate-400" : ""}>
              {w}{" "}
            </span>
          ))}
        </div>
        <label htmlFor="typing-box" className="sr-only">
          Type the passage here
        </label>
        <textarea
          ref={boxRef}
          id="typing-box"
          lang={lang}
          className="input min-h-48 font-mono text-base leading-relaxed"
          value={typed}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onPaste={block}
          onDrop={block}
          onChange={(e) => {
            if (!startedAt && e.target.value) {
              const t = Date.now();
              setStartedAt(t);
              setNow(t);
            }
            setTyped(e.target.value);
          }}
          placeholder="Start typing the passage here…"
        />
        {blocked && <p className="text-xs text-amber-800">Pasting is turned off: type the passage yourself, like in the exam.</p>}
      </div>
    );
  }

  const runsHere = saved.runs.filter((r) => r.lang === lang);
  return (
    <div className="space-y-6">
      {phase === "done" && result && <Result result={result} lang={lang} onAgain={begin} />}

      <section className="card space-y-5">
        <div className="flex flex-wrap gap-6">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Language</legend>
            <div className="mt-2 flex gap-1.5">
              {(["en", "hi"] as const).map((l) => (
                <label key={l} className={`btn cursor-pointer border has-focus-visible:ring-2 has-focus-visible:ring-brand-500 ${lang === l ? "border-ink bg-ink text-on-ink" : "border-slate-200 bg-surface text-slate-700 hover:bg-slate-100"}`}>
                  <input
                    type="radio"
                    name="lang"
                    className="sr-only"
                    checked={lang === l}
                    onChange={() => {
                      setLang(l);
                      setPassageId(PASSAGES.find((p) => p.lang === l)!.id);
                    }}
                  />
                  {l === "en" ? "English" : "Hindi (हिंदी)"}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Time</legend>
            <div className="mt-2 flex gap-1.5">
              {DURATIONS.map((m) => (
                <label key={m} className={`btn cursor-pointer border has-focus-visible:ring-2 has-focus-visible:ring-brand-500 ${minutes === m ? "border-ink bg-ink text-on-ink" : "border-slate-200 bg-surface text-slate-700 hover:bg-slate-100"}`}>
                  <input type="radio" name="minutes" className="sr-only" checked={minutes === m} onChange={() => setMinutes(m)} />
                  {m} min
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <label htmlFor="passage" className="text-sm font-semibold text-slate-900">
            Passage
          </label>
          <select id="passage" className="input mt-2 sm:max-w-sm" value={passage.id} onChange={(e) => setPassageId(e.target.value)}>
            {choices.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({splitWords(p.text).length} words)
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">Longer tests continue into the next passages, so you won’t run out of text.</p>
        </div>
        {lang === "hi" && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            The real exam types Hindi in the Mangal font with the Inscript or Remington (GAIL) keyboard layout. Here, turn on your computer’s Hindi keyboard (Windows: Settings → Time &amp; language → Language → Hindi; macOS: Keyboard → Input Sources) and pick the layout your exam allows.
          </p>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-4">
          <div className="min-w-0 flex-1 text-sm text-slate-600">
            <p>
              Best net speed ({lang === "en" ? "English" : "Hindi"}): <b className="text-slate-900">{saved.best[lang] ? `${saved.best[lang]} wpm` : "none yet"}</b>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Commonly required: {TARGET[lang]} wpm {lang === "en" ? "English" : "Hindi"} (SSC CHSL-style skill test); check your notification for the exact rule.
            </p>
            {runsHere.length > 1 && (
              <div className="mt-2 max-w-xs">
                <Sparkline values={runsHere.map((r) => r.net)} label="Recent net speeds" unit=" wpm" />
                <p className="mt-1 text-xs text-slate-500">Net wpm, last {runsHere.length} tests</p>
              </div>
            )}
          </div>
          <button type="button" className="btn-primary px-6" onClick={begin}>
            <Keyboard className="h-4 w-4" /> Start {minutes}-minute test
          </button>
        </div>
      </section>

      {runsHere.length > 0 && (
        <section className="card">
          <h2 className="font-semibold text-slate-900">Recent tests</h2>
          <div className="mt-3 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Net</th>
                  <th>Gross</th>
                  <th>Accuracy</th>
                  <th>Mistakes</th>
                </tr>
              </thead>
              <tbody>
                {runsHere
                  .slice(-8)
                  .reverse()
                  .map((r) => (
                    <tr key={r.at}>
                      <td>{new Date(r.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                      <td>{r.minutes} min</td>
                      <td className="font-semibold text-slate-900">{r.net}</td>
                      <td>{r.gross}</td>
                      <td>{r.accuracy}%</td>
                      <td>{r.mistakes}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Result({ result, lang, onAgain }: { result: TypingScore & { newBest: boolean; xp: number }; lang: Lang; onAgain: () => void }) {
  const target = TARGET[lang];
  const met = result.netWpm >= target;
  const stats: [string, string][] = [
    ["Net speed", `${result.netWpm} wpm`],
    ["Gross speed", `${result.grossWpm} wpm`],
    ["Accuracy", `${result.accuracy}%`],
    ["Full mistakes", String(result.fullMistakes)],
    ["Half mistakes", String(result.halfMistakes)],
    ["Words typed", String(result.typedWords)],
  ];
  return (
    <section className="card space-y-4" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Result · {Math.round(result.minutes * 10) / 10} min</p>
          <p className={`mt-1 text-sm font-medium ${met ? "text-emerald-700" : "text-slate-700"}`}>
            {met ? `At or above the ${target} wpm commonly required` : `Below the ${target} wpm commonly required`} (check your notification).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.newBest && (
            <span className="chip bg-amber-100 px-3 py-1 text-sm text-amber-900">
              <Trophy className="h-4 w-4" /> New best
            </span>
          )}
          {result.xp > 0 && <span className="chip bg-slate-100 px-3 py-1 text-sm text-slate-700">+{result.xp} XP</span>}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">{k}</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-slate-500">
        Gross speed counts every 5 characters typed as a word. Net speed takes off one word per full mistake (wrong, missed or extra word) and half a word per half mistake (wrong capital letter or punctuation), per minute.
      </p>
      {result.diff.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Your typing, checked word by word</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span><span className="rounded bg-red-100 px-1 text-red-800">wrong</span> typed (passage word after it)</span>
            <span><span className="text-slate-400 line-through">missed</span></span>
            <span><span className="rounded bg-red-100 px-1 text-red-800 underline">extra</span></span>
            <span><span className="rounded bg-amber-100 px-1 text-amber-900">half</span></span>
          </div>
          <p lang={lang} className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-200 p-3 text-sm leading-relaxed">
            {result.diff.map((t, i) => (
              <Token key={i} t={t} />
            ))}
          </p>
        </div>
      )}
      <button type="button" className="btn-primary" onClick={onAgain}>
        <RotateCcw className="h-4 w-4" /> Try again
      </button>
    </section>
  );
}

function Token({ t }: { t: DiffToken }) {
  switch (t.kind) {
    case "ok":
      return <span className="text-slate-700">{t.typed} </span>;
    case "half":
      return (
        <span title={`Should be: ${t.expected}`}>
          <span className="rounded bg-amber-100 px-0.5 text-amber-900">{t.typed}</span> <span className="text-xs text-slate-500">({t.expected})</span>{" "}
        </span>
      );
    case "wrong":
      return (
        <span title={`Should be: ${t.expected}`}>
          <span className="rounded bg-red-100 px-0.5 text-red-800">{t.typed}</span> <span className="text-xs text-emerald-700">({t.expected})</span>{" "}
        </span>
      );
    case "missing":
      return (
        <span title="Missed word">
          <span className="text-slate-400 line-through">{t.expected}</span>{" "}
        </span>
      );
    case "extra":
      return (
        <span title="Extra word">
          <span className="rounded bg-red-100 px-0.5 text-red-800 underline">{t.typed}</span>{" "}
        </span>
      );
  }
}
