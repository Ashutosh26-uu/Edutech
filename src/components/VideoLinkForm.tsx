"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseVideoId } from "@/lib/youtube";

export function VideoLinkForm({ dark = false, initial = "" }: { dark?: boolean; initial?: string }) {
  const router = useRouter();
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseVideoId(url);
    if (!id) {
      setError("Paste a YouTube link, e.g. https://www.youtube.com/watch?v=…");
      return;
    }
    setError("");
    router.push(`/video?v=${id}`);
  };

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={`input flex-1 ${dark ? "border-transparent py-3 text-slate-900" : ""}`}
          placeholder="Paste a YouTube lecture link…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="YouTube link"
        />
        <button className={`btn py-3 ${dark ? "bg-white text-brand-700 hover:bg-brand-50" : "bg-brand-600 text-white hover:bg-brand-700"}`}>Break it down</button>
      </div>
      {error && <p className={`mt-2 text-sm ${dark ? "text-amber-200" : "text-red-600"}`}>{error}</p>}
    </form>
  );
}
