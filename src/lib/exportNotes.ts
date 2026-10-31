import type { VideoBreakdown } from "./types";
import type { VideoNote } from "./storage";
import { formatTime } from "./youtube";

const link = (id: string, t: number) => `https://www.youtube.com/watch?v=${id}&t=${Math.floor(t)}s`;

export function notesMarkdown(d: VideoBreakdown, mine: VideoNote[]): string {
  const lines = [
    `# ${d.title}`,
    "",
    `${d.author ? `${d.author} · ` : ""}${formatTime(d.lengthSeconds)} · [Watch on YouTube](https://www.youtube.com/watch?v=${d.videoId})`,
    "",
    `> ${d.notes.oneLine}`,
    "",
    "## Chapters",
    ...d.chapters.map((c) => `- [${formatTime(c.start)}](${link(d.videoId, c.start)}) **${c.title}** _(${c.importance})_: ${c.summary}`),
    "",
    "## Key points",
    ...d.notes.keyPoints.map((k) => `- [${formatTime(k.timestamp)}](${link(d.videoId, k.timestamp)}) ${k.text}`),
  ];
  if (d.notes.facts.length) lines.push("", "## Important facts", ...d.notes.facts.map((k) => `- [${formatTime(k.timestamp)}](${link(d.videoId, k.timestamp)}) ${k.text}`));
  if (mine.length) lines.push("", "## My notes", ...mine.map((n) => `- [${formatTime(n.t)}](${link(d.videoId, n.t)}) ${n.text}`));
  lines.push("", `_Keywords: ${d.notes.keywords.join(", ")}_`, "", "Generated with StudyClip AI");
  return lines.join("\n");
}

export function downloadText(filename: string, text: string, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Opens a clean, printable page so the browser's "Save as PDF" produces tidy notes. */
export function printNotes(d: VideoBreakdown, mine: VideoNote[]) {
  const li = (t: number, text: string) => `<li><a href="${link(d.videoId, t)}">${formatTime(t)}</a> ${esc(text)}</li>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(d.title)} – notes</title>
<style>body{font:14px/1.55 system-ui,Segoe UI,Arial,sans-serif;max-width:720px;margin:32px auto;color:#1e293b;padding:0 16px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:24px 0 8px;color:#4338ca;border-bottom:1px solid #e2e8f0;padding-bottom:4px}
.meta{color:#64748b;font-size:12px}.sum{background:#eef2ff;padding:10px 12px;border-radius:8px}
a{color:#4338ca;font-family:Consolas,monospace;font-size:12px;text-decoration:none;margin-right:6px}li{margin:4px 0}
.tag{font-size:11px;font-weight:700;padding:1px 6px;border-radius:99px;background:#f1f5f9}.High{background:#fee2e2;color:#b91c1c}</style></head><body>
<h1>${esc(d.title)}</h1><div class="meta">${esc(d.author)} · ${formatTime(d.lengthSeconds)} · StudyClip AI</div>
<p class="sum">${esc(d.notes.oneLine)}</p>
<h2>Chapters</h2><ul>${d.chapters.map((c) => `<li><a href="${link(d.videoId, c.start)}">${formatTime(c.start)}</a> <b>${esc(c.title)}</b> <span class="tag ${c.importance}">${c.importance}</span><br><span class="meta">${esc(c.summary)}</span></li>`).join("")}</ul>
<h2>Key points</h2><ul>${d.notes.keyPoints.map((k) => li(k.timestamp, k.text)).join("")}</ul>
${d.notes.facts.length ? `<h2>Important facts</h2><ul>${d.notes.facts.map((k) => li(k.timestamp, k.text)).join("")}</ul>` : ""}
${mine.length ? `<h2>My notes</h2><ul>${mine.map((n) => li(n.t, n.text)).join("")}</ul>` : ""}
<script>window.onload=()=>setTimeout(()=>print(),300)</script></body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
