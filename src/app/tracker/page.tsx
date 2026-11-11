import type { Metadata } from "next";
import { SyllabusTracker } from "@/components/SyllabusTracker";

export const metadata: Metadata = {
  title: "Syllabus tracker",
  description: "Track every subject and topic of your exam: mark what you’ve studied, see your accuracy, and get a spaced revision plan.",
};

export default function TrackerPage() {
  return <SyllabusTracker />;
}
