"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/* Minimal typing for the parts of the YouTube IFrame API we use. */
interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  getCurrentTime(): number;
  destroy(): void;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: object) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  apiPromise ??= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiPromise;
}

export interface PlayerHandle {
  seek(seconds: number): void;
  currentTime(): number;
}

/** The official YouTube embed. Clips are played by seeking, never by copying the video. */
export const YouTubePlayer = forwardRef<PlayerHandle, { videoId: string; onTime?: (t: number) => void }>(function YouTubePlayer({ videoId, onTime }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const ready = useRef(false);

  useImperativeHandle(ref, () => ({
    seek(seconds) {
      if (!player.current || !ready.current) return;
      player.current.seekTo(seconds, true);
      player.current.playVideo();
    },
    currentTime: () => (ready.current ? player.current?.getCurrentTime() ?? 0 : 0),
  }));

  useEffect(() => {
    let cancelled = false;
    loadApi().then(() => {
      if (cancelled || !host.current || !window.YT) return;
      const el = document.createElement("div");
      host.current.replaceChildren(el);
      player.current = new window.YT.Player(el, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: { onReady: () => (ready.current = true) },
      });
    });
    return () => {
      cancelled = true;
      ready.current = false;
      player.current?.destroy();
      player.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!onTime) return;
    const t = setInterval(() => ready.current && onTime(player.current?.getCurrentTime() ?? 0), 1000);
    return () => clearInterval(t);
  }, [onTime]);

  return <div ref={host} className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 [&>iframe]:h-full [&>iframe]:w-full" />;
});
