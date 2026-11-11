import type { MetadataRoute } from "next";
import { EXAMS } from "@/data/exams";
import { absoluteUrl } from "@/data/site";
import { TOPICS } from "@/data/topics";

// Built once at build time, so it also works in the static export.
export const dynamic = "force-static";

const PAGES = ["/", "/exams", "/topics", "/today", "/listen", "/review", "/last-minute", "/interview", "/resume", "/pricing", "/about", "/contact", "/privacy", "/terms", "/refund"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: absoluteUrl(p), priority: p === "/" ? 1 : 0.6 })),
    ...EXAMS.map((e) => ({ url: absoluteUrl(`/exams/${e.id}`), priority: 0.8 })),
    ...TOPICS.map((t) => ({ url: absoluteUrl(`/topics/${t.id}`), priority: 0.8 })),
  ];
}
