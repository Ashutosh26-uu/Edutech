import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Challenge a friend",
  description: "Make a 10-question challenge, send the link, and see who scores more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
