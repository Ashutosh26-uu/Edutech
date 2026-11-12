import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Flashcards",
  description: "Spaced-repetition flashcards that come back just before you would forget them.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
