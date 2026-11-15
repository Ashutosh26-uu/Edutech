import type { Metadata } from "next";
import { Suspense } from "react";
import { CodingSolve } from "@/components/CodingSolve";
import { PageSkeleton } from "@/components/Skeleton";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Solve a coding problem",
  description: "Write Python or JavaScript for a placement coding problem and run it against the tests in your browser.",
  alternates: { canonical: absoluteUrl("/coding") },
};

export default function SolvePage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={2} />}>
      <CodingSolve />
    </Suspense>
  );
}
