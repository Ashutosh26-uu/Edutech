import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Daily current affairs quiz",
  description: "A free daily current affairs quiz for SSC, banking, railway, UPSC and state exams, with the answer and explanation after every question.",
  alternates: { canonical: "/current-affairs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
