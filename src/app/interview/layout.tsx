import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Interview prep",
  description: "Common HR and technical interview questions with model answers and tips for campus placements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
