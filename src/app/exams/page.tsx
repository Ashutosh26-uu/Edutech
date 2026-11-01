import type { Metadata } from "next";
import { ExamBrowser } from "@/components/ExamBrowser";
import { CATEGORIES, EXAMS } from "@/data/exams";

export const metadata: Metadata = { title: "Exams" };

export default function ExamsPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold">Government and competitive exams</h1>
        <p className="mt-1.5 text-slate-600">
          {EXAMS.length} exams across {CATEGORIES.length} categories, from SSC and banking to state PSCs, teaching, defence and entrance exams. Pick yours to see the syllabus, practise topics and take mock tests.
        </p>
      </div>
      <ExamBrowser />
    </div>
  );
}
