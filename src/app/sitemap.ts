import type { MetadataRoute } from "next";
import { EXAMS } from "@/data/exams";
import { absoluteUrl } from "@/data/site";
import { TOPICS } from "@/data/topics";
import { formulaTopics } from "@/lib/formulas";

// Built once at build time, so it also works in the static export.
export const dynamic = "force-static";

const PAGES = ["/", "/exams", "/topics", "/today", "/review", "/last-minute", "/formulas", "/drills", "/typing", "/interview", "/resume", "/pricing", "/about", "/contact", "/privacy", "/terms", "/refund"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    ...PAGES.map((p) => ({ url: absoluteUrl(p), priority: p === "/" ? 1 : 0.6 })),
    ...EXAMS.map((e) => ({ url: absoluteUrl(`/exams/${e.id}`), priority: 0.8 })),
    ...TOPICS.map((t) => ({ url: absoluteUrl(`/topics/${t.id}`), priority: 0.8 })),
    ...(await formulaTopics()).map((t) => ({ url: absoluteUrl(`/formulas/${t.id}`), priority: 0.7 })),
  ];
}
