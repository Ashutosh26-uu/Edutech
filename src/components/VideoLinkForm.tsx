"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseVideoId } from "@/lib/youtube";

export function VideoLinkForm({ initial = "", size = "md" }: { initial?: string; size?: "md" | "lg" }) {
  const router = useRouter();
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseVideoId(url);
    if (!id) {
      setError("Paste a YouTube link, for example https://www.youtube.com/watch?v=…");
      return;
    }
    setError("");
    router.push(`/video?v=${id}`);
  };

  const lg = size === "lg";
  return (
    <form onSubmit={submit}>
      <div className={`flex flex-col gap-2 sm:flex-row ${lg ? "rounded-xl border border-slate-200 bg-surface p-1.5 shadow-sm sm:gap-1.5" : ""}`}>
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={`input pl-9 ${lg ? "border-transparent py-2.5 focus:border-transparent focus:ring-0" : ""}`}
            placeholder="Paste a YouTube lecture link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="YouTube link"
          />
        </div>
        <button className={`btn-primary ${lg ? "px-5" : ""}`}>
          Break it down <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
