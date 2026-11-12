import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Pricing",
  description: "Free to study. Test credits and revision packs from ₹19, no subscription.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
