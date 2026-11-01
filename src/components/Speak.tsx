"use client";

import { Mic, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Picks a Hindi voice for Devanagari text, otherwise an Indian-English voice if the device has one. */
function voiceFor(text: string): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const hindi = /[ऀ-ॿ]/.test(text);
  return hindi
    ? voices.find((v) => v.lang.startsWith("hi"))
    : voices.find((v) => v.lang === "en-IN") ?? voices.find((v) => v.lang.startsWith("en"));
}

/** Read-aloud button using the browser's built-in text-to-speech. */
export function SpeakButton({ text, label = "Listen", className = "" }: { text: string; label?: string; className?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    };
  }, []);
  if (!supported) return null;

  const toggle = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    const v = voiceFor(text);
    if (v) u.voice = v;
    u.rate = 1;
    u.onend = u.onerror = () => setSpeaking(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <button type="button" onClick={toggle} className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 ${className}`} aria-label={speaking ? "Stop reading" : "Read aloud"}>
      {speaking ? <><Square className="h-3 w-3 fill-current" /> Stop</> : <><Volume2 className="h-3.5 w-3.5" /> {label}</>}
    </button>
  );
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  onerror: () => void;
  start(): void;
  stop(): void;
}

/** Voice input via the Web Speech API; supports English (India) and Hindi. */
export function MicButton({ onText }: { onText: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [supported, setSupported] = useState(false);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    setSupported(!!(w.SpeechRecognition ?? w.webkitSpeechRecognition));
  }, []);
  if (!supported) return null;

  const start = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const R = (w.SpeechRecognition ?? w.webkitSpeechRecognition)!;
    const r = new R();
    r.lang = lang;
    r.interimResults = false;
    r.onresult = (e) => onText(e.results[0][0].transcript);
    r.onend = r.onerror = () => setListening(false);
    rec.current = r;
    r.start();
    setListening(true);
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" onClick={start} className={`btn-ghost px-3 ${listening ? "animate-pulse border-red-300 text-red-600" : ""}`} aria-label="Speak your search" title="Speak your search">
        {listening ? <><span className="h-2 w-2 rounded-full bg-red-500" /> Listening</> : <Mic className="h-4 w-4" />}
      </button>
      <button type="button" onClick={() => setLang(lang === "en-IN" ? "hi-IN" : "en-IN")} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100" title="Voice language">
        {lang === "en-IN" ? "EN" : "हि"}
      </button>
    </div>
  );
}
