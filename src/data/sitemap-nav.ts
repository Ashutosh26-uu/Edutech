/**
 * The one list of the site's pages. The header menus, phone menu, footer, quick search (Ctrl+K)
 * and sitemap.xml are all generated from it, so a page has the same name everywhere.
 * Keep this file free of React and large data: it is bundled into every page.
 */

export interface NavItem {
  href: string;
  label: string;
  /** One short line shown under the label in menus and quick search. */
  description: string;
  /** The page only works with an account; hidden on the static build, which has none. */
  needsAccount?: boolean;
  /** Linked from menus but left out of sitemap.xml (personal pages). */
  private?: boolean;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

/** True on the static (GitHub Pages) build, which has no accounts or server. */
export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";

export const SECTIONS: NavSection[] = [
  {
    id: "today",
    title: "Today",
    items: [{ href: "/today", label: "Today’s plan", description: "Your daily goal, streak and tasks" }],
  },
  {
    id: "practise",
    title: "Practise",
    items: [
      { href: "/exams", label: "Exams", description: "Find your exam: syllabus and topic practice" },
      { href: "/mistakes", label: "Mistake notebook", description: "Practise the questions you got wrong", needsAccount: true, private: true },
      { href: "/saved", label: "Saved questions", description: "Questions you starred", private: true },
      { href: "/drills", label: "Speed drills", description: "60-second calculation drills" },
      { href: "/typing", label: "Typing test", description: "SSC-style typing in English and Hindi" },
    ],
  },
  {
    id: "tests",
    title: "Tests",
    items: [
      { href: "/exams", label: "Full & section mocks", description: "Open your exam to start a timed mock" },
      { href: "/mock-sunday", label: "Sunday All-India Mock", description: "One free paper for everyone, every Sunday" },
      { href: "/leaderboard", label: "Leaderboards", description: "Weekly ranks for every exam", needsAccount: true, private: true },
      { href: "/last-minute", label: "Exam tomorrow pack", description: "Revision sheet, rapid cards and quick tests" },
      { href: "/progress", label: "Test history", description: "Scores and full analysis of past tests" },
    ],
  },
  {
    id: "learn",
    title: "Learn & revise",
    items: [
      { href: "/topics", label: "Topics & notes", description: "Short notes and key points for every topic" },
      { href: "/learn", label: "Search & question solver", description: "Search a topic or get help with a question" },
      { href: "/formulas", label: "Formula sheets", description: "Printable one-page formulas and tricks" },
      { href: "/review", label: "Flashcards", description: "Spaced repetition that schedules itself" },
      { href: "/listen", label: "Audio revision", description: "Listen to key points of your weak topics" },
      { href: "/video", label: "Video breakdown", description: "Lecture notes, chapters and a quiz from YouTube" },
    ],
  },
  {
    id: "plan",
    title: "Plan & track",
    items: [
      { href: "/tracker", label: "Syllabus tracker", description: "Mark topics done and plan revision" },
      { href: "/focus", label: "Focus timer", description: "Pomodoro blocks that earn XP" },
      { href: "/progress", label: "My progress", description: "Accuracy, weak topics and readiness" },
    ],
  },
  {
    id: "career",
    title: "Career",
    items: [
      { href: "/placement", label: "Placement hub", description: "Company tests, aptitude and coding rounds" },
      { href: "/interview", label: "Interview prep", description: "HR and technical questions with answers" },
      { href: "/resume", label: "Resume builder", description: "Templates with PDF and Word download" },
    ],
  },
];

/** Pages listed only in the footer (and the phone menu's bottom row). */
export const COMPANY_LINKS: NavItem[] = [
  { href: "/pricing", label: "Pricing", description: "Test credits and revision packs" },
  { href: "/invite", label: "Invite friends", description: "Get a free test for every friend who joins", needsAccount: true, private: true },
  { href: "/about", label: "About us", description: "Who we are" },
  { href: "/contact", label: "Contact", description: "Help with your account or payments" },
  { href: "/privacy", label: "Privacy policy", description: "What we collect and why" },
  { href: "/terms", label: "Terms of use", description: "The rules for using StudyClip" },
  { href: "/refund", label: "Refund policy", description: "When purchases can be refunded" },
  { href: "/login", label: "Log in", description: "Log in or create an account", needsAccount: true, private: true },
];

/** Drops pages that need an account on the static build. */
export const visible = (items: NavItem[]) => (IS_STATIC ? items.filter((i) => !i.needsAccount) : items);

/** Sections with account-only pages removed on the static build. */
export const NAV_SECTIONS: NavSection[] = SECTIONS.map((s) => ({ ...s, items: visible(s.items) }));

/** Every menu entry (a page can appear under two names, e.g. /progress), for quick search. */
export const ALL_PAGES: NavItem[] = [...SECTIONS.flatMap((s) => s.items), ...COMPANY_LINKS];

/** Public pages, each once, for sitemap.xml. */
export const PUBLIC_PATHS: string[] = [...new Set(ALL_PAGES.filter((i) => !i.private && !i.needsAccount).map((i) => i.href))];

/** Pages listed in more than one section, mapped to the section that owns them. */
const HOME_SECTION: Record<string, string> = { "/exams": "practise", "/practice": "practise", "/progress": "plan", "/tests": "tests" };

const under = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/** Section whose pages contain the current path, for highlighting the header. */
export function activeSection(path: string): string | undefined {
  const own = Object.keys(HOME_SECTION).find((h) => under(path, h));
  if (own) return HOME_SECTION[own];
  return SECTIONS.find((s) => s.items.some((i) => under(path, i.href)))?.id;
}

/** Whether a menu link points at the current page. */
export const isCurrent = (path: string, href: string) => under(path, href) || (href === "/exams" && path.startsWith("/practice"));
