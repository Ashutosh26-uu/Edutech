import { Building2, GraduationCap, KeyRound, PenLine, Presentation } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { COMMUNITY_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "How to use StudyClip",
  description: "Step-by-step guides for students, teachers and placement trainers, universities and TPOs, content editors and admins.",
  alternates: { canonical: "/guide" },
};

type Step = { title: string; text: React.ReactNode };
interface Role {
  id: string;
  icon: typeof GraduationCap;
  title: string;
  who: string;
  steps: Step[];
  tips?: string[];
}

const L = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-medium text-brand-700 underline-offset-2 hover:underline">
    {children}
  </Link>
);

const ROLES: Role[] = [
  {
    id: "students",
    icon: GraduationCap,
    title: "Students",
    who: "Preparing for SSC, banking, railways, UPSC, state exams, JEE/NEET, campus placements or MBA/commerce jobs.",
    steps: [
      { title: "Pick your exam", text: <>On the <L href="/">home page</L>, search or tap your exam. Nothing is chosen for you; you can switch any time with <b>Switch exam</b>.</> },
      { title: "Do your first 10 questions", text: <>Tap <b>Start my first 10 questions</b>. You see the answer and a short explanation after each one. This also shows us your strong and weak topics.</> },
      { title: "Follow “Next up” every day", text: <>Your home page shows one clear next step: today’s 10 questions, then flashcards, then a weekly mock. Finish the daily goal to grow your streak.</> },
      { title: "Take the daily current affairs quiz", text: <>A short quiz on recent news every day at <L href="/current-affairs">Current affairs</L>. It counts toward your daily goal.</> },
      { title: "Watch your exam dates", text: <>The <L href="/calendar">Exam calendar</L> lists application windows, admit cards, exam days and results with official links. Add any date to Google Calendar in one tap.</> },
      { title: "Test yourself under exam conditions", text: <>Open your exam page for full mocks on the real pattern, section tests, and the free <L href="/mock-sunday">Sunday All-India Mock</L> with a rank.</> },
      { title: "Fix your mistakes", text: <>Wrong answers go to the <L href="/mistakes">Mistake notebook</L>; star questions to <L href="/saved">Saved</L>; turn them into <L href="/review">Flashcards</L> that come back just before you forget.</> },
      { title: "Make your own notes", text: <>Use <L href="/notes">My notes</L> (or the My notes button on any topic) and download them as a PDF.</> },
      { title: "Practise your college’s own questions", text: <>Find your institute on <L href="/institutes">Institutes</L>. Public sets are open to all; enter the code from your college to unlock its members-only sets.</> },
      { title: "Joining your college or coaching batch?", text: <>Open the link your trainer shared, or enter the 6-letter code on <L href="/batches">Batches</L>. Assigned tests appear there; each can be taken once.</> },
    ],
    tips: ["Create a free account to keep progress on every device.", "Turn on the daily reminder on the Today page.", "On a phone, use your browser’s “Add to Home screen” to install StudyClip like an app."],
  },
  {
    id: "trainers",
    icon: Presentation,
    title: "Teachers and placement trainers",
    who: "You teach a class or a placement batch and want to assign tests and see every student’s result.",
    steps: [
      { title: "Create a free account", text: <>Then open <L href="/batches">Batches</L> and tap <b>New batch</b>. Give it a name (for example “CSE Placement 2027”) and your college.</> },
      { title: "Share the join code", text: <>Each batch has a 6-letter code and a join link. Share the link on WhatsApp or show the code in class. Students join after logging in.</> },
      { title: "Assign a test", text: <>Tap <b>Assign a test</b>. Build it from any exam track (TCS NQT, Infosys, Big 4, MBA placement, SSC CGL…), optionally only some topics. Set the number of questions, minutes and a due time. Everyone gets the same questions.</> },
      { title: "Read the results", text: <>Open <b>Results</b> for a ranked table (score, accuracy, correct/wrong/skipped, time), who hasn’t started, and the batch’s weakest topics. Use <b>Download CSV</b> for Excel.</> },
      { title: "Plan the next class", text: <>Teach the topics at the top of the “weakest first” list, then assign a short test on just those topics.</> },
      { title: "Work as a team", text: <>Under <b>Trainers</b>, add colleagues by email. They can assign tests, see results and manage students; only you can delete the batch.</> },
    ],
    tips: ["Students see only their own scores; you see the whole batch.", "Remove a student from the batch at any time; their own history stays in their account."],
  },
  {
    id: "universities",
    icon: Building2,
    title: "Universities, TPOs and coaching institutes",
    who: "You run placement or exam preparation for many classes and want one organised setup.",
    steps: [
      { title: "Create your institute page", text: <>On <L href="/institutes">Institutes</L>, tap <b>Create institute page</b>. It goes live at once with your name and city, and gets a <b>Verified</b> badge after StudyClip checks it.</> },
      { title: "Publish your own question sets", text: <>In <b>Manage</b>, add sets with your questions (type them or paste many from Word/WhatsApp). Make a set <b>Public</b> so anyone can practise it, or <b>Members only</b> for your students, who join with your institute’s code.</> },
      { title: "Add your staff", text: <>Add faculty emails under <b>Staff</b> so they can add and edit sets too.</> },
      { title: "One batch per class or branch", text: <>A coordinator (often the TPO) creates a batch for each class, for example “CSE-A 2027”, “ECE 2027”, “MBA Finance”.</> },
      { title: "Add your faculty as trainers", text: <>In each batch, add faculty emails under <b>Trainers</b>. Every trainer sees the same students and results.</> },
      { title: "Run a weekly rhythm", text: <>For example: a company-pattern test every Monday, a topic test on the weakest topics mid-week, and the Sunday All-India Mock for a national rank.</> },
      { title: "Report to management", text: <>Download each test’s CSV and combine them for attendance, averages and improvement over time.</> },
      { title: "Publish for your students (optional)", text: <>Want your staff to post the daily current affairs quiz or exam dates? Ask the site admin to give your staff email <b>publishing access</b> (see Content editors below).</> },
    ],
    tips: ["Tell students their trainers will see their name, email and scores on batch tests.", "Need many batches or help onboarding? Write to us from the Contact page."],
  },
  {
    id: "editors",
    icon: PenLine,
    title: "Content editors",
    who: "You were given publishing access to post the daily current affairs quiz and the exam calendar.",
    steps: [
      { title: "Log in with the email that has access", text: <>Then open <L href="/admin/content">Publishing</L>. If it says you don’t have access, ask the site admin to add that exact email.</> },
      { title: "Publish the daily quiz", text: <>Under <b>Daily quiz</b>, tap <b>New quiz</b>, pick the date and add 5 to 10 questions with four options, the correct answer and a one-line explanation. A quiz dated in the future goes live on that day.</> },
      { title: "Paste many questions at once", text: <>Use <b>Paste many questions as text</b>: question, options <code>A)</code> to <code>D)</code>, a line <code>Answer: B</code>, an optional <code>Explanation:</code>, and a blank line between questions.</> },
      { title: "Add exam dates", text: <>Under <b>Exam calendar</b>, add application windows, admit cards, exam days and results. Always include the official link, and edit the entry if a date changes.</> },
    ],
    tips: ["Check every fact and date against an official source before publishing.", "Write questions in your own words; don’t copy from books or coaching material."],
  },
  {
    id: "admins",
    icon: KeyRound,
    title: "Site admins",
    who: "You own StudyClip and decide who may publish.",
    steps: [
      { title: "Become an admin", text: <>Admins are the emails in the <code>ADMIN_EMAILS</code> setting on the server (comma-separated).</> },
      { title: "Give or remove publishing access", text: <>In <L href="/admin/content">Publishing → Access</L>, add an email (and an organisation, such as a university). Editors can publish but cannot give access to others. Remove access in one tap.</> },
      { title: "Keep an eye on quality", text: <>Use <L href="/admin/reports">Reports</L> for questions students flag, <L href="/admin/messages">Messages</L> for the contact inbox and <L href="/admin/stats">Stats</L> for usage.</> },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <PageHeader path="/guide" title="How to use StudyClip" intro="Pick who you are. Each guide takes a few minutes and links straight to the right page." />
      <nav aria-label="Guides" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {ROLES.map((r) => (
          <a key={r.id} href={`#${r.id}`} className="card-link flex flex-col gap-2 p-3 sm:p-4">
            <r.icon className="h-5 w-5 text-brand-700" />
            <span className="text-sm font-semibold text-slate-900">{r.title}</span>
          </a>
        ))}
      </nav>
      {ROLES.map((r) => (
        <section key={r.id} id={r.id} className="card scroll-mt-20 space-y-4" aria-labelledby={`${r.id}-h`}>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <r.icon className="h-5 w-5" />
            </span>
            <div>
              <h2 id={`${r.id}-h`} className="text-xl font-semibold">
                {r.title}
              </h2>
              <p className="text-sm text-slate-600">{r.who}</p>
            </div>
          </div>
          <ol className="space-y-3">
            {r.steps.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{i + 1}</span>
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-slate-900">{s.title}</p>
                  <p className="mt-0.5 leading-relaxed text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {r.tips && (
            <ul className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {r.tips.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <p className="text-sm text-slate-600">
        Still stuck? Ask the help button at the bottom right, ask other users on our{" "}
        <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline-offset-2 hover:underline">
          community forum
        </a>
        , or write to us on the <L href="/contact">Contact</L> page.
      </p>
    </div>
  );
}
