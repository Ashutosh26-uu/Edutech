import type { ReactNode } from "react";
import { BANK_SIZES } from "@/data/bank";
import { EXAMS, FEATURED_EXAMS } from "@/data/exams";
import { HomeTopClient } from "@/components/HomeTopClient";

/**
 * The personal top of the home page (exam picker or dashboard) above the generic hero. The exam
 * list stays on the server: the browser gets only the featured exams, and loads the full list
 * (and the topic list) only when it is actually needed.
 */
export function HomeTop({ children }: { children: ReactNode }) {
  const featured = FEATURED_EXAMS.map(({ id, name, fullName }) => ({ id, name, fullName }));
  return (
    <HomeTopClient featured={featured} examCount={EXAMS.length} questionCount={Object.values(BANK_SIZES).reduce((a, b) => a + b, 0)}>
      {children}
    </HomeTopClient>
  );
}
