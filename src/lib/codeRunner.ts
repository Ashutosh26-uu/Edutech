"use client";

import type { CodingLang, CodingTest } from "@/data/coding-problems";
import { normalise } from "./codeRunnerCompare";

/**
 * Runs a student's code in their own browser, never on our server. Each language runs in a Web
 * Worker (built from an inline script, so it works on the static site too): Python through
 * Pyodide from the jsDelivr CDN, JavaScript as a plain function. A test that runs longer than
 * TIME_LIMIT_MS is stopped by terminating the worker, and the next test gets a fresh one.
 */

export const TIME_LIMIT_MS = 5000;
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
/** Loading Pyodide (a few MB) is not counted in the time limit, but it cannot hang forever. */
const LOAD_LIMIT_MS = 60_000;
const OUTPUT_LIMIT = 100_000;

export type Verdict = "pass" | "fail" | "error" | "timeout" | "skipped";

export interface TestResult {
  verdict: Verdict;
  stdout: string;
  error?: string;
  ms: number;
}

const PY_WORKER = `
let ready = null;
self.onmessage = async (e) => {
  const { type, code, input } = e.data;
  try {
    if (!ready) {
      importScripts("${PYODIDE_URL}pyodide.js");
      ready = loadPyodide({ indexURL: "${PYODIDE_URL}" });
    }
    const py = await ready;
    if (type === "load") { self.postMessage({ type: "ready" }); return; }
    py.globals.set("__code", code);
    py.globals.set("__stdin", input);
    py.runPython(\`
import sys, io, traceback
__out = io.StringIO()
__err = ""
sys.stdin = io.StringIO(__stdin)
sys.stdout = __out
try:
    exec(compile(__code, "solution.py", "exec"), {"__name__": "__main__"})
except SystemExit:
    pass
except BaseException as __e:
    __frames = [f for f in traceback.extract_tb(__e.__traceback__) if f.filename == "solution.py"]
    __where = ("Line %d: " % __frames[-1].lineno) if __frames else ""
    if isinstance(__e, SyntaxError) and __e.lineno:
        __where = "Line %d: " % __e.lineno
    __err = __where + "".join(traceback.format_exception_only(type(__e), __e)).strip().splitlines()[-1]
finally:
    sys.stdout = sys.__stdout__
    sys.stdin = sys.__stdin__
\`);
    self.postMessage({ type: "done", stdout: py.globals.get("__out").getvalue(), error: py.globals.get("__err") || undefined });
  } catch (err) {
    self.postMessage({ type: type === "load" ? "load-failed" : "done", stdout: "", error: String(err && err.message || err) });
  }
};
`;

const JS_WORKER = `
const show = (v) => typeof v === "string" ? v : typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
self.onmessage = (e) => {
  const { type, code, input } = e.data;
  if (type === "load") { self.postMessage({ type: "ready" }); return; }
  const out = [];
  const log = (...a) => { out.push(a.map(show).join(" ")); };
  const fakeConsole = { log, info: log, warn: log, error: log, debug: log };
  try {
    new Function("input", "console", "print", '"use strict";\\n' + code)(input, fakeConsole, log);
    self.postMessage({ type: "done", stdout: out.join("\\n") });
  } catch (err) {
    const where = /<anonymous>:(\\d+)/.exec(String(err && err.stack));
    self.postMessage({ type: "done", stdout: out.join("\\n"), error: (where ? "Line " + (Number(where[1]) - 3) + ": " : "") + (err && err.name ? err.name + ": " + err.message : String(err)) });
  }
};
`;

const sources: Record<CodingLang, string> = { python: PY_WORKER, javascript: JS_WORKER };

function makeWorker(lang: CodingLang): Worker {
  const url = URL.createObjectURL(new Blob([sources[lang]], { type: "text/javascript" }));
  const w = new Worker(url);
  URL.revokeObjectURL(url);
  return w;
}

/** One runner per page: keeps a warm worker between tests and replaces it after a timeout. */
export class CodeRunner {
  private worker: Worker | null = null;
  private loaded: Promise<void> | null = null;

  constructor(private lang: CodingLang) {}

  /** Starts the worker and (for Python) downloads Pyodide. Resolves when tests can run. */
  load(): Promise<void> {
    if (this.loaded) return this.loaded;
    const w = makeWorker(this.lang);
    this.worker = w;
    this.loaded = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.reset();
        reject(new Error("Python took too long to load. Check your internet connection and try again."));
      }, LOAD_LIMIT_MS);
      w.onmessage = (e) => {
        clearTimeout(timer);
        if (e.data.type === "ready") resolve();
        else {
          this.reset();
          reject(new Error("Could not load Python in this browser. Check your internet connection and try again."));
        }
      };
      w.onerror = () => {
        clearTimeout(timer);
        this.reset();
        reject(new Error("Could not start the code runner in this browser."));
      };
      w.postMessage({ type: "load" });
    });
    return this.loaded;
  }

  private reset() {
    this.worker?.terminate();
    this.worker = null;
    this.loaded = null;
  }

  dispose() {
    this.reset();
  }

  /** Runs the code on one input and compares with the expected output. */
  async run(code: string, test: CodingTest): Promise<TestResult> {
    await this.load();
    const w = this.worker!;
    const started = performance.now();
    return new Promise<TestResult>((resolve) => {
      const timer = setTimeout(() => {
        this.reset();
        resolve({ verdict: "timeout", stdout: "", error: `Stopped after ${TIME_LIMIT_MS / 1000} seconds. Check for an infinite loop or a slow approach.`, ms: TIME_LIMIT_MS });
      }, TIME_LIMIT_MS);
      w.onmessage = (e) => {
        if (e.data.type !== "done") return;
        clearTimeout(timer);
        const ms = Math.round(performance.now() - started);
        const stdout = String(e.data.stdout ?? "").slice(0, OUTPUT_LIMIT);
        if (e.data.error) resolve({ verdict: "error", stdout, error: String(e.data.error), ms });
        else resolve({ verdict: normalise(stdout) === normalise(test.output) ? "pass" : "fail", stdout, ms });
      };
      w.onerror = (e) => {
        clearTimeout(timer);
        this.reset();
        resolve({ verdict: "error", stdout: "", error: e.message || "The code runner stopped.", ms: Math.round(performance.now() - started) });
      };
      w.postMessage({ type: "run", code, input: test.input });
    });
  }
}
