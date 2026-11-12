import type { ReactNode } from "react";
import { EXAMS, FEATURED_EXAMS } from "@/data/exams";
import { HomeTopClient } from "@/components/HomeTopClient";

/**
 * Before first paint, marks <html data-home-exam> when this browser has a saved exam, so a
 * returning visitor sees a placeholder (not the picker and hero) while the dashboard loads.
 * First-time visitors, and browsers without JavaScript, get the picker and hero straight away.
 */
const markSavedExam = `try{var s=JSON.parse(localStorage.getItem("studyclip:v1")||"{}");if(s&&s.examId)document.documentElement.dataset.homeExam="1"}catch(e){}`;

/**
 * The personal top of the home page (exam picker or dashboard) above the generic hero. The exam
 * list stays on the server: the browser gets only the featured exams, and loads the full list
 * (and the topic list) only when it is actually needed.
 */
export function HomeTop({ children }: { children: ReactNode }) {
  const featured = FEATURED_EXAMS.map(({ id, name, fullName }) => ({ id, name, fullName }));
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: markSavedExam }} />
      <HomeTopClient featured={featured} examCount={EXAMS.length}>
        {children}
      </HomeTopClient>
    </>
  );
}
