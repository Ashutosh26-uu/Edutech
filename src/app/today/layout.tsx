import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Today’s plan",
  description: "Your daily study plan: due flashcards, smart practice, a lecture and a mock test, with your streak and exam countdown.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
