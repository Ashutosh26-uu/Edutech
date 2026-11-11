"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { MistakeTag } from "./mockAnalysis";

/**
 * Browser-only notes on questions and "why I got it wrong" tags, both keyed by question id.
 * They live under their own localStorage keys (not part of the synced store), and every write
 * fires an event so every open note or pattern card refreshes.
 */

export const NOTES_KEY = "studyclip:question-notes";
export const MISTAKE_TAGS_KEY = "studyclip:mistake-tags";
export const EXAM_MODE_KEY = "studyclip:exam-mode";
const EVENT = "studyclip:notes-update";
const NOTE_MAX = 2000;

export interface QuestionNote {
  text: string;
  at: number;
}

export interface TaggedMistake {
  tag: MistakeTag;
  /** When it was tagged (epoch ms). */
  at: number;
  topicId?: string;
}

function readRaw(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function parse<T>(raw: string): Record<string, T> {
  try {
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

function write(key: string, map: Record<string, unknown>) {
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* storage unavailable (private mode): nothing is kept */
  }
  try {
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

/** The stored map for a key; null during the server render (no localStorage there). */
function useMap<T>(key: string): Record<string, T> | null {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => null);
  return useMemo(() => (raw === null ? null : parse<T>(raw)), [raw]);
}

export const useNotes = () => useMap<QuestionNote>(NOTES_KEY);
export const useMistakeTags = () => useMap<TaggedMistake>(MISTAKE_TAGS_KEY);

/** Saves (or, when blank, removes) the note on a question. */
export function saveNote(id: string, text: string) {
  const map = parse<QuestionNote>(readRaw(NOTES_KEY));
  if (text.trim()) map[id] = { text: text.slice(0, NOTE_MAX), at: Date.now() };
  else delete map[id];
  write(NOTES_KEY, map);
}

/** Tags why a question went wrong; null clears the tag. */
export function tagMistake(id: string, tag: MistakeTag | null, topicId?: string) {
  const map = parse<TaggedMistake>(readRaw(MISTAKE_TAGS_KEY));
  if (tag) map[id] = { tag, at: Date.now(), ...(topicId ? { topicId } : {}) };
  else delete map[id];
  write(MISTAKE_TAGS_KEY, map);
}

// Which note editors are open: in memory only, shared by the Note chip and the box under the question.
const OPEN_EVENT = "studyclip:note-open";
const open = new Set<string>();

export function toggleNoteOpen(id: string, on = !open.has(id)) {
  if (on) open.add(id);
  else open.delete(id);
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const subscribeOpen = (cb: () => void) => {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
};

export function useNoteOpen(id: string): boolean {
  return useSyncExternalStore(subscribeOpen, () => open.has(id), () => false);
}

// ---------- Exam mode preference ----------

export function readExamModePref(): boolean {
  return readRaw(EXAM_MODE_KEY) === "1";
}

export function writeExamModePref(on: boolean) {
  try {
    localStorage.setItem(EXAM_MODE_KEY, on ? "1" : "0");
  } catch {}
}

/** Full screen for exam mode, where the browser allows it; failures are ignored. */
export function enterFullscreen() {
  try {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {});
  } catch {}
}

export function exitFullscreen() {
  try {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  } catch {}
}
