import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Mock interview",
  description: "Answer placement interview questions out loud against the clock and get instant feedback on content, filler words, pace and STAR.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
