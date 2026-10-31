import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyClip AI",
    short_name: "StudyClip",
    description: "Turn long YouTube lectures into chapters, notes and quizzes, and practise for one-day exams.",
    start_url: "/today",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Today’s plan", url: "/today" },
      { name: "Review flashcards", url: "/review" },
      { name: "Break down a video", url: "/video" },
    ],
  };
}
