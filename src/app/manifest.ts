import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyClip",
    short_name: "StudyClip",
    description: "Turn long YouTube lectures into chapters, notes and quizzes, and practise for one-day exams.",
    start_url: `${base}/today/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#09090b",
    // Same as the viewport themeColor in layout.tsx.
    theme_color: "#18181b",
    icons: [
      { src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Today’s plan", url: `${base}/today/` },
      { name: "Review flashcards", url: `${base}/review/` },
      { name: "Break down a video", url: `${base}/video/` },
    ],
  };
}
