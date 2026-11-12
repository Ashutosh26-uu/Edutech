import { Briefcase, ChevronRight, Code2, FileText, MessageSquare, Sigma, Sparkles, Timer, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EXAMS, examTopicIds } from "@/data/exams";
import { absoluteUrl } from "@/data/site";
import { TOPIC_BY_ID } from "@/data/topics";
import { formulaTopics } from "@/lib/formulas";
import type { Topic } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Campus placement preparation – aptitude, coding, interview",
  description: "Everything for campus placement in one place: TCS NQT, Infosys, Wipro, Accenture, Cognizant and product-company tests, aptitude and reasoning practice, CS fundamentals, formula sheets, interview questions and a resume builder.",
  alternates: { canonical: absoluteUrl("/placement") },
};

const PLACEMENT = EXAMS.filter((e) => e.category === "Campus Placement");
const CS_SUBJECTS = new Set(["CS Fundamentals", "Data Structures & Algorithms", "Programming"]);

/** Every topic the placement tests cover, split into aptitude/reasoning/verbal and CS/coding. */
function placementTopics(): { aptitude: Topic[]; cs: Topic[] } {
  const ids = new Set(PLACEMENT.flatMap((e) => examTopicIds(e)));
  // Coding problems are a separate topic that may not exist in every build.
  if (TOPIC_BY_ID.has("cs-coding-problems")) ids.add("cs-coding-problems");
  const topics = [...ids].flatMap((id) => {
    const t = TOPIC_BY_ID.get(id);
    return t ? [t] : [];
  });
  return { aptitude: topics.filter((t) => !CS_SUBJECTS.has(t.subject)), cs: topics.filter((t) => CS_SUBJECTS.has(t.subject)) };
}

const TOOLS = [
  { href: "/interview", icon: MessageSquare, title: "Interview prep", text: "HR, behavioural and technical questions with model answers." },
  { href: "/resume", icon: FileText, title: "Resume builder", text: "A clean one-page fresher CV you can print as a PDF." },
  { href: "/drills", icon: Zap, title: "Speed drills", text: "60-second calculation drills to get faster at aptitude." },
];

export default async function PlacementPage() {
  const { aptitude, cs } = placementTopics();
  const aptIds = new Set(aptitude.map((t) => t.id));
  const formulas = (await formulaTopics()).filter((t) => aptIds.has(t.id));

  return (
    <div className="space-y-10">
      <PageHeader
        path="/placement"
        title="Placement preparation hub"
        intro="Pick the company you are applying to and practise its test, then brush up aptitude, coding and interview answers. Untimed practice is free and unlimited."
        secondary={{ href: "/resume", label: "Make your resume" }}
      />

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <Briefcase className="h-4 w-4 text-slate-500" /> Company tests
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEMENT.map((e) => (
            <li key={e.id} className="card flex flex-col gap-3">
              <div className="min-w-0">
                <Link href={`/exams/${e.id}`} className="font-semibold text-slate-900 hover:text-brand-700">
                  {e.name}
                </Link>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{e.fullName}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link href={`/practice?exam=${e.id}&smart=1`} className="btn-ghost px-3 py-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Smart practice
                </Link>
                <Link href={`/practice?exam=${e.id}&mock=1`} className="btn-primary px-3 py-1.5 text-xs">
                  <Timer className="h-3.5 w-3.5" /> Mock
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">Each mock uses your free test for that company or 1 credit. Smart practice is always free.</p>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <TopicList title="Aptitude & reasoning topics" icon={<Sigma className="h-4 w-4 text-slate-500" />} topics={aptitude} />
        <TopicList title="CS fundamentals & coding topics" icon={<Code2 className="h-4 w-4 text-slate-500" />} topics={cs} />
      </div>

      {formulas.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">Formula sheets for aptitude</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {formulas.map((t) => (
              <li key={t.id}>
                <Link href={`/formulas/${t.id}`} className="card-link flex items-center gap-3 p-3">
                  <Sigma className="h-4 w-4 shrink-0 text-brand-600" />
                  <span className="min-w-0 text-sm font-medium text-slate-900">{t.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-900">Interview, resume and speed</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {TOOLS.map(({ href, icon: Icon, title, text }) => (
            <li key={href}>
              <Link href={href} className="card-link flex h-full items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">{title}</span>
                  <span className="block text-sm text-slate-600">{text}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function TopicList({ title, icon, topics }: { title: string; icon: React.ReactNode; topics: Topic[] }) {
  return (
    <section className="card">
      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
        {icon} {title} <span className="text-sm font-normal text-slate-500">({topics.length})</span>
      </h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {topics.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <Link href={`/topics/${t.id}`} className="min-w-0 font-medium text-slate-800 hover:text-brand-700">
              {t.name}
            </Link>
            <Link href={`/practice?topics=${t.id}`} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
              Practise
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
