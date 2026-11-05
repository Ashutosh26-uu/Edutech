"use client";

import { useEffect, useState } from "react";
import type { MCQ } from "./types";

/** Question language. Questions with a Hindi version show it when Hindi is picked; the rest stay in English. */
export type Lang = "en" | "hi";

const KEY = "studyclip:lang";
const EVENT = "studyclip:lang";

export function getLang(): Lang {
  try {
    return localStorage.getItem(KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, set] = useState<Lang>("en");
  useEffect(() => {
    const refresh = () => set(getLang());
    refresh();
    window.addEventListener(EVENT, refresh);
    return () => window.removeEventListener(EVENT, refresh);
  }, []);
  return [lang, setLang];
}

/** The question's text in the chosen language, falling back to English. */
export function inLang(q: MCQ, lang: Lang): { question: string; options: string[]; explanation: string } {
  if (lang !== "hi") return { question: q.question, options: q.options, explanation: q.explanation };
  return {
    question: q.questionHi || q.question,
    options: q.optionsHi?.length === q.options.length ? q.optionsHi : q.options,
    explanation: q.explanationHi || q.explanation,
  };
}

export const hasHindi = (qs: MCQ[]) => qs.some((q) => !!q.questionHi);
