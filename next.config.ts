import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_STATIC=1 builds a static site (used for GitHub Pages). It is served from a
 * sub-path such as /Edutech, given by NEXT_PUBLIC_BASE_PATH. Without it, the app runs with
 * its API routes as a normal Next.js server.
 */
const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

const nextConfig: NextConfig = isStatic
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
