import type { Metadata } from "next";
import { ExamBrowser } from "@/components/ExamBrowser";
import { PageHeader } from "@/components/PageHeader";
import { CATEGORIES, EXAMS } from "@/data/exams";

export const metadata: Metadata = { title: "Exams" };

export default function ExamsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        path="/exams"
        title="Choose your exam"
        intro={`Open your exam for its syllabus, topic practice and mock tests. ${EXAMS.length} exams in ${CATEGORIES.length} categories.`}
        secondary={{ href: "/start", label: "New here? See how StudyClip works" }}
      />
      <ExamBrowser />
    </div>
  );
}
