"use client";

import { Plus, Printer, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * A simple, ATS-friendly resume builder for freshers: one column, standard headings, no images
 * or tables, so applicant-tracking systems read it cleanly. It saves in this browser only and
 * downloads as PDF through the browser's print dialog ("Save as PDF").
 */

interface Entry {
  title: string;
  sub: string;
  period: string;
  points: string;
}
interface Resume {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  summary: string;
  education: Entry[];
  experience: Entry[];
  projects: Entry[];
  skills: string;
  achievements: string;
}

const KEY = "studyclip:resume";
const blank = (): Entry => ({ title: "", sub: "", period: "", points: "" });
const EMPTY: Resume = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  summary: "",
  education: [blank()],
  experience: [],
  projects: [blank()],
  skills: "",
  achievements: "",
};

const LABELS = {
  education: { title: "Degree / class", sub: "College / school", period: "Years and score (e.g. 2022–26 · CGPA 8.4)", points: "Highlights (one per line, optional)" },
  experience: { title: "Role", sub: "Company", period: "Dates", points: "What you did and the result (one per line, start with a verb)" },
  projects: { title: "Project name", sub: "Tech used", period: "Link or dates (optional)", points: "What it does, your part, and a result or number (one per line)" },
} as const;

type ListKey = keyof typeof LABELS;
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export default function ResumePage() {
  const [r, setR] = useState<Resume>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setR({ ...EMPTY, ...JSON.parse(saved) });
    } catch {
      /* storage blocked or bad data: start blank */
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

  const set = (k: keyof Resume, v: string) => setR((x) => ({ ...x, [k]: v }));
  const setEntry = (list: ListKey, i: number, k: keyof Entry, v: string) => setR((x) => ({ ...x, [list]: x[list].map((e, j) => (j === i ? { ...e, [k]: v } : e)) }));
  const add = (list: ListKey) => setR((x) => ({ ...x, [list]: [...x[list], blank()] }));
  const remove = (list: ListKey, i: number) => setR((x) => ({ ...x, [list]: x[list].filter((_, j) => j !== i) }));

  const field = (k: keyof Resume, label: string, opts: { area?: boolean; placeholder?: string } = {}) => (
    <label className="block text-sm">
      <span className="text-slate-600">{label}</span>
      {opts.area ? (
        <textarea className="input mt-1 min-h-20" value={r[k] as string} placeholder={opts.placeholder} onChange={(e) => set(k, e.target.value)} />
      ) : (
        <input className="input mt-1" value={r[k] as string} placeholder={opts.placeholder} onChange={(e) => set(k, e.target.value)} />
      )}
    </label>
  );

  const listEditor = (list: ListKey, heading: string) => (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{heading}</h3>
        <button className="btn-ghost px-2.5 py-1 text-xs" onClick={() => add(list)}>
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {r[list].map((e, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-slate-200 p-3">
          {(["title", "sub", "period"] as const).map((k) => (
            <input key={k} className="input" placeholder={LABELS[list][k]} value={e[k]} onChange={(ev) => setEntry(list, i, k, ev.target.value)} />
          ))}
          <textarea className="input min-h-16" placeholder={LABELS[list].points} value={e.points} onChange={(ev) => setEntry(list, i, "points", ev.target.value)} />
          <button className="text-xs text-red-600 hover:underline" onClick={() => remove(list, i)}>
            <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Remove
          </button>
        </div>
      ))}
    </section>
  );

  const block = (heading: string, list: Entry[]) =>
    list.some((e) => e.title || e.sub) && (
      <section className="mt-4">
        <h2 className="border-b border-black pb-0.5 text-[13px] font-bold tracking-wide uppercase">{heading}</h2>
        {list
          .filter((e) => e.title || e.sub)
          .map((e, i) => (
            <div key={i} className="mt-2">
              <div className="flex justify-between gap-3 text-[13px]">
                <span>
                  <b>{e.title}</b>
                  {e.sub && <>, {e.sub}</>}
                </span>
                {e.period && <span className="shrink-0">{e.period}</span>}
              </div>
              {lines(e.points).length > 0 && (
                <ul className="mt-0.5 list-disc pl-5 text-[12.5px] leading-snug">
                  {lines(e.points).map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </section>
    );

  return (
    <div className="space-y-5">
      <div className="print:hidden">
        <h1 className="text-2xl font-semibold">Resume builder</h1>
        <p className="mt-1 text-sm text-slate-600">
          A clean one-page resume that applicant-tracking systems read well. It saves in this browser as you type. Click <b>Download PDF</b> and choose “Save as PDF” in the print dialog.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 print:hidden">
          <section className="card space-y-3">
            <h3 className="font-semibold text-slate-900">About you</h3>
            {field("name", "Full name")}
            {field("headline", "Headline", { placeholder: "e.g. B.Tech CSE 2026 · Java, SQL, React" })}
            <div className="grid gap-3 sm:grid-cols-2">
              {field("email", "Email")}
              {field("phone", "Phone")}
            </div>
            {field("location", "City")}
            {field("links", "Links", { placeholder: "LinkedIn, GitHub, portfolio (comma-separated)" })}
            {field("summary", "Summary (2–3 lines)", { area: true, placeholder: "What you are good at and the role you want." })}
          </section>
          <div className="card space-y-6">
            {listEditor("education", "Education")}
            {listEditor("projects", "Projects")}
            {listEditor("experience", "Internships / experience")}
          </div>
          <section className="card space-y-3">
            {field("skills", "Skills", { area: true, placeholder: "Languages: Java, Python\nTools: Git, MySQL\nCS: DSA, OOP, DBMS" })}
            {field("achievements", "Achievements and certifications (one per line)", { area: true })}
            <button
              className="text-xs text-red-600 hover:underline"
              onClick={() => {
                if (confirm("Clear the whole resume?")) setR(EMPTY);
              }}
            >
              Clear everything
            </button>
          </section>
        </div>

        <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="flex justify-end print:hidden">
            <button className="btn-primary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Download PDF
            </button>
          </div>
          {/* The page itself: white paper and black ink in both themes, and the only thing printed. */}
          <article id="resume-sheet" className="rounded-xl border border-slate-200 bg-white p-8 font-sans text-black shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black">{r.name || "Your Name"}</h1>
              {r.headline && <p className="text-[13px]">{r.headline}</p>}
              <p className="mt-1 text-[12px]">{[r.email, r.phone, r.location, r.links].filter(Boolean).join(" · ") || "email · phone · city · links"}</p>
            </div>
            {r.summary && (
              <section className="mt-4">
                <h2 className="border-b border-black pb-0.5 text-[13px] font-bold tracking-wide uppercase">Summary</h2>
                <p className="mt-1 text-[12.5px] leading-snug">{r.summary}</p>
              </section>
            )}
            {block("Education", r.education)}
            {lines(r.skills).length > 0 && (
              <section className="mt-4">
                <h2 className="border-b border-black pb-0.5 text-[13px] font-bold tracking-wide uppercase">Skills</h2>
                <ul className="mt-1 text-[12.5px] leading-snug">
                  {lines(r.skills).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            )}
            {block("Projects", r.projects)}
            {block("Experience", r.experience)}
            {lines(r.achievements).length > 0 && (
              <section className="mt-4">
                <h2 className="border-b border-black pb-0.5 text-[13px] font-bold tracking-wide uppercase">Achievements</h2>
                <ul className="mt-1 list-disc pl-5 text-[12.5px] leading-snug">
                  {lines(r.achievements).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
