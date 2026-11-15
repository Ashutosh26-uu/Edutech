import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Exam calendar",
  description: "Upcoming application dates, admit cards, exam days and results for SSC, banking, railway, UPSC, state and entrance exams, with official links.",
  alternates: { canonical: "/calendar" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
