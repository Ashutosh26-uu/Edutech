import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Institutes",
  description: "Practice sets published by colleges, universities and coaching institutes, free to practise.",
  alternates: { canonical: "/institutes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
