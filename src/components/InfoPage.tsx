import Link from "next/link";
import { CONTACT_EMAIL } from "@/data/site";

/** Shared layout for the About, Contact and policy pages: a readable column with styled prose. */
export function InfoPage({ eyebrow, title, intro, updated, children }: { eyebrow: string; title: string; intro?: string; updated?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b border-slate-200 pb-6">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        {intro && <p className="mt-3 text-slate-600">{intro}</p>}
        {updated && <p className="mt-3 text-xs text-slate-500">Last updated: {updated}</p>}
      </header>
      <div className="text-[15px] [&_a]:font-medium [&_a]:text-brand-700 [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:leading-relaxed [&_li]:text-slate-600 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-600 [&_strong]:text-slate-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}

/**
 * How to reach us, for use inside a sentence: the contact form (with a topic preselected),
 * plus the support email once NEXT_PUBLIC_CONTACT_EMAIL is set.
 */
export function ContactEmail({ topic }: { topic?: string }) {
  const form = <Link href={`/contact${topic ? `?topic=${topic}` : ""}#form`}>our contact form</Link>;
  return CONTACT_EMAIL ? (
    <>
      {form} or <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    </>
  ) : (
    form
  );
}
