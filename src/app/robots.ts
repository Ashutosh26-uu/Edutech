import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Built once at build time, so it also works in the static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
