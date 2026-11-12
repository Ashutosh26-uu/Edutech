import type { Metadata } from "next";

// The page is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Video breakdown",
  description: "Turn a YouTube lecture into chapters, notes, a searchable transcript and a quiz.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
