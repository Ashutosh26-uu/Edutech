import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodingList } from "@/components/CodingList";
import { CODING_PROBLEMS } from "@/data/coding-problems";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Coding round practice – write and run code in your browser",
  description: "Placement coding-round problems on arrays, strings, hashing, stacks and dynamic programming. Write Python or JavaScript, run it against sample tests and submit against hidden tests, right in your browser.",
  alternates: { canonical: absoluteUrl("/coding") },
};

export default function CodingPage() {
  const easy = CODING_PROBLEMS.filter((p) => p.difficulty === "easy").length;
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link href="/placement" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-3 w-3" /> Placement hub
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Coding round practice</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          {CODING_PROBLEMS.length} placement-style problems ({easy} easy, {CODING_PROBLEMS.length - easy} medium). Write your answer in Python or JavaScript, run it on the sample tests, then submit it against hidden tests. Your code runs in your own browser and is saved on this device.
        </p>
      </header>
      <CodingList />
    </div>
  );
}
