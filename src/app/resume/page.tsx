"use client";

import { ArrowDown, ArrowUp, CheckCircle2, Circle, Download, Plus, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Resume builder for freshers. One A4 page, three templates, live preview that matches the PDF
 * exactly (the preview is the printed page, scaled down). Everything stays in this browser.
 * Text is real text in a single reading order, so applicant-tracking systems can parse it.
 */

// ---------------- Data ----------------

interface Entry {
  title: string;
  sub: string;
  period: string;
  place: string;
  points: string;
}
type ListKey = "education" | "projects" | "experience" | "certifications";
type Template = "classic" | "modern" | "sidebar";
type Font = "sans" | "serif";
interface Resume {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  education: Entry[];
  projects: Entry[];
  experience: Entry[];
  certifications: Entry[];
  skills: string;
  achievements: string;
  languages: string;
  order: ListKey[];
  template: Template;
  accent: string;
  font: Font;
}

const KEY = "studyclip:resume";
const blank = (): Entry => ({ title: "", sub: "", period: "", place: "", points: "" });
const EMPTY: Resume = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "",
  education: [blank()],
  projects: [blank()],
  experience: [],
  certifications: [],
  skills: "",
  achievements: "",
  languages: "",
  order: ["education", "projects", "experience", "certifications"],
  template: "modern",
  accent: "#1d4ed8",
  font: "sans",
};

const EXAMPLE: Resume = {
  ...EMPTY,
  name: "Aarav Sharma",
  headline: "B.Tech Computer Science (2026) · Java, Spring Boot, React, SQL",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  location: "Lucknow, Uttar Pradesh",
  linkedin: "linkedin.com/in/aarav-sharma",
  github: "github.com/aaravsharma",
  website: "",
  summary:
    "Final-year CSE student who builds full-stack web apps with Java and React. Solved 400+ problems on coding platforms and led a 4-member team to the finals of a national hackathon. Looking for a software engineer role where I can ship reliable backend services.",
  education: [
    { title: "B.Tech, Computer Science and Engineering", sub: "Institute of Engineering and Technology, Lucknow", period: "2022 – 2026", place: "CGPA 8.4 / 10", points: "Coursework: Data Structures, DBMS, Operating Systems, Computer Networks" },
    { title: "Class XII (CBSE)", sub: "Kendriya Vidyalaya, Lucknow", period: "2022", place: "91.2%", points: "" },
  ],
  projects: [
    {
      title: "CampusCart: student marketplace",
      sub: "Spring Boot, React, MySQL, JWT",
      period: "2025",
      place: "github.com/aaravsharma/campuscart",
      points:
        "Built a buy-and-sell web app for hostel students with search, chat and listing photos\nDesigned REST APIs and a normalised MySQL schema; added JWT login and role-based access\nCut search time from 1.8 s to 0.3 s with indexes and paginated queries; 600+ registered users",
    },
    {
      title: "Attendance with face recognition",
      sub: "Python, OpenCV, Flask",
      period: "2024",
      place: "",
      points: "Marked class attendance from a webcam feed with 94% accuracy on 120 students\nExported daily reports to Excel and email for the department office",
    },
  ],
  experience: [
    {
      title: "Software Development Intern",
      sub: "TechNova Solutions",
      period: "May – Jul 2025",
      place: "Noida (on-site)",
      points: "Added 6 REST endpoints to an inventory service used by 40+ warehouses\nWrote JUnit tests that raised coverage from 52% to 78% and caught 3 pricing bugs before release",
    },
  ],
  certifications: [{ title: "Oracle Certified Associate, Java SE", sub: "Oracle", period: "2025", place: "", points: "" }],
  skills: "Languages: Java, Python, C, JavaScript, SQL\nFrameworks: Spring Boot, React, Flask\nTools: Git, Docker, Postman, Linux\nCS fundamentals: DSA, OOP, DBMS, OS, Computer Networks",
  achievements:
    "Finalist, Smart India Hackathon 2024 (top 5 of 120 teams in the problem statement)\n4★ on CodeChef (max rating 1850); 400+ problems solved across platforms\nTechnical head, college coding club: ran 10 contests with 300+ participants",
  languages: "English, Hindi",
};

const SECTION_LABEL: Record<ListKey, string> = { education: "Education", projects: "Projects", experience: "Experience", certifications: "Certifications" };
const FIELD_HINTS: Record<ListKey, { title: string; sub: string; period: string; place: string; points: string }> = {
  education: { title: "Degree or class, e.g. B.Tech CSE", sub: "College / school", period: "Years, e.g. 2022 – 2026", place: "Score, e.g. CGPA 8.4 or 91%", points: "Optional: coursework, rank, thesis (one per line)" },
  projects: { title: "Project name", sub: "Tech used", period: "Year", place: "Link (GitHub / live)", points: "What it does · what you built · a result with a number (one per line)" },
  experience: { title: "Role, e.g. Software Intern", sub: "Company", period: "Dates", place: "City / remote", points: "Start each line with a verb and add a number: Built…, Reduced… by 40%" },
  certifications: { title: "Certificate", sub: "Issued by", period: "Year", place: "Credential link (optional)", points: "" },
};
const ACCENTS = ["#1d4ed8", "#0f766e", "#7c3aed", "#be123c", "#1f2937"];
const TEMPLATES: { id: Template; name: string }[] = [
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
  { id: "sidebar", name: "Side headings" },
];

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const filled = (e: Entry) => !!(e.title || e.sub);
const contactOf = (r: Resume) => [r.email, r.phone, r.location, r.linkedin, r.github, r.website].filter(Boolean);

// ---------------- Strength check ----------------

const WEAK_START = /^(i |my |responsible for|worked on|helped|did |was )/i;

function strength(r: Resume) {
  const bullets = [...r.projects, ...r.experience].flatMap((e) => lines(e.points));
  const checks = [
    { ok: !!r.name && !!r.email && !!r.phone, text: "Name, email and phone are filled in" },
    { ok: !!(r.linkedin || r.github), text: "LinkedIn or GitHub link added" },
    { ok: r.summary.trim().length >= 120 && r.summary.trim().length <= 420, text: "Summary is 2–3 lines (120–420 characters)" },
    { ok: r.education.some(filled) && r.education.some((e) => !!e.place), text: "Education has your score (CGPA / %)" },
    { ok: r.projects.filter(filled).length >= 2, text: "At least 2 projects" },
    { ok: bullets.length >= 4, text: "At least 4 bullet points across projects and experience" },
    { ok: bullets.length > 0 && bullets.filter((b) => /\d/.test(b)).length >= Math.ceil(bullets.length / 2), text: "Half your bullets have a number (%, users, time saved)" },
    { ok: bullets.length > 0 && !bullets.some((b) => WEAK_START.test(b)), text: "Bullets start with an action verb (Built, Led, Reduced…), not “I” or “Responsible for”" },
    { ok: lines(r.skills).length >= 2, text: "Skills grouped in at least 2 lines (Languages, Tools…)" },
    { ok: lines(r.achievements).length >= 1 || r.certifications.some(filled), text: "An achievement or certification" },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  return { score, checks };
}

// ---------------- Preview (the printed page) ----------------

/** A4 at 96 dpi. The preview renders at this size and is scaled to fit; print uses it 1:1. */
const PAGE_W = 794;
const PAGE_H = 1123;

function Sheet({ r, id = "resume-sheet" }: { r: Resume; id?: string }) {
  const font = r.font === "serif" ? "Georgia, 'Times New Roman', serif" : "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const accent = r.template === "classic" ? "#111827" : r.accent;
  const contact = contactOf(r);
  const skills = lines(r.skills).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { label: l.slice(0, i).trim(), items: l.slice(i + 1).trim() } : { label: "", items: l };
  });

  const Heading = ({ children }: { children: string }) =>
    r.template === "sidebar" ? (
      <h2 style={{ color: accent }} className="pt-0.5 text-[11.5px] font-bold tracking-[0.08em] uppercase">
        {children}
      </h2>
    ) : r.template === "modern" ? (
      <h2 style={{ color: accent, borderColor: accent }} className="mb-1.5 border-b-2 pb-0.5 text-[13px] font-bold tracking-[0.06em] uppercase">
        {children}
      </h2>
    ) : (
      <h2 style={{ color: "#111827" }} className="mb-1.5 border-b border-gray-800 pb-0.5 text-center text-[13px] font-bold tracking-[0.12em] uppercase">{children}</h2>
    );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) =>
    r.template === "sidebar" ? (
      <section className="grid grid-cols-[118px_1fr] gap-4 border-t border-gray-200 pt-2.5">
        <Heading>{title}</Heading>
        <div className="min-w-0">{children}</div>
      </section>
    ) : (
      <section>
        <Heading>{title}</Heading>
        {children}
      </section>
    );

  const EntryView = ({ e }: { e: Entry }) => (
    <div className="mb-2 last:mb-0" style={{ breakInside: "avoid" }}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0 text-[12.5px] leading-snug">
          <b className="text-gray-900">{e.title}</b>
          {e.sub && <span className="text-gray-700">{e.title ? " · " : ""}{e.sub}</span>}
        </div>
        {e.period && <div className="shrink-0 text-[11.5px] text-gray-600">{e.period}</div>}
      </div>
      {e.place && <div className="text-[11.5px] text-gray-600">{e.place}</div>}
      {lines(e.points).length > 0 && (
        <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11.8px] leading-snug text-gray-800 marker:text-gray-500">
          {lines(e.points).map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const body = (
    <>
      {r.summary.trim() && (
        <Section title="Summary">
          <p className="text-[11.8px] leading-snug text-gray-800">{r.summary.trim()}</p>
        </Section>
      )}
      {r.order.map((k) =>
        r[k].some(filled) ? (
          <Section key={k} title={SECTION_LABEL[k]}>
            {r[k].filter(filled).map((e, i) => (
              <EntryView key={i} e={e} />
            ))}
          </Section>
        ) : null,
      )}
      {skills.length > 0 && (
        <Section title="Skills">
          <div className="space-y-0.5 text-[11.8px] leading-snug text-gray-800">
            {skills.map((s, i) => (
              <div key={i}>
                {s.label && <b className="text-gray-900">{s.label}: </b>}
                {s.items}
              </div>
            ))}
          </div>
        </Section>
      )}
      {lines(r.achievements).length > 0 && (
        <Section title="Achievements">
          <ul className="list-disc space-y-0.5 pl-4 text-[11.8px] leading-snug text-gray-800 marker:text-gray-500">
            {lines(r.achievements).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
      {r.languages.trim() && (
        <Section title="Languages">
          <p className="text-[11.8px] text-gray-800">{r.languages.trim()}</p>
        </Section>
      )}
    </>
  );

  return (
    <article id={id} style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: font }} className="bg-white px-[46px] py-[40px] text-gray-900" data-theme="light">
      {r.template === "classic" ? (
        <header className="mb-3 text-center">
          <h1 style={{ color: "#111827" }} className="text-[26px] leading-tight font-bold tracking-wide">{r.name || "Your Name"}</h1>
          {r.headline && <p className="mt-0.5 text-[12.5px] text-gray-700">{r.headline}</p>}
          <p className="mt-1 text-[11.5px] text-gray-700">{contact.join("  •  ") || "email  •  phone  •  city  •  LinkedIn"}</p>
        </header>
      ) : r.template === "modern" ? (
        <header className="mb-3">
          <h1 style={{ color: accent }} className="text-[30px] leading-tight font-bold tracking-tight">
            {r.name || "Your Name"}
          </h1>
          {r.headline && <p className="mt-0.5 text-[13px] font-medium text-gray-700">{r.headline}</p>}
          <p className="mt-1.5 text-[11.5px] text-gray-600">{contact.join("   |   ") || "email   |   phone   |   city   |   LinkedIn"}</p>
        </header>
      ) : (
        <header className="mb-3 flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 style={{ color: accent }} className="text-[28px] leading-tight font-bold">
              {r.name || "Your Name"}
            </h1>
            {r.headline && <p className="mt-0.5 text-[12.5px] text-gray-700">{r.headline}</p>}
          </div>
          <div className="shrink-0 text-right text-[11px] leading-snug text-gray-700">
            {(contact.length ? contact : ["email", "phone", "city"]).map((c, i) => (
              <div key={i}>{c}</div>
            ))}
          </div>
        </header>
      )}
      <div className={r.template === "sidebar" ? "space-y-2.5" : "space-y-3"}>{body}</div>
    </article>
  );
}

// ---------------- Page ----------------

export default function ResumePage() {
  const [r, setR] = useState<Resume>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"about" | ListKey | "skills">("about");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const old = JSON.parse(saved);
        // Older saves had a single "links" field and no `place`; keep what they had.
        const upgrade = (list?: Partial<Entry>[]) => (Array.isArray(list) ? list.map((e) => ({ ...blank(), ...e })) : undefined);
        setR({
          ...EMPTY,
          ...old,
          linkedin: old.linkedin ?? old.links ?? "",
          education: upgrade(old.education) ?? EMPTY.education,
          projects: upgrade(old.projects) ?? EMPTY.projects,
          experience: upgrade(old.experience) ?? [],
          certifications: upgrade(old.certifications) ?? [],
          order: Array.isArray(old.order) && old.order.length === 4 ? old.order : EMPTY.order,
        });
      }
    } catch {
      /* storage blocked or old data unreadable: start blank */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(r));
    } catch {
      /* storage blocked: the resume still works for this visit */
    }
  }, [r, loaded]);

  const set = <K extends keyof Resume>(k: K, v: Resume[K]) => setR((x) => ({ ...x, [k]: v }));
  const setEntry = (list: ListKey, i: number, k: keyof Entry, v: string) => setR((x) => ({ ...x, [list]: x[list].map((e, j) => (j === i ? { ...e, [k]: v } : e)) }));
  const add = (list: ListKey) => setR((x) => ({ ...x, [list]: [...x[list], blank()] }));
  const remove = (list: ListKey, i: number) => setR((x) => ({ ...x, [list]: x[list].filter((_, j) => j !== i) }));
  const moveEntry = (list: ListKey, i: number, d: -1 | 1) =>
    setR((x) => {
      const a = [...x[list]];
      const j = i + d;
      if (j < 0 || j >= a.length) return x;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...x, [list]: a };
    });
  const moveSection = (k: ListKey, d: -1 | 1) =>
    setR((x) => {
      const a = [...x.order];
      const i = a.indexOf(k);
      const j = i + d;
      if (j < 0 || j >= a.length) return x;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...x, order: a };
    });

  // Scale the A4 sheet to the preview column, and measure whether it runs past one page.
  const wrap = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [overflow, setOverflow] = useState(false);
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / PAGE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    const h = sheet.current?.querySelector("#resume-sheet")?.scrollHeight ?? 0;
    setOverflow(h > PAGE_H + 2);
  }, [r, scale]);

  const { score, checks } = useMemo(() => strength(r), [r]);
  const tabs: { id: typeof tab; label: string }[] = [
    { id: "about", label: "Personal" },
    ...r.order.map((k) => ({ id: k, label: SECTION_LABEL[k] })),
    { id: "skills", label: "Skills & more" },
  ];

  const input = (label: string, value: string, onChange: (v: string) => void, opts: { placeholder?: string; area?: boolean; rows?: number } = {}) => (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {opts.area ? (
        <textarea className="input mt-1" rows={opts.rows ?? 3} value={value} placeholder={opts.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input mt-1" value={value} placeholder={opts.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );

  const listEditor = (list: ListKey) => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          Section order:
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => moveSection(list, -1)} aria-label={`Move ${SECTION_LABEL[list]} up`}>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => moveSection(list, 1)} aria-label={`Move ${SECTION_LABEL[list]} down`}>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => add(list)}>
          <Plus className="h-3.5 w-3.5" /> Add {SECTION_LABEL[list].toLowerCase().replace(/s$/, "")}
        </button>
      </div>
      {!r[list].length && <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">Nothing here yet. Leave it empty and the section won’t appear on the resume.</p>}
      {r[list].map((e, i) => (
        <div key={i} className="space-y-2.5 rounded-xl border border-slate-200 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">
              {SECTION_LABEL[list].replace(/s$/, "")} {i + 1}
            </span>
            <span className="flex gap-1">
              <button className="rounded p-1 hover:bg-slate-100" onClick={() => moveEntry(list, i, -1)} aria-label="Move up">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button className="rounded p-1 hover:bg-slate-100" onClick={() => moveEntry(list, i, 1)} aria-label="Move down">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button className="rounded p-1 text-red-600 hover:bg-red-50" onClick={() => remove(list, i)} aria-label="Remove">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
          <input className="input" placeholder={FIELD_HINTS[list].title} value={e.title} onChange={(ev) => setEntry(list, i, "title", ev.target.value)} />
          <input className="input" placeholder={FIELD_HINTS[list].sub} value={e.sub} onChange={(ev) => setEntry(list, i, "sub", ev.target.value)} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <input className="input" placeholder={FIELD_HINTS[list].period} value={e.period} onChange={(ev) => setEntry(list, i, "period", ev.target.value)} />
            <input className="input" placeholder={FIELD_HINTS[list].place} value={e.place} onChange={(ev) => setEntry(list, i, "place", ev.target.value)} />
          </div>
          {FIELD_HINTS[list].points && <textarea className="input" rows={list === "education" ? 2 : 4} placeholder={FIELD_HINTS[list].points} value={e.points} onChange={(ev) => setEntry(list, i, "points", ev.target.value)} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Print only the sheet, on A4 with no page margin (the sheet has its own). */}
      <style>{`#resume-print-root { display: none; } @media print { @page { size: A4; margin: 0; } body > *:not(#resume-print-root) { display: none !important; } #resume-print-root { display: block !important; } html, body { background: #fff !important; padding: 0 !important; } }`}</style>
      {mounted && createPortal(<div id="resume-print-root"><Sheet r={r} id="resume-sheet-print" /></div>, document.body)}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Resume builder</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600">A one-page, recruiter-ready resume. Pick a template, fill the sections, and download the PDF. It saves in this browser as you type.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn-ghost"
            onClick={() => {
              if (!r.name || confirm("Replace what you have typed with the example resume?")) setR({ ...EXAMPLE, template: r.template, accent: r.accent, font: r.font });
            }}
          >
            <Sparkles className="h-4 w-4" /> Fill example
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-sm font-medium text-slate-700">Template</span>
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => set("template", t.id)} className={`rounded-lg border px-3 py-1.5 text-sm ${r.template === t.id ? "border-brand-500 bg-brand-50 font-medium text-brand-700" : "border-slate-200 hover:border-slate-300"}`}>
                  {t.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-sm font-medium text-slate-700">Colour</span>
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => set("accent", c)}
                  disabled={r.template === "classic"}
                  className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-surface disabled:opacity-30 ${r.accent === c ? "ring-2 ring-slate-900" : ""}`}
                  style={{ background: c }}
                  aria-label={`Accent colour ${c}`}
                  title={r.template === "classic" ? "The classic template is black and white" : undefined}
                />
              ))}
              <span className="ml-3 text-sm font-medium text-slate-700">Font</span>
              {(["sans", "serif"] as const).map((f) => (
                <button key={f} onClick={() => set("font", f)} className={`rounded-lg border px-3 py-1 text-sm ${r.font === f ? "border-brand-500 bg-brand-50 font-medium text-brand-700" : "border-slate-200"}`} style={{ fontFamily: f === "serif" ? "Georgia, serif" : undefined }}>
                  {f === "sans" ? "Sans" : "Serif"}
                </button>
              ))}
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
                {input("Full name", r.name, (v) => set("name", v), { placeholder: "Aarav Sharma" })}
                {input("Headline", r.headline, (v) => set("headline", v), { placeholder: "B.Tech CSE (2026) · Java, React, SQL" })}
                <div className="grid gap-3 sm:grid-cols-2">
                  {input("Email", r.email, (v) => set("email", v), { placeholder: "name@email.com" })}
                  {input("Phone", r.phone, (v) => set("phone", v), { placeholder: "+91 …" })}
                </div>
                {input("City", r.location, (v) => set("location", v), { placeholder: "Lucknow, Uttar Pradesh" })}
                <div className="grid gap-3 sm:grid-cols-2">
                  {input("LinkedIn", r.linkedin, (v) => set("linkedin", v), { placeholder: "linkedin.com/in/…" })}
                  {input("GitHub", r.github, (v) => set("github", v), { placeholder: "github.com/…" })}
                </div>
                {input("Portfolio / other link", r.website, (v) => set("website", v), { placeholder: "Optional" })}
                {input("Summary", r.summary, (v) => set("summary", v), { area: true, rows: 4, placeholder: "2–3 lines: what you are, your best proof (a project, rank or internship), and the role you want." })}
                <p className="text-xs text-slate-500">{r.summary.trim().length} characters · aim for 120–420</p>
              </div>
            )}
            {(["education", "projects", "experience", "certifications"] as const).map((k) => tab === k && <div key={k}>{listEditor(k)}</div>)}
            {tab === "skills" && (
              <div className="space-y-3">
                {input("Skills (one group per line, “Group: items”)", r.skills, (v) => set("skills", v), { area: true, rows: 5, placeholder: "Languages: Java, Python, SQL\nFrameworks: Spring Boot, React\nTools: Git, Docker, Linux" })}
                {input("Achievements (one per line)", r.achievements, (v) => set("achievements", v), { area: true, rows: 4, placeholder: "Finalist, Smart India Hackathon 2024\n4★ on CodeChef (1850)" })}
                {input("Languages", r.languages, (v) => set("languages", v), { placeholder: "English, Hindi" })}
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
            <button
              className="text-xs text-red-600 hover:underline"
              onClick={() => {
                if (confirm("Clear the whole resume? This cannot be undone.")) setR({ ...EMPTY, template: r.template, accent: r.accent, font: r.font });
              }}
            >
              Clear everything
            </button>
          </div>
        </div>

        {/* ---------- Live preview ---------- */}
        <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          {overflow && (
            <p className="mb-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Your resume runs past one page. Freshers should keep to one: shorten bullets or remove older items.
            </p>
          )}
          <div ref={wrap} className="w-full">
            <div id="resume-preview" ref={sheet}>
              <div id="resume-frame" className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 " style={{ width: PAGE_W * scale, height: (overflow ? (sheet.current?.querySelector("#resume-sheet")?.scrollHeight ?? PAGE_H) : PAGE_H) * scale }}>
                <div id="resume-scale" style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: PAGE_W }}>
                  <Sheet r={r} />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">A4 preview · exactly what the PDF will look like. In the print window choose “Save as PDF”.</p>
        </div>
      </div>
    </div>
  );
}
