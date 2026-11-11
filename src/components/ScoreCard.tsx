"use client";

import { Download, Image as ImageIcon, Loader2, MessageCircle, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Shareable score card: a 1080×1350 PNG (portrait, fits a WhatsApp or Instagram status) drawn on a
 * canvas in the browser. No server and no image service, so it also works on the static build.
 */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://studyclip.netlify.app").replace(/\/+$/, "");
/** Shared with the challenge box, so a name typed once is offered in both places. */
const NAME_KEY = "studyclip:challenge-name";

const W = 1080;
const H = 1350;
const FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`;
const C = {
  bg: "#f5f7fb",
  card: "#ffffff",
  ink: "#18181b",
  text: "#0f172a",
  muted: "#64748b",
  line: "#e2e8f0",
  brand: "#2563eb",
  brandDark: "#1d4ed8",
  brandSoft: "#eff6ff",
  green: "#047857",
  greenSoft: "#ecfdf5",
  red: "#b91c1c",
  redSoft: "#fef2f2",
  slate: "#334155",
  slateSoft: "#f1f5f9",
};

export interface ScoreSummary {
  /** Exam or topic the set was on, e.g. "SSC CGL · Full mock test". */
  title: string;
  score: number;
  total: number;
  /** "Marks" when the set is marked (marks per question or negative marking), else "Score". */
  scoreLabel: string;
  correct: number;
  wrong: number;
  skipped: number;
  /** Accuracy of attempted questions, 0–100. */
  accuracy: number;
  examId?: string;
  rank?: { rank: number; takers: number; percentile: number | null; enough: boolean } | null;
}

const fmt = (n: number) => String(+n.toFixed(2));

export function shareUrl(examId?: string) {
  return examId ? `${SITE}/exams/${encodeURIComponent(examId)}` : SITE;
}

function motivation(s: ScoreSummary) {
  if (s.correct + s.wrong === 0) return "Every topper started with question one.";
  if (s.accuracy >= 90) return "Outstanding! Exam-ready form.";
  if (s.accuracy >= 75) return "Great work. Keep the streak going!";
  if (s.accuracy >= 50) return "Solid effort. A few more sets and I’m there.";
  return "Every mistake is a lesson. Back tomorrow, stronger.";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Splits text into at most `max` lines that fit `width`, ending in "…" when it had to cut. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, max: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    lines.length = max;
    lines[max - 1] += "…";
  }
  return lines.map((l) => {
    if (ctx.measureText(l).width <= width) return l;
    let cut = l;
    while (cut.length > 1 && ctx.measureText(`${cut}…`).width > width) cut = cut.slice(0, -1);
    return `${cut.trimEnd()}…`;
  });
}

/** The brand mark from Logo.tsx, drawn at `size` px. */
function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 32, size / 32);
  ctx.fillStyle = C.ink;
  roundRect(ctx, 0, 0, 32, 32, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fill(new Path2D("M9 10.2v11.6c0 .8.9 1.3 1.6.9l9.3-5.8c.6-.4.6-1.3 0-1.7l-9.3-5.8c-.7-.4-1.6.1-1.6.8z"));
  const bars: [string, number][] = [
    [C.brand, 10],
    ["rgba(255,255,255,0.6)", 14.5],
    ["rgba(255,255,255,0.3)", 19],
  ];
  for (const [fill, by] of bars) {
    ctx.fillStyle = fill;
    roundRect(ctx, 21.5, by, 3, 3, 1);
    ctx.fill();
  }
  ctx.restore();
}

/** Draws the card and returns it as a PNG blob. */
export function drawScoreCard(s: ScoreSummary, name: string): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.textBaseline = "alphabetic";

  // Background with two soft brand circles.
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(37,99,235,0.08)";
  ctx.beginPath();
  ctx.arc(W - 40, 60, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(37,99,235,0.05)";
  ctx.beginPath();
  ctx.arc(60, H - 260, 220, 0, Math.PI * 2);
  ctx.fill();

  // Brand row.
  const pad = 80;
  drawMark(ctx, pad, 80, 96);
  ctx.fillStyle = C.ink;
  ctx.font = `700 56px ${FONT}`;
  ctx.fillText("StudyClip", pad + 124, 148);

  // Who and what.
  ctx.fillStyle = C.muted;
  ctx.font = `500 38px ${FONT}`;
  const who = name.trim() ? `${name.trim()}’s result` : "My result";
  ctx.fillText(wrap(ctx, who, W - pad * 2, 1)[0], pad, 278);
  ctx.fillStyle = C.text;
  ctx.font = `700 58px ${FONT}`;
  const titleLines = wrap(ctx, s.title, W - pad * 2, 2);
  titleLines.forEach((l, i) => ctx.fillText(l, pad, 350 + i * 70));

  // Score panel.
  const top = 350 + (titleLines.length - 1) * 70 + 60;
  const panelH = s.rank ? 400 : 350;
  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.08)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = C.card;
  roundRect(ctx, pad, top, W - pad * 2, panelH, 40);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = C.brand;
  roundRect(ctx, pad, top, 16, panelH, 8);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = C.muted;
  ctx.font = `600 36px ${FONT}`;
  ctx.fillText(s.scoreLabel.toUpperCase(), W / 2, top + 80);
  const big = `${fmt(s.score)} / ${fmt(s.total)}`;
  let size = 170;
  ctx.font = `800 ${size}px ${FONT}`;
  while (size > 70 && ctx.measureText(big).width > W - pad * 2 - 100) {
    size -= 6;
    ctx.font = `800 ${size}px ${FONT}`;
  }
  ctx.fillStyle = C.brandDark;
  ctx.fillText(big, W / 2, top + 100 + size * 0.82);
  ctx.fillStyle = C.text;
  ctx.font = `600 44px ${FONT}`;
  const attempted = s.correct + s.wrong;
  ctx.fillText(attempted ? `${s.accuracy}% accuracy` : "No questions attempted", W / 2, top + 310);
  if (s.rank) {
    ctx.fillStyle = C.muted;
    ctx.font = `500 36px ${FONT}`;
    const r = `Rank ${s.rank.rank.toLocaleString("en-IN")} of ${s.rank.takers.toLocaleString("en-IN")}${s.rank.enough && s.rank.percentile !== null ? ` · ${s.rank.percentile} percentile` : ""}`;
    ctx.fillText(wrap(ctx, r, W - pad * 2 - 80, 1)[0], W / 2, top + 365);
  }

  // Correct / wrong / skipped tiles.
  const tilesTop = top + panelH + 40;
  const gap = 28;
  const tileW = (W - pad * 2 - gap * 2) / 3;
  const tiles: [string, number, string, string][] = [
    ["Correct", s.correct, C.greenSoft, C.green],
    ["Wrong", s.wrong, C.redSoft, C.red],
    ["Skipped", s.skipped, C.slateSoft, C.slate],
  ];
  tiles.forEach(([label, value, bg, fg], i) => {
    const x = pad + i * (tileW + gap);
    ctx.fillStyle = bg;
    roundRect(ctx, x, tilesTop, tileW, 180, 32);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.font = `800 80px ${FONT}`;
    ctx.fillText(String(value), x + tileW / 2, tilesTop + 100);
    ctx.font = `600 32px ${FONT}`;
    ctx.fillText(label, x + tileW / 2, tilesTop + 150);
  });

  // Motivation, centred in the space left above the footer.
  const footerTop = H - 130;
  ctx.fillStyle = C.text;
  ctx.font = `600 italic 44px ${FONT}`;
  const quote = wrap(ctx, `“${motivation(s)}”`, W - pad * 2, 2);
  const space = footerTop - (tilesTop + 180);
  const qTop = tilesTop + 180 + (space - quote.length * 58) / 2 + 44;
  quote.forEach((l, i) => ctx.fillText(l, W / 2, qTop + i * 58));

  // Footer band with the site.
  ctx.fillStyle = C.brand;
  ctx.fillRect(0, footerTop, W, H - footerTop);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 40px ${FONT}`;
  ctx.fillText(`Practised on ${SITE.replace(/^https?:\/\//, "")}`, W / 2, footerTop + 80);
  ctx.textAlign = "left";

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

/** "Share score card" button and the preview sheet it opens. */
export function ScoreCardButton({ summary }: { summary: ScoreSummary }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-ghost" onClick={() => setOpen(true)}>
        <Share2 className="h-4 w-4" /> Share score card
      </button>
      {open && <ScoreCardSheet summary={summary} onClose={() => setOpen(false)} />}
    </>
  );
}

function ScoreCardSheet({ summary, onClose }: { summary: ScoreSummary; onClose: () => void }) {
  const [name, setName] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [preview, setPreview] = useState("");
  const [canShareFile, setCanShareFile] = useState(false);
  const [note, setNote] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {
      /* storage blocked */
    }
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Redraw when the name changes; a short delay keeps typing smooth.
  const key = JSON.stringify(summary);
  useEffect(() => {
    let on = true;
    let url = "";
    const t = setTimeout(async () => {
      const b = await drawScoreCard(summary, name);
      if (!on || !b) return;
      url = URL.createObjectURL(b);
      setBlob(b);
      setPreview(url);
      try {
        setCanShareFile(!!navigator.canShare?.({ files: [new File([b], "studyclip-score.png", { type: "image/png" })] }));
      } catch {
        setCanShareFile(false);
      }
    }, 150);
    return () => {
      on = false;
      clearTimeout(t);
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, name]);

  const link = shareUrl(summary.examId);
  const text = `I scored ${fmt(summary.score)}/${fmt(summary.total)}${summary.correct + summary.wrong ? ` (${summary.accuracy}% accuracy)` : ""} on ${summary.title} at StudyClip. Practise free: ${link}`;
  const remember = () => {
    try {
      localStorage.setItem(NAME_KEY, name.trim());
    } catch {
      /* storage blocked */
    }
  };
  const fileName = `studyclip-score-${Date.now()}.png`;

  const download = () => {
    if (!blob) return;
    remember();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const whatsapp = () => {
    remember();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setNote("Tip: download the image and attach it in WhatsApp, or post it as your status.");
  };
  const share = async () => {
    if (!blob) return;
    remember();
    const file = new File([blob], fileName, { type: "image/png" });
    try {
      await navigator.share({ files: [file], title: "My StudyClip score", text });
    } catch (e) {
      // AbortError: the student closed the share sheet. Anything else: fall back to WhatsApp.
      if ((e as Error)?.name !== "AbortError") whatsapp();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Share score card"
        className="max-h-[100dvh] w-full space-y-3 overflow-y-auto rounded-t-2xl border border-slate-200 bg-surface p-4 shadow-xl outline-none sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <ImageIcon className="h-4 w-4 text-brand-600" /> Your score card
          </h3>
          <button className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-auto aspect-[4/5] w-full max-w-[min(100%,calc((100dvh_-_15rem)*0.8))] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={`Score card: ${fmt(summary.score)} out of ${fmt(summary.total)} on ${summary.title}`} className="h-full w-full object-contain" />
          ) : (
            <div className="grid h-full place-items-center text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
        <input className="input" placeholder="Your name on the card (optional)" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name on the card" />
        <div className="flex flex-wrap gap-2">
          {canShareFile ? (
            <button className="btn-primary flex-1" onClick={share} disabled={!blob}>
              <Share2 className="h-4 w-4" /> Share image
            </button>
          ) : (
            <button className="btn-primary flex-1" onClick={whatsapp}>
              <MessageCircle className="h-4 w-4" /> Share on WhatsApp
            </button>
          )}
          <button className="btn-ghost flex-1" onClick={download} disabled={!blob}>
            <Download className="h-4 w-4" /> Download image
          </button>
        </div>
        {note && <p className="text-xs text-slate-600">{note}</p>}
      </div>
    </div>
  );
}
