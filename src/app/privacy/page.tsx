import type { Metadata } from "next";
import { ContactEmail, InfoPage } from "@/components/InfoPage";
import { COMPANY, POLICIES_UPDATED, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `What data ${SITE_NAME} collects, why, and how you can control it.`,
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy policy"
      updated={POLICIES_UPDATED}
      intro={`This policy explains what ${SITE_NAME}, operated by ${COMPANY} (“we”), collects when you use the site, why, and the choices you have.`}
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your email address, an optional name, and your password, which is stored only as a secure hash by our authentication provider.
        </li>
        <li>
          <strong>Study activity:</strong> tests you start and submit, your answers and scores, free tests used, test credits and revision packs.
        </li>
        <li>
          <strong>Payments:</strong> the order and payment IDs, amount, status and date. Card, UPI and bank details are entered on Razorpay and never reach our servers.
        </li>
        <li>
          <strong>Messages to us:</strong> the name, email, topic and message you send through the contact form, so we can reply and keep a record of the request.
        </li>
        <li>
          <strong>On your device:</strong> practice progress, flashcards, notes and your light or dark theme are saved in your browser’s local storage.
        </li>
        <li>
          <strong>Technical data:</strong> IP address and basic request logs, kept briefly to keep the service secure and to limit abuse.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To create your account, sign you in and verify your email.</li>
        <li>To run timed tests, score them and show your progress and weak topics.</li>
        <li>To process payments and give you the credits or packs you bought.</li>
        <li>To answer your support requests and prevent fraud or misuse.</li>
      </ul>
      <p>We do not sell your personal data, and we do not show third-party advertising.</p>

      <h2>Who we share it with</h2>
      <p>Only the service providers needed to run {SITE_NAME}, each under their own privacy terms:</p>
      <ul>
        <li>
          <strong>Neon</strong> for our database and sign-in (account, sessions, study and payment records).
        </li>
        <li>
          <strong>Razorpay</strong> for payments.
        </li>
        <li>
          <strong>Netlify</strong> for hosting the website.
        </li>
        <li>
          <strong>YouTube (Google)</strong>, whose official player loads when you watch a lecture on {SITE_NAME}.
        </li>
      </ul>
      <p>We may also disclose data when required by law or to protect our users and the service.</p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account data while your account is active. Payment records are kept for as long as tax and accounting laws require. When you ask us to delete your account,
        we remove your personal data within 30 days, except records we must keep by law.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can ask to see, correct or delete your personal data.</li>
        <li>You can clear the data saved on your device at any time from your browser settings.</li>
        <li>You can withdraw consent by deleting your account; this does not affect processing done before.</li>
      </ul>
      <p>
        To make a request, use <ContactEmail topic="privacy" />.
      </p>

      <h2>Security</h2>
      <p>Data is sent over HTTPS and stored with our providers in encrypted form. Passwords are never stored in plain text. No method is perfectly secure, but we work to protect your data.</p>

      <h2>Children</h2>
      <p>{SITE_NAME} is meant for exam aspirants. If you are under 18, please use it with the consent of a parent or guardian.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we will update the date at the top of this page. Significant changes will also be shown on the site.</p>

      <h2>Contact and grievances</h2>
      <p>
        Questions or complaints about your data can be sent through <ContactEmail topic="privacy" />. We respond within 15 days.
      </p>
    </InfoPage>
  );
}
