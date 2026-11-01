import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { CommandPalette, PaletteButton } from "@/components/CommandPalette";
import { Logo } from "@/components/Logo";
import { HeaderStats, Nav } from "@/components/Nav";
import { RegisterSW } from "@/components/RegisterSW";
import { ThemeToggle, themeInitScript } from "@/components/ThemeToggle";
import { EXAMS, FEATURED_EXAMS } from "@/data/exams";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "StudyClip – Study smarter from YouTube lectures", template: "%s · StudyClip" },
  description: "Turn long YouTube lectures into chapters, notes and quizzes, and prepare for SSC, banking, railway, UPSC and teaching exams.",
  appleWebApp: { capable: true, title: "StudyClip" },
};

export const viewport: Viewport = { themeColor: "#18181b" };

const FOOTER = [
  {
    title: "Product",
    links: [
      ["Video breakdown", "/video"],
      ["Flashcards", "/review"],
      ["Daily plan", "/today"],
      ["Learn", "/learn"],
    ],
  },
  { title: "Exams", links: [...FEATURED_EXAMS.slice(0, 6).map((e) => [e.name, `/exams/${e.id}`]), [`All ${EXAMS.length} exams`, "/exams"]] },
  {
    title: "Your account",
    links: [
      ["Progress", "/progress"],
      ["Mock tests", "/exams"],
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
            <Logo />
            <div className="min-w-0 flex-1">
              <Nav />
            </div>
            <div className="flex items-center gap-1">
              <PaletteButton />
              <HeaderStats />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-surface">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="max-w-xs space-y-3">
              <Logo />
              <p className="text-sm text-slate-500">Study from YouTube lectures in less time, and prepare for one-day exams with practice that adapts to you.</p>
            </div>
            {FOOTER.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-medium">{col.title}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-slate-500 hover:text-slate-900">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500">
              <span>© {new Date().getFullYear()} StudyClip. Videos play in YouTube’s official player.</span>
              <span>
                Press <kbd className="rounded border border-slate-200 px-1 font-mono">Ctrl K</kbd> to search
              </span>
            </div>
          </div>
        </footer>
        <CommandPalette />
        <RegisterSW />
      </body>
    </html>
  );
}
