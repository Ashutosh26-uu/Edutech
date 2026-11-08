/**
 * Resume data, the example resume, the strength check and the Word (.docx) export. The page
 * (app/resume) edits a Resume; components/ResumeSheet renders it as an A4 page.
 */

export interface Entry {
  title: string;
  sub: string;
  period: string;
  place: string;
  points: string;
}
export interface CustomSection {
  id: string;
  title: string;
  entries: Entry[];
}
export type BuiltIn = "education" | "projects" | "experience" | "certifications";
export type SectionKey = BuiltIn | `custom:${string}`;
export type Template = "modern" | "classic" | "sidebar" | "twocol";
export type Density = "compact" | "normal" | "relaxed";

export interface Resume {
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
  custom: CustomSection[];
  skills: string;
  achievements: string;
  languages: string;
  interests: string;
  /** Indian-style personal details, off by default. */
  showPersonal: boolean;
  dob: string;
  nationality: string;
  declaration: boolean;
  declPlace: string;
  /** A small square JPEG (data URL), shown only when showPhoto is on. */
  photo: string;
  showPhoto: boolean;
  order: SectionKey[];
  template: Template;
  accent: string;
  font: "sans" | "serif";
  density: Density;
}

export const STORAGE_KEY = "studyclip:resume";
export const blankEntry = (): Entry => ({ title: "", sub: "", period: "", place: "", points: "" });

export const EMPTY_RESUME: Resume = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "",
  education: [blankEntry()],
  projects: [blankEntry()],
  experience: [],
  certifications: [],
  custom: [],
  skills: "",
  achievements: "",
  languages: "",
  interests: "",
  showPersonal: false,
  dob: "",
  nationality: "",
  declaration: false,
  declPlace: "",
  photo: "",
  showPhoto: false,
  order: ["education", "projects", "experience", "certifications"],
  template: "modern",
  accent: "#1d4ed8",
  font: "sans",
  density: "normal",
};

export const EXAMPLE_RESUME: Resume = {
  ...EMPTY_RESUME,
  name: "Aarav Sharma",
  headline: "B.Tech Computer Science (2026) · Java, Spring Boot, React, SQL",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  location: "Lucknow, Uttar Pradesh",
  linkedin: "linkedin.com/in/aarav-sharma",
  github: "github.com/aaravsharma",
  summary:
    "Final-year CSE student who builds full-stack web apps with **Java and React**. Solved 400+ problems on coding platforms and led a 4-member team to the finals of a national hackathon. Looking for a software engineer role where I can ship reliable backend services.",
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
        "Built a buy-and-sell web app for hostel students with search, chat and listing photos\nDesigned REST APIs and a normalised MySQL schema; added JWT login and role-based access\nCut search time from **1.8 s to 0.3 s** with indexes and paginated queries; 600+ registered users",
    },
    {
      title: "Attendance with face recognition",
      sub: "Python, OpenCV, Flask",
      period: "2024",
      place: "",
      points: "Marked class attendance from a webcam feed with **94% accuracy** on 120 students\nExported daily reports to Excel and email for the department office",
    },
  ],
  experience: [
    {
      title: "Software Development Intern",
      sub: "TechNova Solutions",
      period: "May – Jul 2025",
      place: "Noida (on-site)",
      points: "Added 6 REST endpoints to an inventory service used by 40+ warehouses\nWrote JUnit tests that raised coverage from **52% to 78%** and caught 3 pricing bugs before release",
    },
  ],
  certifications: [{ title: "Oracle Certified Associate, Java SE", sub: "Oracle", period: "2025", place: "", points: "" }],
  custom: [
    {
      id: "por",
      title: "Positions of Responsibility",
      entries: [{ title: "Technical Head", sub: "College Coding Club", period: "2024 – 2025", place: "", points: "Ran 10 coding contests with 300+ participants and mentored 25 first-year students" }],
    },
  ],
  skills: "Languages: Java, Python, C, JavaScript, SQL\nFrameworks: Spring Boot, React, Flask\nTools: Git, Docker, Postman, Linux\nCS fundamentals: DSA, OOP, DBMS, OS, Computer Networks",
  achievements: "Finalist, Smart India Hackathon 2024 (top 5 of 120 teams in the problem statement)\n4★ on CodeChef (max rating 1850); 400+ problems solved across platforms",
  languages: "English, Hindi",
  interests: "Chess, open-source contribution",
  order: ["education", "experience", "projects", "custom:por", "certifications"],
};

export const BUILT_IN_LABEL: Record<BuiltIn, string> = { education: "Education", projects: "Projects", experience: "Experience", certifications: "Certifications" };
export const SECTION_PRESETS = ["Positions of Responsibility", "Extracurricular Activities", "Publications", "Volunteering", "Training", "Awards and Honours", "Hobbies"];

export const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
export const filledEntry = (e: Entry) => !!(e.title || e.sub);

/** The entries and title of any section key. */
export function sectionOf(r: Resume, key: SectionKey): { title: string; entries: Entry[] } | null {
  if (key.startsWith("custom:")) {
    const c = r.custom.find((x) => x.id === key.slice(7));
    return c ? { title: c.title || "Untitled section", entries: c.entries } : null;
  }
  const k = key as BuiltIn;
  return { title: BUILT_IN_LABEL[k], entries: r[k] };
}

/** A link target for a contact value: mailto for email, tel for phone, https for the rest. */
export function hrefOf(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return `mailto:${v}`;
  if (/^\+?[\d\s()-]{7,}$/.test(v)) return `tel:${v.replace(/[^\d+]/g, "")}`;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v)) return `https://${v}`;
  return null;
}

export const contactOf = (r: Resume) => [r.email, r.phone, r.location, r.linkedin, r.github, r.website].map((s) => s.trim()).filter(Boolean);

/** Splits "**bold**" markup into runs. */
export function boldRuns(text: string): { text: string; bold: boolean }[] {
  return text.split("**").map((t, i) => ({ text: t, bold: i % 2 === 1 })).filter((x) => x.text);
}

/** Older saves had different fields; keep everything that still fits. */
export function upgradeResume(raw: unknown): Resume {
  const old = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const entries = (v: unknown) => (Array.isArray(v) ? v.map((e) => ({ ...blankEntry(), ...(e as Partial<Entry>) })) : undefined);
  const custom = Array.isArray(old.custom)
    ? (old.custom as Partial<CustomSection>[]).filter((c) => c && typeof c.id === "string").map((c) => ({ id: c.id!, title: String(c.title ?? ""), entries: entries(c.entries) ?? [] }))
    : [];
  const valid = new Set<string>(["education", "projects", "experience", "certifications", ...custom.map((c) => `custom:${c.id}`)]);
  const order = Array.isArray(old.order) ? (old.order as string[]).filter((k) => valid.has(k)) : [];
  for (const k of valid) if (!order.includes(k)) order.push(k);
  const r = { ...EMPTY_RESUME, ...(old as Partial<Resume>) };
  return {
    ...r,
    linkedin: String(old.linkedin ?? old.links ?? ""),
    education: entries(old.education) ?? EMPTY_RESUME.education,
    projects: entries(old.projects) ?? EMPTY_RESUME.projects,
    experience: entries(old.experience) ?? [],
    certifications: entries(old.certifications) ?? [],
    custom,
    order: order as SectionKey[],
    template: (["modern", "classic", "sidebar", "twocol"] as const).includes(r.template) ? r.template : "modern",
    density: (["compact", "normal", "relaxed"] as const).includes(r.density) ? r.density : "normal",
  };
}

// ---------- Strength ----------

const WEAK_START = /^(i |my |responsible for|worked on|helped|did |was )/i;

export function resumeStrength(r: Resume) {
  const bullets = [...r.projects, ...r.experience, ...r.custom.flatMap((c) => c.entries)].flatMap((e) => lines(e.points));
  const checks = [
    { ok: !!r.name && !!r.email && !!r.phone, text: "Name, email and phone are filled in" },
    { ok: !!(r.linkedin || r.github), text: "LinkedIn or GitHub link added" },
    { ok: r.summary.trim().length >= 120 && r.summary.trim().length <= 420, text: "Summary is 2–3 lines (120–420 characters)" },
    { ok: r.education.some(filledEntry) && r.education.some((e) => !!e.place), text: "Education shows your score (CGPA / %)" },
    { ok: r.projects.filter(filledEntry).length >= 2, text: "At least 2 projects" },
    { ok: bullets.length >= 4, text: "At least 4 bullet points across projects and experience" },
    { ok: bullets.length > 0 && bullets.filter((b) => /\d/.test(b)).length >= Math.ceil(bullets.length / 2), text: "Half your bullets have a number (%, users, time saved)" },
    { ok: bullets.length > 0 && !bullets.some((b) => WEAK_START.test(b)), text: "Bullets start with an action verb (Built, Led, Reduced…), not “I” or “Responsible for”" },
    { ok: lines(r.skills).length >= 2, text: "Skills grouped in at least 2 lines (Languages, Tools…)" },
    { ok: lines(r.achievements).length >= 1 || r.certifications.some(filledEntry), text: "An achievement or certification" },
  ];
  return { score: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100), checks };
}

export const fileBase = (r: Resume) => `${(r.name.trim() || "My").replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_|_$/g, "")}_Resume`;

// ---------- Word export ----------

/** Builds a single-column .docx of the resume (Word, Google Docs and ATS friendly) and returns it as a Blob. */
export async function resumeToDocx(r: Resume): Promise<Blob> {
  const { AlignmentType, BorderStyle, Document, ExternalHyperlink, Packer, Paragraph, TabStopType, TextRun } = await import("docx");
  const accent = (r.template === "classic" ? "#111827" : r.accent).replace("#", "");
  const font = r.font === "serif" ? "Georgia" : "Calibri";
  const RIGHT = 10306; // A4 width minus 2 × 800 twips of margin
  const runs = (text: string, opts: { size?: number; color?: string; italics?: boolean } = {}) =>
    boldRuns(text).map((p) => new TextRun({ text: p.text, bold: p.bold, size: opts.size ?? 21, color: opts.color, italics: opts.italics, font }));

  const children: InstanceType<typeof Paragraph>[] = [];
  const heading = (title: string) =>
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accent, space: 2 } },
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: accent, font })],
      }),
    );
  const bullet = (text: string) => children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 20 }, children: runs(text) }));

  children.push(new Paragraph({ alignment: r.template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT, children: [new TextRun({ text: r.name || "Your Name", bold: true, size: 40, color: accent, font })] }));
  if (r.headline) children.push(new Paragraph({ alignment: r.template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT, children: runs(r.headline, { size: 22, color: "374151" }) }));
  const contact = contactOf(r);
  if (contact.length) {
    const parts: (InstanceType<typeof TextRun> | InstanceType<typeof ExternalHyperlink>)[] = [];
    contact.forEach((c, i) => {
      if (i) parts.push(new TextRun({ text: "  |  ", size: 19, color: "6b7280", font }));
      const href = hrefOf(c);
      parts.push(href ? new ExternalHyperlink({ link: href, children: [new TextRun({ text: c, size: 19, color: "1f2937", font })] }) : new TextRun({ text: c, size: 19, color: "1f2937", font }));
    });
    children.push(new Paragraph({ alignment: r.template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { after: 120 }, children: parts }));
  }

  if (r.summary.trim()) {
    heading("Summary");
    children.push(new Paragraph({ children: runs(r.summary.trim()) }));
  }
  for (const key of r.order) {
    const s = sectionOf(r, key);
    const list = s?.entries.filter(filledEntry) ?? [];
    if (!s || !list.length) continue;
    heading(s.title);
    for (const e of list) {
      children.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }],
          spacing: { before: 60 },
          children: [new TextRun({ text: e.title, bold: true, size: 21, font }), ...(e.sub ? [new TextRun({ text: (e.title ? " · " : "") + e.sub, size: 21, color: "374151", font })] : []), ...(e.period ? [new TextRun({ text: `\t${e.period}`, size: 19, color: "4b5563", font })] : [])],
        }),
      );
      if (e.place) children.push(new Paragraph({ children: [new TextRun({ text: e.place, size: 19, color: "4b5563", italics: true, font })] }));
      lines(e.points).forEach(bullet);
    }
  }
  if (lines(r.skills).length) {
    heading("Skills");
    for (const l of lines(r.skills)) {
      const i = l.indexOf(":");
      children.push(new Paragraph({ spacing: { after: 20 }, children: i > 0 ? [new TextRun({ text: l.slice(0, i + 1) + " ", bold: true, size: 21, font }), ...runs(l.slice(i + 1).trim())] : runs(l) }));
    }
  }
  if (lines(r.achievements).length) {
    heading("Achievements");
    lines(r.achievements).forEach(bullet);
  }
  const personal = [
    r.languages.trim() && ["Languages", r.languages.trim()],
    r.interests.trim() && ["Interests", r.interests.trim()],
    r.showPersonal && r.dob.trim() && ["Date of birth", r.dob.trim()],
    r.showPersonal && r.nationality.trim() && ["Nationality", r.nationality.trim()],
  ].filter(Boolean) as [string, string][];
  if (personal.length) {
    heading(r.showPersonal ? "Personal Details" : "Additional");
    for (const [k, v] of personal) children.push(new Paragraph({ children: [new TextRun({ text: `${k}: `, bold: true, size: 21, font }), new TextRun({ text: v, size: 21, font })] }));
  }
  if (r.declaration) {
    heading("Declaration");
    children.push(new Paragraph({ children: runs("I hereby declare that the information given above is true to the best of my knowledge and belief.") }));
    children.push(new Paragraph({ spacing: { before: 200 }, tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }], children: [new TextRun({ text: `Place: ${r.declPlace || ""}`, size: 21, font }), new TextRun({ text: `\t${r.name || ""}`, bold: true, size: 21, font })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "Date:", size: 21, font })] }));
  }

  const doc = new Document({
    creator: "StudyClip resume builder",
    title: `${r.name || "Resume"}`,
    styles: { default: { document: { run: { font, size: 21 } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 800, bottom: 800, left: 800, right: 800 } } }, children }],
  });
  return Packer.toBlob(doc);
}
