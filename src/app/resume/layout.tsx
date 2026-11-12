import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Resume builder",
  description: "Build a one-page resume with ready templates and download it as PDF or Word.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
