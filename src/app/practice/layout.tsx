import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Practice",
  description: "Exam-level practice questions with instant answers and explanations, or a timed mock with negative marking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
