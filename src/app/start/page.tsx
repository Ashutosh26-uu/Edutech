import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AskHelpButton, StepButton, type StepKind } from "@/components/StartGuideActions";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Start here – how to use StudyClip, step by step",
  description: "New to StudyClip? Six simple steps: choose your exam, do a 10-question practice set, read your result, revise with flashcards, take your free mock test and follow a daily plan.",
  alternates: { canonical: absoluteUrl("/start") },
};

interface Step {
  title: string;
  text: string[];
  /** The same idea in simple Hinglish. */
  hi: string;
  kind: StepKind;
}

const STEPS: Step[] = [
  {
    title: "Choose your exam",
    text: ["Open the exam list, find your exam (for example SSC CGL or RRB NTPC) and open its page.", "Tap “Make this my exam”. Your practice, tests and daily plan will then follow that exam."],
    hi: "Pehle apna exam chuno.",
    kind: "exam",
  },
  {
    title: "Do a 10-question practice set",
    text: [
      "Tap “Smart practice” on your exam page to get 10 questions. Tap the option you think is right: you see at once if it was correct, with a short explanation of the answer.",
      "Don’t know one? Tap Skip and come back to it at the end. There is no timer and no negative marking in practice.",
    ],
    hi: "10 sawaal karo. Galat ho to explanation padho, nahi aata to Skip karo.",
    kind: "practice",
  },
  {
    title: "Read your result",
    text: [
      "At the end you see your accuracy: out of the questions you answered, how many were right. 7 right out of 10 is 70%.",
      "Topics where you got many wrong are your weak topics. Practise those first; that is where your marks will grow fastest.",
    ],
    hi: "Result dekho. Accuracy matlab kitne sahi; weak topics pe zyada practice karo.",
    kind: "progress",
  },
  {
    title: "Revise with flashcards",
    text: ["A flashcard has a question on one side and the answer on the other. Each card comes back just before you would forget it, so a few minutes a day is enough."],
    hi: "Roz thode flashcards revise karo, yaad pakka ho jayega.",
    kind: "review",
  },
  {
    title: "Take your free mock test",
    text: [
      "A mock test is a full timed paper, just like the real exam, with the same marks and negative marking.",
      "Every exam gives you one free test. After that, each timed test uses 1 credit; credits come in small paid packs. Practice and notes stay free.",
    ],
    hi: "Har exam ka ek mock test free hai. Asli exam jaisa, time ke saath do.",
    kind: "mock",
  },
  {
    title: "Track your progress and follow a daily plan",
    text: ["Open Today every day. It gives you a short list of tasks and counts your streak (days in a row you studied). Set your exam date there to see how many days are left."],
    hi: "Roz Today page kholo aur aaj ka plan pura karo.",
    kind: "today",
  },
];

/** A calm, step-by-step guide for someone using StudyClip for the very first time. */
export default function StartPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        path="/start"
        title="Start here"
        intro="New to StudyClip? Follow these six steps in order. Each one takes a few minutes, and everything except extra mock tests is free. No sign-up is needed to begin."
      >
        <p className="text-sm text-slate-500">StudyClip pehli baar use kar rahe ho? Neeche ke 6 steps ek-ek karke karo.</p>
      </PageHeader>

      <ol className="space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="card flex gap-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700" aria-hidden>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="font-semibold text-slate-900">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h2>
              {s.text.map((t) => (
                <p key={t} className="text-sm leading-relaxed text-slate-600">
                  {t}
                </p>
              ))}
              <p lang="hi-Latn" className="text-sm italic text-slate-500">
                {s.hi}
              </p>
              <div className="pt-1">
                <StepButton kind={s.kind} primary={i === 0} />
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="card space-y-3 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-900">Still not sure?</h2>
        <p>
          Ask the help chat anything, in English or Hindi. Or search any page, exam or topic with the search box in the menu. You can come back to this guide any time from the{" "}
          <Link href="/today" className="font-medium text-brand-700">
            Today
          </Link>{" "}
          page or the footer.
        </p>
        <AskHelpButton />
      </section>
    </div>
  );
}
