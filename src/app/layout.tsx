import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";
import { AccountSync } from "@/components/AccountSync";
import { CommandPalette, PaletteButton } from "@/components/CommandPalette";
import { FocusPill } from "@/components/FocusPill";
import { HelpBot } from "@/components/HelpBot";
import { Logo } from "@/components/Logo";
import { HeaderStats, MobileNav, Nav } from "@/components/Nav";
import { RegisterSW } from "@/components/RegisterSW";
import { SiteEvents } from "@/components/SiteEvents";
import { ThemeToggle, themeInitScript } from "@/components/ThemeToggle";
import { EXAM_BY_ID, EXAMS } from "@/data/exams";
import { COMPANY } from "@/data/site";
import { AccountProvider } from "@/lib/account";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "StudyClip – Study smarter from YouTube lectures", template: "%s · StudyClip" },
  description: "Turn long YouTube lectures into chapters, notes and quizzes, and prepare for SSC, banking, railway, UPSC and teaching exams.",
  appleWebApp: { capable: true, title: "StudyClip" },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg` },
};

// viewportFit "cover" lets the safe-area padding in globals.css take effect on notched phones.
export const viewport: Viewport = { themeColor: "#18181b", width: "device-width", initialScale: 1, viewportFit: "cover" };

const FOOTER: { title: string; links: [label: string, href: string][] }[] = [
  {
    title: "Study",
    links: [
      ["Daily plan", "/today"],
      ["Video breakdown", "/video"],
      ["Learn topics", "/learn"],
      ["All topics", "/topics"],
      ["Flashcards", "/review"],
      ["Syllabus tracker", "/tracker"],
      ["Focus timer", "/focus"],
      ["Exam tomorrow", "/last-minute"],
      ["Formula sheets", "/formulas"],
      ["Speed drills", "/drills"],
      ["Typing test", "/typing"],
      ["Interview prep", "/interview"],
      ["Resume builder", "/resume"],
    ],
  },
  // One popular exam from each family: SSC, banking, railways, UPSC, teaching.
  {
    title: "Exams",
    links: [
      ...["ssc-cgl", "ibps-po", "rrb-ntpc", "upsc-prelims", "ctet"].flatMap((id): [string, string][] => {
        const e = EXAM_BY_ID.get(id);
        return e ? [[e.name, `/exams/${e.id}`]] : [];
      }),
      [`All ${EXAMS.length} exams →`, "/exams"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Log in", "/login"],
      ["Create account", "/login?tab=signup"],
      ["My progress", "/progress"],
      ["Leaderboards", "/leaderboard"],
      ["Invite friends", "/invite"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About us", "/about"],
      ["Contact", "/contact"],
      ["Privacy policy", "/privacy"],
      ["Terms of use", "/terms"],
      ["Refund policy", "/refund"],
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
        <AccountProvider>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 lg:gap-4 xl:gap-6">
            <Logo />
            <div className="min-w-0 flex-1">
              <Nav />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <PaletteButton />
              <HeaderStats />
              <ThemeToggle />
              <AccountMenu />
              <MobileNav />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 sm:py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.3fr_3fr] lg:gap-16">
            <div className="max-w-sm space-y-4">
              <Logo showName />
              <p className="text-sm leading-relaxed text-slate-500">Study from YouTube lectures in less time, and prepare for one-day exams with practice that adapts to you.</p>
              <p className="text-xs leading-relaxed text-slate-500">SSC · Banking · Railways · UPSC &amp; State PSC · Teaching · Defence</p>
            </div>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {FOOTER.map((col) => (
                <div key={col.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">{col.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {col.links.map(([label, href]) => (
                      <li key={label}>
                        <Link href={href} className="text-slate-500 transition-colors hover:text-slate-900">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="border-t border-slate-200">
            <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} StudyClip. Videos play in YouTube’s official player.</p>
              <p>
                Powered by <span className="font-medium text-slate-700">{COMPANY}</span>
              </p>
            </div>
          </div>
        </footer>
        <CommandPalette />
        <HelpBot />
        <RegisterSW />
        <AccountSync />
        <SiteEvents />
        <FocusPill />
        </AccountProvider>
      </body>
    </html>
  );
}
