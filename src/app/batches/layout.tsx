import type { Metadata } from "next";

// The pages are client components, so their title lives here.
export const metadata: Metadata = {
  title: "Batches",
  description: "Trainer mode: run placement batches, assign tests and see every student's result.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
