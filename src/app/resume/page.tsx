"use client";

import { ArrowDown, ArrowUp, CheckCircle2, Circle, Download, FileDown, FileText, FileUp, ImagePlus, Plus, Sparkles, Trash2, TriangleAlert, X } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PAGE_H, PAGE_W, ResumeSheet } from "@/components/ResumeSheet";
import {
  BUILT_IN_LABEL,
  EMPTY_RESUME,
  EXAMPLE_RESUME,
  SECTION_PRESETS,
  STORAGE_KEY,
  blankEntry,
  fileBase,
  resumeStrength,
  resumeToDocx,
  sectionOf,
  upgradeResume,
  type BuiltIn,
  type Entry,
  type Resume,
  type SectionKey,
  type Template,
} from "@/lib/resume";

/**
 * A real resume builder: four templates, an A4 preview that matches the PDF, your own sections,
 * optional photo / personal details / declaration (common in Indian resumes), and downloads as
 * PDF (print, with clickable links) or Word (.docx). Everything stays in this browser.
 */

const HINTS: Record<BuiltIn | "custom", Record<keyof Entry, string>> = {
  education: { title: "Degree or class, e.g. B.Tech CSE", sub: "College / school, city", period: "Years, e.g. 2022 – 2026", place: "Score, e.g. CGPA 8.4 / 10 or 91%", points: "Optional: coursework, rank, thesis (one per line)" },
  projects: { title: "Project name", sub: "Tech used", period: "Year", place: "Link (GitHub / live demo)", points: "What it does · what you built · a result with a number (one per line). Use **double stars** for bold." },
  experience: { title: "Role, e.g. Software Intern", sub: "Company", period: "Dates, e.g. May – Jul 2025", place: "City / remote", points: "Start each line with a verb and add a number: Built…, Reduced… by 40%" },
  certifications: { title: "Certificate", sub: "Issued by", period: "Year", place: "Credential link (optional)", points: "" },
  custom: { title: "Title / role", sub: "Organisation", period: "Dates", place: "Place or link (optional)", points: "Details (one per line)" },
};
const ACCENTS = ["#1d4ed8", "#0f766e", "#7c3aed", "#be123c", "#b45309", "#1f2937"];
const TEMPLATES: { id: Template; name: string; note: string }[] = [
  { id: "modern", name: "Modern", note: "Clean, one column. Best for most jobs and for company software (ATS)." },
  { id: "classic", name: "Classic", note: "Centred and black-and-white. Formal; good for government and core jobs." },
  { id: "sidebar", name: "Side headings", note: "Headings in a left column. Compact and easy to scan." },
  { id: "twocol", name: "Two column", note: "Tinted side panel with photo and skills. Looks great to people; some company software reads one-column resumes better." },
];

type Tab = "about" | "summary" | SectionKey | "skills" | "extra";

/** Shrinks a chosen photo to a 260 px square JPEG so it fits in browser storage. */
function squarePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = 260;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const s = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function ResumePage() {
  const [r, setR] = useState<Resume>(EMPTY_RESUME);
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("about");
  const [busy, setBusy] = useState("");
  const [newSection, setNewSection] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setR(upgradeResume(JSON.parse(saved)));
    } catch {
      /* storage blocked or old data unreadable: start blank */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
    } catch {
      /* storage full or blocked: the resume still works for this visit */
    }
  }, [r, loaded]);

  // ---------- Editing helpers ----------
  const set = <K extends keyof Resume>(k: K, v: Resume[K]) => setR((x) => ({ ...x, [k]: v }));
  const entriesOf = (x: Resume, key: SectionKey) => (key.startsWith("custom:") ? (x.custom.find((c) => c.id === key.slice(7))?.entries ?? []) : x[key as BuiltIn]);
  const withEntries = (x: Resume, key: SectionKey, entries: Entry[]): Resume =>
    key.startsWith("custom:") ? { ...x, custom: x.custom.map((c) => (c.id === key.slice(7) ? { ...c, entries } : c)) } : { ...x, [key]: entries };
  const setEntry = (key: SectionKey, i: number, k: keyof Entry, v: string) => setR((x) => withEntries(x, key, entriesOf(x, key).map((e, j) => (j === i ? { ...e, [k]: v } : e))));
  const addEntry = (key: SectionKey) => setR((x) => withEntries(x, key, [...entriesOf(x, key), blankEntry()]));
  const removeEntry = (key: SectionKey, i: number) => setR((x) => withEntries(x, key, entriesOf(x, key).filter((_, j) => j !== i)));
  const moveEntry = (key: SectionKey, i: number, d: -1 | 1) =>
    setR((x) => {
      const a = [...entriesOf(x, key)];
      const j = i + d;
      if (j < 0 || j >= a.length) return x;
      [a[i], a[j]] = [a[j], a[i]];
      return withEntries(x, key, a);
    });
  const moveSection = (key: SectionKey, d: -1 | 1) =>
    setR((x) => {
      const a = [...x.order];
      const i = a.indexOf(key);
      const j = i + d;
      if (i < 0 || j < 0 || j >= a.length) return x;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...x, order: a };
    });
  const addCustom = (title: string) => {
    const id = Math.random().toString(36).slice(2, 8);
    setR((x) => ({ ...x, custom: [...x.custom, { id, title: title || "New section", entries: [blankEntry()] }], order: [...x.order, `custom:${id}` as SectionKey] }));
    setTab(`custom:${id}`);
    setNewSection("");
  };
  const removeCustom = (id: string) => {
    if (!confirm("Delete this section and everything in it?")) return;
    setR((x) => ({ ...x, custom: x.custom.filter((c) => c.id !== id), order: x.order.filter((k) => k !== `custom:${id}`) }));
    setTab("about");
  };

  // ---------- Preview scale and page count ----------
  const wrap = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [height, setHeight] = useState(PAGE_H);
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / PAGE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    setHeight(Math.max(PAGE_H, preview.current?.querySelector("article")?.scrollHeight ?? PAGE_H));
  }, [r, scale]);
  const pages = Math.ceil((height - 2) / PAGE_H);

  // ---------- Downloads ----------
  const printPdf = () => {
    const title = document.title;
    document.title = fileBase(r); // the browser suggests this as the PDF file name
    const restore = () => {
      document.title = title;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };
  const downloadWord = async () => {
    setBusy("word");
    try {
      download(await resumeToDocx(r), `${fileBase(r)}.docx`);
    } catch (e) {
      alert("Could not create the Word file. Please try again.");
      console.error(e);
    } finally {
      setBusy("");
    }
  };
  const exportBackup = () => download(new Blob([JSON.stringify(r, null, 2)], { type: "application/json" }), `${fileBase(r)}.studyclip.json`);
  const importBackup = async (file: File) => {
    try {
      setR(upgradeResume(JSON.parse(await file.text())));
      setTab("about");
    } catch {
      alert("That file isn’t a resume backup from StudyClip.");
    }
  };

  const { score, checks } = useMemo(() => resumeStrength(r), [r]);
  const tabs: { id: Tab; label: string }[] = [
    { id: "about", label: "Contact" },
    { id: "summary", label: "Summary" },
    ...r.order.map((k) => ({ id: k as Tab, label: sectionOf(r, k)?.title ?? k })),
    { id: "skills", label: "Skills" },
    { id: "extra", label: "More" },
  ];
  const template = TEMPLATES.find((t) => t.id === r.template)!;

  // ---------- Small UI pieces ----------
  const field = (label: string, value: string, onChange: (v: string) => void, opts: { placeholder?: string; area?: boolean; rows?: number; hint?: string } = {}) => (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {opts.area ? (
        <textarea className="input mt-1" rows={opts.rows ?? 3} value={value} placeholder={opts.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input mt-1" value={value} placeholder={opts.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {opts.hint && <span className="mt-1 block text-xs text-slate-500">{opts.hint}</span>}
    </label>
  );
  const toggle = (label: string, on: boolean, onChange: (v: boolean) => void, hint?: string) => (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm">
      <input type="checkbox" className="mt-0.5 h-4 w-4" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="font-medium text-slate-800">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  );

  const sectionEditor = (key: SectionKey) => {
    const isCustom = key.startsWith("custom:");
    const custom = isCustom ? r.custom.find((c) => c.id === key.slice(7)) : undefined;
    const hints = HINTS[isCustom ? "custom" : (key as BuiltIn)];
    const list = entriesOf(r, key);
    const singular = (custom?.title || BUILT_IN_LABEL[key as BuiltIn] || "entry").replace(/s$/, "").toLowerCase();
    return (
      <div className="space-y-3">
        {custom && (
          <div className="flex items-end gap-2">
            <div className="flex-1">{field("Section title", custom.title, (v) => setR((x) => ({ ...x, custom: x.custom.map((c) => (c.id === custom.id ? { ...c, title: v } : c)) })))}</div>
            <button className="btn-ghost text-red-600" onClick={() => removeCustom(custom.id)}>
              <Trash2 className="h-4 w-4" /> Delete section
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            Position on resume
            <button className="btn-ghost px-2 py-1" onClick={() => moveSection(key, -1)} aria-label="Move section up">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button className="btn-ghost px-2 py-1" onClick={() => moveSection(key, 1)} aria-label="Move section down">
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => addEntry(key)}>
            <Plus className="h-3.5 w-3.5" /> Add {singular}
          </button>
        </div>
        {!list.length && <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">Empty sections don’t appear on the resume.</p>}
        {list.map((e, i) => (
          <div key={i} className="space-y-2.5 rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">#{i + 1}</span>
              <span className="flex gap-1">
                <button className="rounded p-1 hover:bg-slate-100" onClick={() => moveEntry(key, i, -1)} aria-label="Move up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button className="rounded p-1 hover:bg-slate-100" onClick={() => moveEntry(key, i, 1)} aria-label="Move down">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button className="rounded p-1 text-red-600 hover:bg-red-50" onClick={() => removeEntry(key, i)} aria-label="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            </div>
            <input className="input" placeholder={hints.title} value={e.title} onChange={(ev) => setEntry(key, i, "title", ev.target.value)} />
            <input className="input" placeholder={hints.sub} value={e.sub} onChange={(ev) => setEntry(key, i, "sub", ev.target.value)} />
            <div className="grid gap-2.5 sm:grid-cols-2">
              <input className="input" placeholder={hints.period} value={e.period} onChange={(ev) => setEntry(key, i, "period", ev.target.value)} />
              <input className="input" placeholder={hints.place} value={e.place} onChange={(ev) => setEntry(key, i, "place", ev.target.value)} />
            </div>
            {hints.points && <textarea className="input" rows={key === "education" ? 2 : 4} placeholder={hints.points} value={e.points} onChange={(ev) => setEntry(key, i, "points", ev.target.value)} />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Print only the resume copy at the end of <body>, on A4 with no page margin. */}
      <style>{`#resume-print-root { display: none; } @media print { @page { size: A4; margin: 0; } body > *:not(#resume-print-root) { display: none !important; } #resume-print-root { display: block !important; } html, body { background: #fff !important; padding: 0 !important; } #resume-print-root article { min-height: 0 !important; } }`}</style>
      {mounted && createPortal(<div id="resume-print-root"><ResumeSheet r={r} id="resume-sheet-print" /></div>, document.body)}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Resume builder</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600">Make the resume you’ll actually send: pick a template, fill the sections, then download a PDF or a Word file. Saved in this browser as you type.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn-ghost"
            onClick={() => {
              if (!r.name || confirm("Replace what you have typed with the example resume?")) setR({ ...EXAMPLE_RESUME, template: r.template, accent: r.accent, font: r.font, density: r.density });
            }}
          >
            <Sparkles className="h-4 w-4" /> Fill example
          </button>
          <button className="btn-ghost" onClick={downloadWord} disabled={busy === "word"}>
            <FileText className="h-4 w-4" /> {busy === "word" ? "Preparing…" : "Word (.docx)"}
          </button>
          <button className="btn-primary" onClick={printPdf}>
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <a href="#resume-preview" className="btn-ghost lg:hidden">
            See preview ↓
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* ---------- Editor ---------- */}
        <div className="min-w-0 space-y-4">
          <div className="card space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => set("template", t.id)} className={`rounded-lg border px-3 py-2 text-sm ${r.template === t.id ? "border-brand-500 bg-brand-50 font-semibold text-brand-700" : "border-slate-200 hover:border-slate-300"}`}>
                  {t.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">{template.note}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <span className="flex items-center gap-1.5">
                {ACCENTS.map((c) => (
                  <button key={c} onClick={() => set("accent", c)} disabled={r.template === "classic"} className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-surface disabled:opacity-30 ${r.accent === c ? "ring-2 ring-slate-900" : ""}`} style={{ background: c }} aria-label={`Accent colour ${c}`} title={r.template === "classic" ? "Classic is black and white" : undefined} />
                ))}
              </span>
              <span className="flex gap-1">
                {(["sans", "serif"] as const).map((f) => (
                  <button key={f} onClick={() => set("font", f)} className={`rounded-lg border px-2.5 py-1 text-sm ${r.font === f ? "border-brand-500 bg-brand-50 font-medium text-brand-700" : "border-slate-200"}`} style={{ fontFamily: f === "serif" ? "Georgia, serif" : undefined }}>
                    {f === "sans" ? "Sans" : "Serif"}
                  </button>
                ))}
              </span>
              <span className="flex gap-1">
                {(["compact", "normal", "relaxed"] as const).map((d) => (
                  <button key={d} onClick={() => set("density", d)} className={`rounded-lg border px-2.5 py-1 text-sm capitalize ${r.density === d ? "border-brand-500 bg-brand-50 font-medium text-brand-700" : "border-slate-200"}`}>
                    {d}
                  </button>
                ))}
              </span>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm ${tab === t.id ? "bg-ink font-medium text-on-ink" : "text-slate-600 hover:bg-slate-100"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "about" && (
              <div className="space-y-3">
                {field("Full name", r.name, (v) => set("name", v), { placeholder: "Aarav Sharma" })}
                {field("Headline", r.headline, (v) => set("headline", v), { placeholder: "B.Tech CSE (2026) · Java, React, SQL", hint: "One line under your name: degree and year, or your target role, plus 3–4 key skills." })}
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Email", r.email, (v) => set("email", v), { placeholder: "name@email.com" })}
                  {field("Phone", r.phone, (v) => set("phone", v), { placeholder: "+91 98765 43210" })}
                </div>
                {field("City", r.location, (v) => set("location", v), { placeholder: "Lucknow, Uttar Pradesh" })}
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("LinkedIn", r.linkedin, (v) => set("linkedin", v), { placeholder: "linkedin.com/in/…" })}
                  {field("GitHub", r.github, (v) => set("github", v), { placeholder: "github.com/…" })}
                </div>
                {field("Portfolio / other link", r.website, (v) => set("website", v), { placeholder: "Optional", hint: "Email, phone and links become clickable in the PDF and Word file." })}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  {r.photo ? <img src={r.photo} alt="Your photo" className="h-14 w-14 rounded-full object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400"><ImagePlus className="h-5 w-5" /></span>}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    {toggle("Show a photo", r.showPhoto, (v) => set("showPhoto", v), "Optional. Many Indian employers expect one; leave it off for companies abroad.")}
                    <div className="flex gap-2">
                      <button className="btn-ghost px-2.5 py-1 text-xs" onClick={() => photoInput.current?.click()}>
                        {r.photo ? "Change photo" : "Upload photo"}
                      </button>
                      {r.photo && (
                        <button className="btn-ghost px-2.5 py-1 text-xs text-red-600" onClick={() => setR((x) => ({ ...x, photo: "", showPhoto: false }))}>
                          <X className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    ref={photoInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (!f) return;
                      try {
                        const photo = await squarePhoto(f);
                        setR((x) => ({ ...x, photo, showPhoto: true }));
                      } catch {
                        alert("Could not read that image. Try a JPG or PNG.");
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {tab === "summary" && (
              <div className="space-y-2">
                {field("Professional summary", r.summary, (v) => set("summary", v), { area: true, rows: 6, placeholder: "2–3 lines: who you are, your best proof (a project, rank or internship with a number), and the role you want." })}
                <p className="text-xs text-slate-500">{r.summary.trim().length} characters · aim for 120–420 · wrap words in **double stars** to make them bold.</p>
              </div>
            )}

            {r.order.includes(tab as SectionKey) && sectionEditor(tab as SectionKey)}

            {tab === "skills" && (
              <div className="space-y-3">
                {field("Skills", r.skills, (v) => set("skills", v), { area: true, rows: 6, placeholder: "Languages: Java, Python, SQL\nFrameworks: Spring Boot, React\nTools: Git, Docker, Linux", hint: "One group per line as “Group: items”. Only list what you can answer interview questions on." })}
                {field("Achievements (one per line)", r.achievements, (v) => set("achievements", v), { area: true, rows: 4, placeholder: "Finalist, Smart India Hackathon 2024\n4★ on CodeChef (max rating 1850)" })}
              </div>
            )}

            {tab === "extra" && (
              <div className="space-y-4">
                <div className="space-y-2 rounded-xl border border-slate-200 p-3.5">
                  <div className="text-sm font-medium text-slate-800">Add a section</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SECTION_PRESETS.filter((p) => !r.custom.some((c) => c.title === p)).map((p) => (
                      <button key={p} className="chip bg-slate-100 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-200" onClick={() => addCustom(p)}>
                        <Plus className="h-3 w-3" /> {p}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className="input" placeholder="Or type your own section name" value={newSection} onChange={(e) => setNewSection(e.target.value)} />
                    <button className="btn-ghost shrink-0" onClick={() => addCustom(newSection.trim())} disabled={!newSection.trim()}>
                      Add
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Languages", r.languages, (v) => set("languages", v), { placeholder: "English, Hindi" })}
                  {field("Interests", r.interests, (v) => set("interests", v), { placeholder: "Chess, open source" })}
                </div>
                <div className="space-y-3 rounded-xl border border-slate-200 p-3.5">
                  {toggle("Personal details", r.showPersonal, (v) => set("showPersonal", v), "Date of birth and nationality. Common in Indian resumes; leave off for private companies unless asked.")}
                  {r.showPersonal && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {field("Date of birth", r.dob, (v) => set("dob", v), { placeholder: "15 August 2004" })}
                      {field("Nationality", r.nationality, (v) => set("nationality", v), { placeholder: "Indian" })}
                    </div>
                  )}
                  {toggle("Declaration with place, date and signature line", r.declaration, (v) => set("declaration", v), "“I hereby declare that the information given above is true…”: often asked for in government and campus forms.")}
                  {r.declaration && field("Place", r.declPlace, (v) => set("declPlace", v), { placeholder: "Lucknow" })}
                </div>
                <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3">
                  <button className="btn-ghost text-xs" onClick={exportBackup}>
                    <FileDown className="h-4 w-4" /> Save backup file
                  </button>
                  <button className="btn-ghost text-xs" onClick={() => importInput.current?.click()}>
                    <FileUp className="h-4 w-4" /> Load backup file
                  </button>
                  <input
                    ref={importInput}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) importBackup(f);
                    }}
                  />
                  <button
                    className="btn-ghost text-xs text-red-600"
                    onClick={() => {
                      if (confirm("Clear the whole resume? Save a backup first if you may need it.")) setR({ ...EMPTY_RESUME, template: r.template, accent: r.accent, font: r.font, density: r.density });
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Clear everything
                  </button>
                </div>
                <p className="text-xs text-slate-500">The backup file lets you move your resume to another phone or computer, or keep versions for different jobs.</p>
              </div>
            )}
          </div>

          {/* ---------- Strength ---------- */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Resume strength</h2>
              <span className={`text-lg font-semibold tabular-nums ${score >= 80 ? "text-emerald-700" : score >= 50 ? "text-amber-700" : "text-red-700"}`}>{score}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.max(score, 3)}%` }} />
            </div>
            <ul className="space-y-1.5 text-sm">
              {checks.map((c) => (
                <li key={c.text} className={`flex gap-2 ${c.ok ? "text-slate-500" : "text-slate-800"}`}>
                  {c.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Live preview ---------- */}
        <div id="resume-preview" className="min-w-0 scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
          {pages > 1 && (
            <p className="mb-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {pages} pages. Freshers should keep to one: try Compact spacing, or shorten bullets. Two pages are fine with 3+ years of experience.
            </p>
          )}
          <div ref={wrap} className="w-full">
            <div className="relative overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10" style={{ width: PAGE_W * scale, height: pages * PAGE_H * scale }}>
              <div ref={preview} style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: PAGE_W }}>
                <ResumeSheet r={r} />
              </div>
              {/* Where page 2 starts in the PDF. */}
              {Array.from({ length: pages - 1 }, (_, i) => (
                <div key={i} className="pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-red-400" style={{ top: (i + 1) * PAGE_H * scale }}>
                  <span className="absolute right-1 -top-5 rounded bg-red-500 px-1.5 text-[10px] text-white">page {i + 2}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">A4 preview: exactly what the PDF looks like. In the print window choose “Save as PDF”; links stay clickable.</p>
        </div>
      </div>
    </div>
  );
}
