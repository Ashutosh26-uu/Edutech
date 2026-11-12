import { ArrowLeft, Briefcase, ChevronRight, Clock, ExternalLink, FileText, Keyboard, Layers, ListChecks, MessageSquare, Sigma, Sparkles, Trophy, Zap, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { mockPlan, totalMinutes, totalQuestions } from "@/data/patterns";
import { TOPIC_BY_ID } from "@/data/topics";
import { MakeMyExamButton, TopicAccuracy, RememberExam } from "@/components/ExamClient";
import type { Exam } from "@/lib/types";
import { isWeeklyExam } from "@/lib/weekly";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const exam = EXAM_BY_ID.get((await params).id);
  return exam ? { title: `${exam.name} preparation`, description: `${exam.fullName}: syllabus, practice questions and mock tests.` } : {};
}

interface Tool {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** The study tools that fit this kind of exam. */
function examTools(e: Exam): Tool[] {
  const formulas: Tool = { href: "/formulas", label: "Formula sheets", icon: Sigma };
  if (e.category === "Engineering & Medical" || /^(jee|neet)/.test(e.id))
    return [formulas, { href: "/tracker", label: "Syllabus tracker", icon: ListChecks }, { href: "/review", label: "Flashcards", icon: Layers }];
  if (["SSC", "Banking", "Insurance", "Railways"].includes(e.category))
    return [
      { href: "/drills", label: "Speed drills", icon: Zap },
      ...(e.id === "ssc-chsl" || e.id === "ssc-cgl" ? [{ href: "/typing", label: "Typing test", icon: Keyboard }] : []),
      ...(isWeeklyExam(e.id) ? [{ href: "/mock-sunday", label: "Sunday mock", icon: Trophy }] : []),
      formulas,
    ];
  if (e.category === "Campus Placement")
    return [
      { href: "/placement", label: "Placement hub", icon: Briefcase },
      { href: "/interview", label: "Interview", icon: MessageSquare },
      { href: "/resume", label: "Resume", icon: FileText },
    ];
  return [];
}

function negativeMarkingText(e: Exam) {
  if (e.negativeMarking === null) return "As per the official notification";
  if (e.negativeMarking === 0) return "None";
  const frac = Math.abs(e.negativeMarking - 1 / 3) < 1e-9 ? "⅓" : e.negativeMarking === 0.25 ? "¼" : e.negativeMarking === 0.2 ? "⅕" : String(+e.negativeMarking.toFixed(2));
  return `${frac} of the marks for each wrong answer`;
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = EXAM_BY_ID.get(id);
  if (!exam) notFound();
  const hasPractice = examTopicIds(exam).length > 0;
  const plan = mockPlan(exam);
  const tools = examTools(exam);

  return (
    <div className="space-y-8">
      <RememberExam examId={exam.id} />
      <div className="space-y-5">
        <Link href="/exams" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> All exams
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              {exam.category} · {exam.level}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{exam.name}</h1>
            <p className="mt-1 text-slate-600">{exam.fullName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MakeMyExamButton examId={exam.id} />
            {hasPractice && (
            <>
              <Link href={`/last-minute?exam=${exam.id}`} className="btn-ghost">
                <Clock className="h-4 w-4" /> Exam tomorrow?
              </Link>
              <Link href={`/leaderboard?exam=${exam.id}`} className="btn-ghost">
                <Trophy className="h-4 w-4" /> Leaderboard
              </Link>
              <Link href={`/practice?exam=${exam.id}&smart=1`} className="btn-ghost">
                <Sparkles className="h-4 w-4" /> Smart practice
              </Link>
              <Link href={`/practice?exam=${exam.id}&mock=1`} className="btn-primary">
                {plan ? `Full mock (${plan.pattern.paper} pattern)` : "Take a mock test"}
              </Link>
            </>
            )}
          </div>
        </div>
        <dl className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-sm sm:grid-cols-3">
          <div className="bg-surface p-4">
            <dt className="text-xs text-slate-500">Conducted by</dt>
            <dd className="mt-1 font-medium text-slate-900">{exam.conductedBy}</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-xs text-slate-500">Negative marking</dt>
            <dd className="mt-1 font-medium text-slate-900">{negativeMarkingText(exam)}</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-xs text-slate-500">Official information</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {exam.website ? (
                <a href={exam.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                  {new URL(exam.website).hostname.replace(/^www\./, "")} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                "See the conducting body’s website"
              )}
            </dd>
          </div>
        </dl>
        {plan && (
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">
                {plan.pattern.paper} mock: {totalQuestions(plan.sections)} questions · {totalMinutes(plan.sections)} minutes{plan.pattern.sectional ? " · sectional timing" : ""}
              </h2>
              <span className="text-xs text-slate-500">
                +{plan.pattern.marks} per correct · {(plan.pattern.negative ?? exam.negativeMarking ?? 0) > 0 ? <>−{+((plan.pattern.negative ?? exam.negativeMarking ?? 0) * plan.pattern.marks).toFixed(2)} per wrong</> : "no negative marking"}
              </span>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {plan.sections.map((s) => (
                <li key={s.subject} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <span>
                    <span className="font-medium text-slate-800">{s.subject}</span>
                    <span className="block text-xs text-slate-500">
                      {s.questions} questions · {s.minutes} min · uses your free test or 1 credit
                    </span>
                  </span>
                  <Link href={`/practice?exam=${exam.id}&mock=1&section=${encodeURIComponent(s.subject)}`} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
                    Section test
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">Every timed test (full mock, section test or topic test) uses your free test for this exam or 1 credit. Untimed practice is always free.</p>
            {plan.pattern.sectional && <p className="mt-2 text-xs text-slate-500">In the full mock each section has its own timer and closes when it ends, as in the real paper.</p>}
          </div>
        )}
        {isWeeklyExam(exam.id) && (
          <Link href="/mock-sunday" className="card-link flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
              <Trophy className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-slate-900">Sunday All-India Mock: free, live 10am–10pm</span>
              <span className="block text-sm text-slate-600">One {exam.name} paper for every student each Sunday. See your all-India rank and the top 10.</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
          </Link>
        )}
        {tools.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Tools for this exam</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {tools.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="btn-ghost px-3 py-1.5 text-sm">
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {exam.category === "Campus Placement" && (
          <Link href="/placement" className="card-link flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-slate-900">Placement preparation hub</span>
              <span className="block text-sm text-slate-600">All company tests, aptitude and coding topics, formula sheets, interview prep and the resume builder.</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
          </Link>
        )}
        <p className="text-xs text-slate-500">Exam patterns change. Always confirm dates, eligibility and the current pattern in the latest official notification.</p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {exam.subjects.map((s) => (
          <section key={s.name} className="card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-semibold">{s.name}</h2>
              {s.topicIds.length > 0 && (
                <Link href={`/practice?exam=${exam.id}&topics=${s.topicIds.join(",")}`} className="text-sm font-medium text-brand-700 hover:underline">
                  Practise subject
                </Link>
              )}
            </div>
            {s.topicIds.length ? (
              <ul className="divide-y divide-slate-100">
                {s.topicIds.map((tid) => {
                  const t = TOPIC_BY_ID.get(tid)!;
                  return (
                    <li key={tid} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <Link href={`/topics/${tid}`} className="font-medium text-slate-800 hover:text-brand-700">
                          {t.name}
                        </Link>
                        <TopicAccuracy topicId={tid} />
                      </div>
                      <span className="flex shrink-0 gap-1.5">
                        <Link href={`/topics/${tid}`} className="btn-ghost px-3 py-1.5 text-xs">
                          Notes
                        </Link>
                        <Link href={`/practice?exam=${exam.id}&topics=${tid}`} className="btn-ghost px-3 py-1.5 text-xs">
                          Practise
                        </Link>
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">There’s no question set for this subject on StudyClip. Use the official syllabus, and paste a YouTube lecture on it into <Link href="/video" className="font-medium text-brand-700 hover:underline">Videos</Link> to get chapters, notes and a quiz.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
