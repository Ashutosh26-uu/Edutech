import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CommandPalette, PaletteButton } from "@/components/CommandPalette";
import { HeaderStats, Nav } from "@/components/Nav";
import { RegisterSW } from "@/components/RegisterSW";
import { ThemeToggle, themeInitScript } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyClip AI – Study smarter from YouTube",
  description: "Turn long YouTube lectures into chapters, crisp notes and quizzes, and practise for one-day exams.",
  appleWebApp: { capable: true, title: "StudyClip" },
};

export const viewport: Viewport = { themeColor: "#4f46e5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-slate-900">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">▶</span>
              <span className="hidden sm:inline">
                StudyClip <span className="text-brand-600">AI</span>
              </span>
            </Link>
            <div className="min-w-0 flex-1">
              <Nav />
            </div>
            <PaletteButton />
            <HeaderStats />
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          StudyClip AI prototype · Videos play through YouTube’s official embedded player · Press <kbd>Ctrl K</kbd> to search
        </footer>
        <CommandPalette />
        <RegisterSW />
      </body>
    </html>
  );
}
