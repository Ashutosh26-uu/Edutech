import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Search & question solver",
  description: "Search any topic for notes and key points, or get step-by-step help with a specific question.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
