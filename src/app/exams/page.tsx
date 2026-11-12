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
        intro={`Find your exam below and open it. You will see its syllabus, practise its topics and take mock tests. ${EXAMS.length} exams across ${CATEGORIES.length} categories, from SSC and banking to state PSCs, teaching, defence and entrance exams.`}
        secondary={{ href: "/start", label: "New here? See how StudyClip works" }}
      />
      <ExamBrowser />
    </div>
  );
}
