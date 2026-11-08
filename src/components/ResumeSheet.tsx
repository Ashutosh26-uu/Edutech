import type { ReactNode } from "react";
import { boldRuns, contactOf, filledEntry, hrefOf, lines, sectionOf, type Entry, type Resume } from "@/lib/resume";

/** A4 at 96 dpi. The preview renders at this size and is scaled; printing uses it 1:1. */
export const PAGE_W = 794;
export const PAGE_H = 1123;

const INK = "#111827";
const DENSITY = {
  compact: { base: 11.2, padX: 36, padY: 30, gap: "0.75em" },
  normal: { base: 12, padX: 46, padY: 40, gap: "1em" },
  relaxed: { base: 12.6, padX: 52, padY: 46, gap: "1.2em" },
} as const;

/** Text with **bold** runs. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {boldRuns(text).map((p, i) =>
        p.bold ? (
          <b key={i} style={{ color: INK }}>
            {p.text}
          </b>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/** A contact value as a link when it is an email, phone or web address (links stay clickable in the PDF). */
function Contact({ value }: { value: string }) {
  const href = hrefOf(value);
  return href ? (
    <a href={href} style={{ color: "inherit", textDecoration: "none" }}>
      {value}
    </a>
  ) : (
    <>{value}</>
  );
}

function Joined({ items, sep }: { items: string[]; sep: string }) {
  return (
    <>
      {items.map((c, i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: "#9ca3af" }}>{sep}</span>}
          <Contact value={c} />
        </span>
      ))}
    </>
  );
}

export function ResumeSheet({ r, id = "resume-sheet" }: { r: Resume; id?: string }) {
  const d = DENSITY[r.density];
  const accent = r.template === "classic" ? INK : r.accent;
  const font = r.font === "serif" ? "Georgia, 'Times New Roman', serif" : "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const contact = contactOf(r);
  const photo = r.showPhoto && r.photo ? r.photo : "";
  const skills = lines(r.skills).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { label: l.slice(0, i).trim(), items: l.slice(i + 1).trim() } : { label: "", items: l };
  });
  const personal = [
    r.showPersonal && r.dob.trim() && ["Date of birth", r.dob.trim()],
    r.showPersonal && r.nationality.trim() && ["Nationality", r.nationality.trim()],
  ].filter(Boolean) as [string, string][];

  const Heading = ({ children, side = false }: { children: string; side?: boolean }) =>
    side || r.template === "sidebar" ? (
      <h2 style={{ color: accent }} className="pt-[0.1em] text-[0.96em] font-bold tracking-[0.08em] uppercase">
        {children}
      </h2>
    ) : r.template === "classic" ? (
      <h2 style={{ color: INK, borderColor: "#1f2937" }} className="mb-[0.45em] border-b pb-[0.1em] text-center text-[1.08em] font-bold tracking-[0.12em] uppercase">
        {children}
      </h2>
    ) : (
      <h2 style={{ color: accent, borderColor: accent }} className="mb-[0.45em] border-b-2 pb-[0.1em] text-[1.08em] font-bold tracking-[0.06em] uppercase">
        {children}
      </h2>
    );

  const Section = ({ title, children }: { title: string; children: ReactNode }) =>
    r.template === "sidebar" ? (
      <section className="grid grid-cols-[118px_1fr] gap-4 border-t border-gray-200 pt-[0.7em]">
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
    <div className="mb-[0.6em] last:mb-0" style={{ breakInside: "avoid" }}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0 text-[1.04em] leading-snug">
          <b style={{ color: INK }}>{e.title}</b>
          {e.sub && (
            <span className="text-gray-700">
              {e.title ? " · " : ""}
              {e.sub}
            </span>
          )}
        </div>
        {e.period && <div className="shrink-0 text-[0.96em] text-gray-600">{e.period}</div>}
      </div>
      {e.place && (
        <div className="text-[0.96em] text-gray-600">
          <Contact value={e.place} />
        </div>
      )}
      {lines(e.points).length > 0 && (
        <ul className="mt-[0.15em] list-disc space-y-[0.12em] pl-[1.2em] text-[0.98em] leading-snug text-gray-800 marker:text-gray-500">
          {lines(e.points).map((p, i) => (
            <li key={i}>
              <Rich text={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const Bullets = ({ items }: { items: string[] }) => (
    <ul className="list-disc space-y-[0.12em] pl-[1.2em] text-[0.98em] leading-snug text-gray-800 marker:text-gray-500">
      {items.map((a, i) => (
        <li key={i}>
          <Rich text={a} />
        </li>
      ))}
    </ul>
  );
  const SkillLines = () => (
    <div className="space-y-[0.15em] text-[0.98em] leading-snug text-gray-800">
      {skills.map((s, i) => (
        <div key={i}>
          {s.label && <b style={{ color: INK }}>{s.label}: </b>}
          {s.items}
        </div>
      ))}
    </div>
  );
  const KeyValues = ({ rows }: { rows: [string, string][] }) => (
    <div className="space-y-[0.15em] text-[0.98em] text-gray-800">
      {rows.map(([k, v]) => (
        <div key={k}>
          <b style={{ color: INK }}>{k}: </b>
          {v}
        </div>
      ))}
    </div>
  );
  const Declaration = () => (
    <div className="text-[0.98em] text-gray-800" style={{ breakInside: "avoid" }}>
      <p>I hereby declare that the information given above is true to the best of my knowledge and belief.</p>
      <div className="mt-[1.6em] flex justify-between">
        <div>
          <div>Place: {r.declPlace}</div>
          <div>Date:</div>
        </div>
        <div className="self-end font-semibold" style={{ color: INK }}>
          ({r.name || "Your Name"})
        </div>
      </div>
    </div>
  );

  // Main-column sections, in the user's order.
  const ordered = r.order.map((key) => {
    const s = sectionOf(r, key);
    const list = s?.entries.filter(filledEntry) ?? [];
    return s && list.length ? (
      <Section key={key} title={s.title}>
        {list.map((e, i) => (
          <EntryView key={i} e={e} />
        ))}
      </Section>
    ) : null;
  });
  const summary = r.summary.trim() && (
    <Section title={r.template === "twocol" ? "Profile" : "Summary"}>
      <p className="text-[0.98em] leading-snug text-gray-800">
        <Rich text={r.summary.trim()} />
      </p>
    </Section>
  );
  const achievements = lines(r.achievements).length > 0 && (
    <Section title="Achievements">
      <Bullets items={lines(r.achievements)} />
    </Section>
  );
  const declaration = r.declaration && (
    <Section title="Declaration">
      <Declaration />
    </Section>
  );

  const article = (inner: ReactNode, pad = true) => (
    <article id={id} style={{ width: PAGE_W, minHeight: PAGE_H, fontFamily: font, fontSize: d.base, padding: pad ? `${d.padY}px ${d.padX}px` : 0, color: "#1f2937" }} className="bg-white">
      {inner}
    </article>
  );

  // ---------- Two columns: tinted sidebar with photo, contact and skills ----------
  if (r.template === "twocol") {
    const sideBlock = (title: string, body: ReactNode) => (
      <div>
        <Heading side>{title}</Heading>
        <div className="mt-[0.35em]">{body}</div>
      </div>
    );
    return article(
      <div className="grid min-h-[1123px] grid-cols-[34%_1fr]">
        <aside style={{ background: `${accent}12`, padding: `${d.padY}px 22px` }} className="space-y-[1.1em]">
          {photo && <img src={photo} alt="" className="mx-auto h-[118px] w-[118px] rounded-full object-cover" style={{ boxShadow: `0 0 0 3px ${accent}` }} />}
          {contact.length > 0 &&
            sideBlock(
              "Contact",
              <div className="space-y-[0.25em] text-[0.94em] break-words text-gray-800">
                {contact.map((c, i) => (
                  <div key={i}>
                    <Contact value={c} />
                  </div>
                ))}
              </div>,
            )}
          {skills.length > 0 &&
            sideBlock(
              "Skills",
              <div className="space-y-[0.45em] text-[0.94em] text-gray-800">
                {skills.map((s, i) => (
                  <div key={i}>
                    {s.label && <div className="font-semibold" style={{ color: INK }}>{s.label}</div>}
                    <div>{s.items}</div>
                  </div>
                ))}
              </div>,
            )}
          {r.languages.trim() && sideBlock("Languages", <p className="text-[0.94em] text-gray-800">{r.languages.trim()}</p>)}
          {r.interests.trim() && sideBlock("Interests", <p className="text-[0.94em] text-gray-800">{r.interests.trim()}</p>)}
          {personal.length > 0 && sideBlock("Personal", <KeyValues rows={personal} />)}
        </aside>
        <div style={{ padding: `${d.padY}px ${d.padX - 10}px ${d.padY}px 26px` }}>
          <header className="mb-[1em]">
            <h1 style={{ color: accent }} className="text-[2.45em] leading-tight font-bold tracking-tight">
              {r.name || "Your Name"}
            </h1>
            {r.headline && <p className="mt-[0.1em] text-[1.08em] font-medium text-gray-700">{r.headline}</p>}
          </header>
          <div className="flex flex-col" style={{ gap: d.gap }}>
            {summary}
            {ordered}
            {achievements}
            {declaration}
          </div>
        </div>
      </div>,
      false,
    );
  }

  // ---------- Single-column templates ----------
  const header =
    r.template === "classic" ? (
      <header className="mb-[0.9em] text-center">
        {photo && <img src={photo} alt="" className="mx-auto mb-[0.5em] h-[88px] w-[88px] rounded-full object-cover" />}
        <h1 style={{ color: INK }} className="text-[2.2em] leading-tight font-bold tracking-wide">
          {r.name || "Your Name"}
        </h1>
        {r.headline && <p className="mt-[0.1em] text-[1.04em] text-gray-700">{r.headline}</p>}
        <p className="mt-[0.3em] text-[0.96em] text-gray-700">{contact.length ? <Joined items={contact} sep="  •  " /> : "email  •  phone  •  city  •  LinkedIn"}</p>
      </header>
    ) : r.template === "modern" ? (
      <header className="mb-[0.9em] flex items-center justify-between gap-5">
        <div className="min-w-0">
          <h1 style={{ color: accent }} className="text-[2.5em] leading-tight font-bold tracking-tight">
            {r.name || "Your Name"}
          </h1>
          {r.headline && <p className="mt-[0.1em] text-[1.08em] font-medium text-gray-700">{r.headline}</p>}
          <p className="mt-[0.4em] text-[0.96em] text-gray-600">{contact.length ? <Joined items={contact} sep="   |   " /> : "email   |   phone   |   city   |   LinkedIn"}</p>
        </div>
        {photo && <img src={photo} alt="" className="h-[96px] w-[96px] shrink-0 rounded-lg object-cover" />}
      </header>
    ) : (
      <header className="mb-[0.9em] flex items-end justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          {photo && <img src={photo} alt="" className="h-[80px] w-[80px] shrink-0 rounded-full object-cover" />}
          <div className="min-w-0">
            <h1 style={{ color: accent }} className="text-[2.3em] leading-tight font-bold">
              {r.name || "Your Name"}
            </h1>
            {r.headline && <p className="mt-[0.1em] text-[1.04em] text-gray-700">{r.headline}</p>}
          </div>
        </div>
        <div className="shrink-0 text-right text-[0.92em] leading-snug text-gray-700">
          {(contact.length ? contact : ["email", "phone", "city"]).map((c, i) => (
            <div key={i}>
              <Contact value={c} />
            </div>
          ))}
        </div>
      </header>
    );

  const extras: [string, string][] = [...(r.languages.trim() ? [["Languages", r.languages.trim()] as [string, string]] : []), ...(r.interests.trim() ? [["Interests", r.interests.trim()] as [string, string]] : []), ...personal];
  return article(
    <>
      {header}
      <div className="flex flex-col" style={{ gap: d.gap }}>
        {summary}
        {ordered}
        {skills.length > 0 && (
          <Section title="Skills">
            <SkillLines />
          </Section>
        )}
        {achievements}
        {extras.length > 0 && (
          <Section title={personal.length ? "Personal Details" : "Additional"}>
            <KeyValues rows={extras} />
          </Section>
        )}
        {declaration}
      </div>
    </>,
  );
}
