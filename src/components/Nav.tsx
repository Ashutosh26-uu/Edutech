"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/video", label: "Video Breakdown" },
  { href: "/exams", label: "Exam Prep" },
  { href: "/learn", label: "Learn" },
  { href: "/progress", label: "My Progress" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto text-sm">
      {LINKS.map((l) => {
        const active = path.startsWith(l.href) || (l.href === "/exams" && path.startsWith("/practice"));
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
