"use client";

import Link from "next/link";
import { useStore } from "@/lib/useStore";

/** A feature that needs the full site, with places to keep studying meanwhile, so the page is not a dead end. */
export function StaticNotice({ children }: { children: React.ReactNode }) {
  const store = useStore();
  const practise = store?.examId ? `/practice?exam=${store.examId}&smart=1` : "/exams";
  return (
    <div className="card space-y-3 text-sm">
      <p>{children}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-500">Meanwhile:</span>
        <Link href="/saved" className="btn-ghost px-3 py-1.5 text-xs">
          Saved questions
        </Link>
        <Link href="/progress" className="btn-ghost px-3 py-1.5 text-xs">
          My progress
        </Link>
        <Link href={practise} className="btn-primary px-3 py-1.5 text-xs">
          Practise
        </Link>
      </div>
    </div>
  );
}
