import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { BANK_SIZES } from "@/data/bank";
import { absoluteUrl } from "@/data/site";
import { TOPICS } from "@/data/topics";
import { subjectStyle } from "@/lib/subjectStyle";
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
          {groups.map(([subject]) => {
            const st = subjectStyle(subject);
            return (
              <a key={subject} href={`#${slug(subject)}`} className="pill gap-1.5 py-1 pl-1.5">
                <span className={`grid h-5 w-5 place-items-center rounded-full ${st.tile}`}>
                  <st.icon className="h-3 w-3" aria-hidden />
                </span>
                {subject}
              </a>
            );
          })}
        </nav>
      </PageHeader>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {groups.map(([subject, topics]) => (
          <section key={subject} id={slug(subject)} className="card scroll-mt-20">
            <SubjectHeading name={subject} count={topics.length} />
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

function SubjectHeading({ name, count }: { name: string; count: number }) {
  const st = subjectStyle(name);
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${st.tile}`}>
        <st.icon className="h-4 w-4" aria-hidden />
      </span>
      <h2 className="min-w-0 flex-1 font-semibold">{name}</h2>
      <span className="text-xs text-slate-500">{count} topics</span>
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
