import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        path="/typing"
        title="Typing test"
        intro={`Practise the typing skill test for SSC CHSL, CGL and similar exams: pick a passage (${en} English, ${hi} Hindi) and start typing. The timer starts with your first key press, and your result shows every mistake.`}
      />
      <TypingTest />
    </div>
  );
}
