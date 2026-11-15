"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, Loader2, Play, RotateCcw, Send, TriangleAlert, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CODING_PROBLEMS, CODING_PROBLEM_BY_ID, type CodingLang, type CodingProblem, type CodingTest } from "@/data/coding-problems";
import { CodeRunner, TIME_LIMIT_MS, type TestResult } from "@/lib/codeRunner";
import { clearDraft, getDraft, getLang, markSolved, saveDraft, saveLang } from "@/lib/codingProgress";

const LANGS: { id: CodingLang | "c" | "cpp" | "java"; label: string; ready: boolean }[] = [
  { id: "python", label: "Python 3", ready: true },
  { id: "javascript", label: "JavaScript", ready: true },
  { id: "c", label: "C (coming soon)", ready: false },
  { id: "cpp", label: "C++ (coming soon)", ready: false },
  { id: "java", label: "Java (coming soon)", ready: false },
];

interface Row {
  test: CodingTest;
  hidden: boolean;
  label: string;
  result?: TestResult;
}

export function CodingSolve() {
  const id = useSearchParams().get("id") ?? "";
  const problem = CODING_PROBLEM_BY_ID.get(id);
  if (!problem) {
    return (
      <div className="card space-y-3 text-center">
        <p className="text-slate-700">We couldn’t find that problem.</p>
        <Link href="/coding" className="btn-primary">
          See all problems
        </Link>
      </div>
    );
  }
  return <Solver key={problem.id} problem={problem} />;
}

function Solver({ problem }: { problem: CodingProblem }) {
  const [lang, setLang] = useState<CodingLang>("python");
  const [code, setCode] = useState(problem.starter.python);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [mode, setMode] = useState<"run" | "submit" | null>(null);
  const [status, setStatus] = useState("");
  const [loadError, setLoadError] = useState("");
  const [solvedNow, setSolvedNow] = useState(false);
  const runner = useRef<CodeRunner | null>(null);
  const runId = useRef(0);

  // Restore the last language and this problem's draft.
  useEffect(() => {
    const l = getLang();
    setLang(l);
    setCode(getDraft(problem.id, l) ?? problem.starter[l]);
  }, [problem]);

  useEffect(() => () => runner.current?.dispose(), []);

  // Save the draft as the student types.
  useEffect(() => {
    const t = setTimeout(() => {
      if (code !== problem.starter[lang]) saveDraft(problem.id, lang, code);
    }, 400);
    return () => clearTimeout(t);
  }, [code, lang, problem]);

  const switchLang = (value: string) => {
    if (value !== "python" && value !== "javascript") return;
    if (code !== problem.starter[lang]) saveDraft(problem.id, lang, code);
    runner.current?.dispose();
    runner.current = null;
    runId.current++;
    setMode(null);
    setRows(null);
    setLoadError("");
    setLang(value);
    saveLang(value);
    setCode(getDraft(problem.id, value) ?? problem.starter[value]);
  };

  const reset = () => {
    if (!confirm("Replace your code with the starter code?")) return;
    clearDraft(problem.id, lang);
    setCode(problem.starter[lang]);
  };

  const execute = useCallback(
    async (which: "run" | "submit") => {
      const myRun = ++runId.current;
      const list: Row[] = [
        ...problem.samples.map((t, i) => ({ test: t, hidden: false, label: `Sample ${i + 1}` })),
        ...(which === "submit" ? problem.hidden.map((t, i) => ({ test: t, hidden: true, label: `Hidden test ${i + 1}` })) : []),
      ];
      setMode(which);
      setRows(list);
      setLoadError("");
      setSolvedNow(false);
      if (!runner.current) runner.current = new CodeRunner(lang);
      const r = runner.current;
      try {
        if (lang === "python") setStatus("Loading Python (only the first time)…");
        await r.load();
      } catch (e) {
        if (myRun !== runId.current) return;
        setLoadError(e instanceof Error ? e.message : "Could not start the code runner.");
        setMode(null);
        setStatus("");
        runner.current = null;
        return;
      }
      for (let i = 0; i < list.length; i++) {
        if (myRun !== runId.current) return;
        setStatus(`Running ${list[i].label.toLowerCase()}…`);
        const result = await r.run(code, list[i].test);
        if (myRun !== runId.current) return;
        list[i] = { ...list[i], result };
        // Same code, same loop: the other tests would time out too, so don't make the student wait.
        if (result.verdict === "timeout") {
          for (let j = i + 1; j < list.length; j++) list[j] = { ...list[j], result: { verdict: "skipped", stdout: "", ms: 0 } };
        }
        setRows([...list]);
        if (result.verdict === "timeout") break;
      }
      setStatus("");
      setMode(null);
      if (which === "submit" && list.every((x) => x.result?.verdict === "pass")) {
        markSolved(problem.id);
        setSolvedNow(true);
      }
    },
    [code, lang, problem],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end } = el;
      const next = code.slice(0, s) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4));
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!mode) execute("run");
    }
  };

  const index = CODING_PROBLEMS.findIndex((p) => p.id === problem.id);
  const next = CODING_PROBLEMS[index + 1];
  const busy = mode !== null;
  const passed = rows?.filter((r) => r.result?.verdict === "pass").length ?? 0;
  const finished = rows && !busy && rows.every((r) => r.result);

  return (
    <div className="space-y-5">
      <Link href="/coding" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-3 w-3" /> All coding problems
      </Link>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="card space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 tabular-nums">#{index + 1}</span>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{problem.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`chip ${problem.difficulty === "easy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{problem.difficulty}</span>
            <span className="chip bg-slate-100 text-slate-700">{problem.topic}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{problem.statement}</p>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="eyebrow">Input</dt>
              <dd className="mt-1 text-slate-700">{problem.inputFormat}</dd>
            </div>
            <div>
              <dt className="eyebrow">Output</dt>
              <dd className="mt-1 text-slate-700">{problem.outputFormat}</dd>
            </div>
            <div>
              <dt className="eyebrow">Constraints</dt>
              <dd className="mt-1 text-slate-700">{problem.constraints}</dd>
            </div>
          </dl>
          {problem.samples.map((t, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <Block label={`Sample input ${i + 1}`} text={t.input} />
              <Block label="Expected output" text={t.output} />
            </div>
          ))}
          <p className="text-xs text-slate-500">
            {lang === "python" ? "Read input with input() and print the answer with print()." : "The whole input is in the string `input`; print the answer with console.log()."}
          </p>
        </article>

        <section className="space-y-3" aria-label="Your code">
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="lang">
              Language
            </label>
            <select id="lang" value={lang} onChange={(e) => switchLang(e.target.value)} className="input w-auto py-1.5" disabled={busy}>
              {LANGS.map((l) => (
                <option key={l.id} value={l.id} disabled={!l.ready}>
                  {l.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={reset} className="btn-quiet text-xs" disabled={busy}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset code
            </button>
            <span className="ml-auto hidden text-xs text-slate-400 sm:inline">Ctrl + Enter runs the samples</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Code editor"
            className="h-80 w-full resize-y rounded-xl border border-slate-200 bg-[#0f172a] p-4 font-mono text-[13px] leading-relaxed text-[#e2e8f0] caret-[#e2e8f0] outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 sm:h-[26rem]"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => execute("run")} disabled={busy} className="btn-ghost">
              {mode === "run" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run samples
            </button>
            <button type="button" onClick={() => execute("submit")} disabled={busy} className="btn-primary">
              {mode === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit
            </button>
            <span className="self-center text-xs text-slate-500" aria-live="polite">
              {status}
            </span>
          </div>

          {loadError && (
            <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {loadError}
            </p>
          )}

          {rows && (
            <div className="card space-y-3" aria-live="polite">
              {finished && (
                <p className={`font-semibold ${passed === rows.length ? "text-emerald-700" : "text-slate-900"}`}>
                  {passed === rows.length
                    ? solvedNow
                      ? `Accepted: all ${rows.length} tests passed.`
                      : `All ${rows.length} sample tests passed. Now submit to check the hidden tests.`
                    : `${passed} of ${rows.length} tests passed.`}
                </p>
              )}
              <ul className="space-y-2">
                {rows.map((r, i) => (
                  <ResultRow key={i} row={r} />
                ))}
              </ul>
              {solvedNow && next && (
                <Link href={`/coding/solve?id=${next.id}`} className="btn-primary">
                  Next problem <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div className="min-w-0">
      <p className="eyebrow mb-1">{label}</p>
      <pre className="max-h-48 overflow-auto rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-800">{text}</pre>
    </div>
  );
}

function ResultRow({ row }: { row: Row }) {
  const r = row.result;
  const icon = !r ? (
    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
  ) : r.verdict === "pass" ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  ) : r.verdict === "timeout" ? (
    <Clock className="h-4 w-4 text-amber-600" />
  ) : r.verdict === "skipped" ? (
    <Circle className="h-4 w-4 text-slate-300" />
  ) : (
    <XCircle className="h-4 w-4 text-rose-600" />
  );
  const word = !r ? "Waiting" : r.verdict === "pass" ? "Passed" : r.verdict === "fail" ? "Wrong answer" : r.verdict === "timeout" ? `Time limit (${TIME_LIMIT_MS / 1000}s)` : r.verdict === "skipped" ? "Not run (an earlier test timed out)" : "Error";
  return (
    <li className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className="font-medium text-slate-900">{row.label}</span>
        <span className="text-slate-500">· {word}</span>
        {r && r.verdict !== "timeout" && r.verdict !== "skipped" && <span className="ml-auto text-xs text-slate-400 tabular-nums">{r.ms} ms</span>}
      </div>
      {r?.error && <pre className="mt-2 overflow-auto rounded bg-rose-50 p-2 font-mono text-xs whitespace-pre-wrap text-rose-800">{r.error}</pre>}
      {r && (r.verdict === "fail" || r.verdict === "error") && !row.hidden && (
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <Block label="Input" text={row.test.input} />
          <Block label="Your output" text={r.stdout || "(nothing printed)"} />
          <Block label="Expected" text={row.test.output} />
        </div>
      )}
      {r && r.verdict === "fail" && row.hidden && <p className="mt-1 text-xs text-slate-500">Hidden tests don’t show their input. Think about edge cases: one element, all equal, negatives, large values.</p>}
    </li>
  );
}
