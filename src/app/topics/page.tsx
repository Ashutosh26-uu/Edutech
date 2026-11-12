import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { BANK_SIZES } from "@/data/bank";
import { absoluteUrl } from "@/data/site";
import { TOPICS } from "@/data/topics";
import type { Topic } from "@/lib/types";

export const metadata: Metadata = {
  title: "Topics & notes – short notes and practice questions with solutions",
  description: "Short notes, key points and solved practice questions for every topic in SSC, banking, railway, UPSC, teaching and entrance exams.",
  alternates: { canonical: absoluteUrl("/topics") },
};

/** Topics grouped by subject, in the order subjects first appear in the topic list. */
function bySubject(): [string, Topic[]][] {
  const groups = new Map<string, Topic[]>();
  for (const t of TOPICS) groups.set(t.subject, [...(groups.get(t.subject) ?? []), t]);
  return [...groups];
}

export default function TopicsPage() {
  const groups = bySubject();
  const total = TOPICS.reduce((n, t) => n + (BANK_SIZES[t.id] ?? 0), 0);
  return (
    <div className="space-y-8">
      <PageHeader
        path="/topics"
        title="Topics & notes"
        intro={`Pick a topic to read its short notes, then try solved questions on it. ${TOPICS.length} topics across ${groups.length} subjects, with ${total.toLocaleString("en-IN")} practice questions.`}
      >
        <nav aria-label="Subjects" className="mt-4 flex flex-wrap gap-2">
          {groups.map(([subject]) => (
            <a key={subject} href={`#${slug(subject)}`} className="chip bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-brand-50">
              {subject}
            </a>
          ))}
        </nav>
      </PageHeader>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {groups.map(([subject, topics]) => (
          <section key={subject} id={slug(subject)} className="card scroll-mt-20">
            <h2 className="mb-2 font-semibold">{subject}</h2>
            <ul className="divide-y divide-slate-100">
              {topics.map((t) => {
                const n = BANK_SIZES[t.id] ?? 0;
                return (
                  <li key={t.id}>
                    <Link href={`/topics/${t.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-brand-700">
                      <span className="min-w-0 font-medium text-slate-800">{t.name}</span>
                      {n > 0 && <span className="shrink-0 text-xs text-slate-500">{n} questions</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
