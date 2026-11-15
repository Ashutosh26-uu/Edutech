import type { Metadata } from "next";

// The pages are client components, so their title lives here.
export const metadata: Metadata = {
  title: "Institute",
  description: "Question sets published by a college, university or coaching institute.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
