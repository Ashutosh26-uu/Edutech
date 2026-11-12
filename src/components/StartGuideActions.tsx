"use client";

import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/useStore";

export type StepKind = "exam" | "practice" | "progress" | "review" | "mock" | "today";

const LABEL: Record<StepKind, string> = {
  exam: "Choose my exam",
  practice: "Start 10 questions",
  progress: "See my result and progress",
  review: "Open flashcards",
  mock: "Take my free mock test",
  today: "Open today’s plan",
};

/** Where each step's button goes; practice and mock go straight to the chosen exam once there is one. */
function hrefFor(kind: StepKind, examId?: string): string {
  switch (kind) {
    case "exam":
      return examId ? `/exams/${examId}` : "/exams";
    case "practice":
      return examId ? `/practice?exam=${examId}&smart=1` : "/exams";
    case "mock":
      return examId ? `/practice?exam=${examId}&mock=1` : "/exams";
    case "progress":
      return "/progress";
    case "review":
      return "/review";
    case "today":
      return "/today";
  }
}

/** "Do it now" button for one step of the Start here guide. */
export function StepButton({ kind, primary }: { kind: StepKind; primary?: boolean }) {
  const store = useStore();
  const examId = store?.examId;
  const label = kind === "exam" && examId ? "Open my exam" : LABEL[kind];
  const note = (kind === "practice" || kind === "mock") && store && !examId ? " (choose your exam first)" : "";
  return (
    <Link href={hrefFor(kind, examId)} className={primary ? "btn-primary" : "btn-ghost"}>
      {label}
      {note && <span className="font-normal opacity-80">{note}</span>} <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

/** Opens the floating help chat. */
export function AskHelpButton() {
  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={() => document.querySelector<HTMLButtonElement>('button[aria-label="Open help chat"]')?.click()}
    >
      <MessageCircleQuestion className="h-4 w-4" aria-hidden /> Ask the help chat
    </button>
  );
}
