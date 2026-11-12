import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "My progress",
  description: "Your accuracy by subject, weak topics, test score trend and full test history.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
