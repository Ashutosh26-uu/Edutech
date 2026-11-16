import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_STATIC=1 builds a static site (used for GitHub Pages). It is served from a
 * sub-path such as /Edutech, given by NEXT_PUBLIC_BASE_PATH. Without it, the app runs with
 * its API routes as a normal Next.js server.
 */
const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

/**
 * Security headers for every response. The CSP is deliberately narrow: it stops other sites from
 * framing StudyClip (clickjacking), plugins, <base> hijacking and forms posting off-site, without
 * restricting scripts (Next.js, Razorpay checkout and YouTube need inline and third-party code).
 */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.razorpay.com" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self \"https://checkout.razorpay.com\" \"https://api.razorpay.com\")" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = isStatic
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      poweredByHeader: false,
      async headers() {
        return [{ source: "/:path*", headers: SECURITY_HEADERS }];
      },
    };

export default nextConfig;
