import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { EXAMS } from "@/data/exams";
import { COMPANY, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${SITE_NAME} helps students study from YouTube lectures and prepare for one-day government and entrance exams.`,
};

export default function AboutPage() {
  return (
    <InfoPage eyebrow="About us" title="Study less, remember more" intro={`${SITE_NAME} turns long lectures into short notes and gives you exam practice that adapts to what you get wrong.`}>
      <h2>What we do</h2>
      <p>
        Most aspirants learn from free YouTube lectures, then struggle to revise them. {SITE_NAME} breaks a lecture into chapters, notes and a quiz, and keeps a daily plan
        of what to revise next using spaced repetition.
      </p>
      <p>
        For one-day exams, we cover <strong>{EXAMS.length} exams</strong>: SSC, banking, railways, UPSC and state PSCs, teaching, defence and more. Every practice set mixes easy,
        moderate, hard and very hard questions, with an explanation for each answer and a focus on the points that previous-year papers keep testing.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>
          <strong>Free to study.</strong> Topic practice, video breakdown, flashcards, the daily plan and one timed test per exam cost nothing.
        </li>
        <li>
          <strong>₹19 when the exam is close.</strong> Extra timed tests or a full-syllabus revision pack, only when you need them. No subscription. See{" "}
          <Link href="/pricing">pricing</Link>.
        </li>
        <li>
          <strong>Your progress stays with you.</strong> Sign in and your scores, weak topics and test credits follow you on any device.
        </li>
      </ul>

      <h2>Who we are</h2>
      <p>
        {SITE_NAME} is built and run by <strong>{COMPANY}</strong>, India. Questions or feedback are always welcome on our <Link href="/contact">Contact page</Link>.
      </p>
    </InfoPage>
  );
}
