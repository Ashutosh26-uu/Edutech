import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Leaderboards",
  description: "Weekly leaderboards for every exam, from your best timed tests.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
