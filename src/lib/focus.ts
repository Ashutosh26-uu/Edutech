"use client";

import { useEffect, useState } from "react";
import { awardXp, dayKey } from "./storage";

/**
 * Pomodoro focus timer. The running block is stored as an end time, so it keeps going while the
 * student moves around the site (or closes the tab) and is picked up again by whichever page is
 * open: the /focus page or the small floating pill mounted from the layout.
 */

export const FOCUS_KEY = "studyclip:focus:v1";
export const FOCUS_EVENT = "studyclip:focus";

export type Preset = "25" | "50";
export const PRESETS: Record<Preset, { focus: number; rest: number }> = { "25": { focus: 25, rest: 5 }, "50": { focus: 50, rest: 10 } };
/** 10 XP per 25 focused minutes. */
export const focusXp = (minutes: number) => Math.round((minutes / 25) * 10);

export interface FocusState {
  preset: Preset;
  phase: "focus" | "break";
  running: boolean;
  /** When the running block ends (epoch ms) */
  endsAt: number | null;
  /** Time left while paused (ms) */
  remaining: number;
  topicId?: string;
  muted: boolean;
  /** Focused minutes per local day, keyed YYYY-MM-DD */
  minutes: Record<string, number>;
  /** Completed focus blocks per local day */
  blocks: Record<string, number>;
}

const MIN = 60_000;
export const phaseMs = (preset: Preset, phase: FocusState["phase"]) => (phase === "focus" ? PRESETS[preset].focus : PRESETS[preset].rest) * MIN;

const fresh = (): FocusState => ({ preset: "25", phase: "focus", running: false, endsAt: null, remaining: phaseMs("25", "focus"), muted: false, minutes: {}, blocks: {} });

export function loadFocus(): FocusState {
  try {
    const raw = localStorage.getItem(FOCUS_KEY);
    const s = raw ? { ...fresh(), ...JSON.parse(raw) } : fresh();
    if (!PRESETS[s.preset as Preset]) s.preset = "25";
    return s;
  } catch {
    return fresh();
  }
}

export function saveFocus(s: FocusState) {
  try {
    localStorage.setItem(FOCUS_KEY, JSON.stringify(s));
    window.dispatchEvent(new Event(FOCUS_EVENT));
  } catch {
    /* not kept */
  }
}

/** Time left in the current block (ms). */
export const timeLeft = (s: FocusState, now = Date.now()) => (s.running && s.endsAt ? Math.max(0, s.endsAt - now) : s.remaining);
/** A block has been started and not reset. */
export const isActive = (s: FocusState) => s.running || s.remaining < phaseMs(s.preset, s.phase);

export const start = (s: FocusState, now = Date.now()): FocusState => (s.running ? s : { ...s, running: true, endsAt: now + s.remaining });
export const pause = (s: FocusState, now = Date.now()): FocusState => (s.running ? { ...s, running: false, endsAt: null, remaining: timeLeft(s, now) } : s);
export const reset = (s: FocusState): FocusState => ({ ...s, running: false, endsAt: null, phase: "focus", remaining: phaseMs(s.preset, "focus") });
export const setPreset = (s: FocusState, preset: Preset): FocusState => reset({ ...s, preset });

/**
 * Moves past any block that has ended: a finished focus block is credited to the day it ended
 * and the break starts on its own; a finished break waits for the student to start again.
 */
export function advance(s: FocusState, now = Date.now()): { state: FocusState; focused: number; ended: boolean } {
  let state = s;
  let focused = 0;
  let ended = false;
  while (state.running && state.endsAt !== null && state.endsAt <= now) {
    ended = true;
    if (state.phase === "focus") {
      const mins = PRESETS[state.preset].focus;
      const k = dayKey(new Date(state.endsAt));
      focused += mins;
      state = {
        ...state,
        phase: "break",
        endsAt: state.endsAt + phaseMs(state.preset, "break"),
        minutes: { ...state.minutes, [k]: (state.minutes[k] ?? 0) + mins },
        blocks: { ...state.blocks, [k]: (state.blocks[k] ?? 0) + 1 },
      };
    } else {
      state = { ...state, phase: "focus", running: false, endsAt: null, remaining: phaseMs(state.preset, "focus") };
    }
  }
  return { state, focused, ended };
}

/** Two soft beeps and a short buzz on phones; nothing when muted. */
export function chime(muted: boolean) {
  if (muted) return;
  try {
    navigator.vibrate?.([180, 120, 180]);
  } catch {}
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.45].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 660;
      const t = ctx.currentTime + offset;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch {
    /* audio unavailable */
  }
}

/** Saves the change and tells every timer view in this tab. */
export function updateFocus(fn: (s: FocusState) => FocusState) {
  saveFocus(fn(loadFocus()));
}

/** The timer state, ticking every second while it runs; finishes blocks (minutes, XP, chime) as they end. */
export function useFocus(): { state: FocusState; now: number } | null {
  const [state, setState] = useState<FocusState | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const t = Date.now();
      const cur = loadFocus();
      const { state: next, focused, ended } = advance(cur, t);
      if (ended) {
        saveFocus(next); // fires FOCUS_EVENT: other views re-read and find nothing left to finish
        if (focused) awardXp(focusXp(focused));
        // Only chime when the block ended just now, not when coming back hours later.
        if (t - (cur.endsAt ?? 0) < 5_000) chime(next.muted);
        return;
      }
      setState(cur);
      setNow(t);
    };
    refresh();
    const id = window.setInterval(() => {
      const s = loadFocus();
      if (s.running) refresh();
    }, 1000);
    window.addEventListener(FOCUS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener(FOCUS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return state ? { state, now } : null;
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
