import type { Metadata } from "next";
import { TypingTest } from "@/components/TypingTest";
import { absoluteUrl } from "@/data/site";
import { PASSAGES } from "@/data/typing-passages";

export const metadata: Metadata = {
  title: "Typing test for SSC CHSL and CGL – English and Hindi",
  description: "Free 5, 10 and 15-minute typing tests in English and Hindi with SSC-style word-by-word checking: gross and net speed, accuracy and highlighted mistakes.",
  alternates: { canonical: absoluteUrl("/typing") },
};

export default function TypingPage() {
  const en = PASSAGES.filter((p) => p.lang === "en").length;
  const hi = PASSAGES.length - en;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Skill practice</p>
        <h1 className="mt-1 text-2xl font-semibold">Typing test</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Practise for the typing skill test in SSC CHSL, CGL and similar exams with {en} English and {hi} Hindi passages. Pasting is turned off, the timer starts with your first key press, and your result shows every mistake.
        </p>
      </div>
      <TypingTest />
    </div>
  );
}
