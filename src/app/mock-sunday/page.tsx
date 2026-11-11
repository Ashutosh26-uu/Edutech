import type { Metadata } from "next";
import { SundayMock } from "@/components/SundayMock";
import { WEEKLY_EXAMS } from "@/lib/weekly";

export const metadata: Metadata = {
  title: "Sunday All-India Mock",
  description: `A free weekly mock for ${WEEKLY_EXAMS.map((e) => e.name).join(", ")}: one paper for every student, live every Sunday, with your all-India rank and the top 10.`,
};

export default function SundayMockPage() {
  return <SundayMock />;
}
