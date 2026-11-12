import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Exam tomorrow pack",
  description: "The night before your exam: one-page revision sheets, rapid flashcards and quick timed tests.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
