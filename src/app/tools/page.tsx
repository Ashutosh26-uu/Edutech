import { ArrowRight, FileText, Headphones, Keyboard, Timer, Video, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { TOOLS } from "@/data/sitemap-nav";

export const metadata: Metadata = {
  title: "More tools",
  description: "Extra study tools on StudyClip: video breakdown, audio revision, typing test, focus timer and resume builder.",
};

const ICON: Record<string, LucideIcon> = {
  "/video": Video,
  "/listen": Headphones,
  "/typing": Keyboard,
  "/focus": Timer,
  "/resume": FileText,
};

/** Side tools that are kept out of the main menus, so the menus stay about exam practice. */
export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader path="/tools" title="More tools" intro="Extra tools for when you need them. Your daily practice, tests and revision are in the main menu." action={{ href: "/today", label: "Back to today’s plan" }} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => {
          const Icon = ICON[t.href] ?? ArrowRight;
          return (
            <li key={t.href}>
              <Link href={t.href} className="card flex h-full items-start gap-3 transition hover:border-brand-300">
                <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-slate-900">{t.label}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">{t.description}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
