"use client";

import type { CodingLang } from "@/data/coding-problems";

/** Solved problems and code drafts, kept only in this browser. Every access may fail (private mode). */

const SOLVED_KEY = "studyclip:coding:solved";
const draftKey = (id: string, lang: CodingLang) => `studyclip:coding:draft:${id}:${lang}`;
const LANG_KEY = "studyclip:coding:lang";

export function getSolved(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(SOLVED_KEY) ?? "[]");
    return new Set(Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

export function markSolved(id: string) {
  try {
    const s = getSolved();
    s.add(id);
    localStorage.setItem(SOLVED_KEY, JSON.stringify([...s]));
  } catch {
    /* storage unavailable */
  }
}

export function getDraft(id: string, lang: CodingLang): string | null {
  try {
    return localStorage.getItem(draftKey(id, lang));
  } catch {
    return null;
  }
}

export function saveDraft(id: string, lang: CodingLang, code: string) {
  try {
    localStorage.setItem(draftKey(id, lang), code);
  } catch {
    /* storage unavailable or full */
  }
}

export function clearDraft(id: string, lang: CodingLang) {
  try {
    localStorage.removeItem(draftKey(id, lang));
  } catch {
    /* storage unavailable */
  }
}

export function getLang(): CodingLang {
  try {
    return localStorage.getItem(LANG_KEY) === "javascript" ? "javascript" : "python";
  } catch {
    return "python";
  }
}

export function saveLang(lang: CodingLang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* storage unavailable */
  }
}
