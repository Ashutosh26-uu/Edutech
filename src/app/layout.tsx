import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyClip AI – Study smarter from YouTube",
  description: "Turn long YouTube lectures into chapters, crisp notes and quizzes, and practise for one-day exams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">▶</span>
              StudyClip <span className="text-brand-600">AI</span>
            </Link>
            <Nav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          StudyClip AI prototype · Videos play through YouTube’s official embedded player
        </footer>
      </body>
    </html>
  );
}
