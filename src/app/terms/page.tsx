import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, InfoPage } from "@/components/InfoPage";
import { COMPANY, POLICIES_UPDATED, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms for using ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of use"
      updated={POLICIES_UPDATED}
      intro={`These terms apply to your use of ${SITE_NAME}, a service of ${COMPANY} (“we”). By using the site you agree to them.`}
    >
      <h2>Your account</h2>
      <ul>
        <li>Give a valid email address and keep your password private. You are responsible for activity on your account.</li>
        <li>One person, one account. Accounts, test credits and packs cannot be sold or transferred.</li>
        <li>If you are under 18, use {SITE_NAME} with the consent of a parent or guardian.</li>
      </ul>

      <h2>What you can do</h2>
      <p>You may use {SITE_NAME} for your own exam preparation. You may not:</p>
      <ul>
        <li>Copy, resell or republish our questions, notes or explanations in bulk.</li>
        <li>Scrape the site, overload it, or try to get around limits, payments or security.</li>
        <li>Use the service for anything unlawful.</li>
      </ul>

      <h2>Study content</h2>
      <p>
        Questions and notes are written to help you prepare and are checked with care, but mistakes can happen. Exam patterns, syllabi and dates change, so always confirm
        official details with the exam’s conducting body. {SITE_NAME} is not affiliated with SSC, UPSC, IBPS, RRB or any other exam body, and a good score here does not
        guarantee a result in the real exam.
      </p>
      <p>
        Lecture videos are played in YouTube’s official player and remain the property of their creators. Notes and quizzes made from a video are for your personal study.
      </p>

      <h2>Payments</h2>
      <ul>
        <li>
          Prices are shown in Indian rupees on the <Link href="/pricing">pricing page</Link> and include applicable taxes. Payments are handled by Razorpay.
        </li>
        <li>Test credits do not expire. A revision pack gives access for the stated number of days for the exam you choose.</li>
        <li>
          Refunds follow our <Link href="/refund">refund policy</Link>.
        </li>
      </ul>

      <h2>Suspension</h2>
      <p>We may suspend or close an account that breaks these terms or misuses the service. You can stop using {SITE_NAME} and ask us to delete your account at any time.</p>

      <h2>Liability</h2>
      <p>
        {SITE_NAME} is provided “as is”. To the extent the law allows, we are not liable for indirect losses, and our total liability for any claim is limited to the amount you
        paid us in the three months before it.
      </p>

      <h2>Changes and law</h2>
      <p>
        We may update these terms; the date at the top shows the latest version. These terms are governed by the laws of India, and disputes are subject to the jurisdiction of
        Indian courts.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <ContactEmail />.
      </p>
    </InfoPage>
  );
}
