import { Clock, Mail, MessageSquareWarning } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { COMPANY, CONTACT_EMAIL, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Get help with your ${SITE_NAME} account, payments, refunds or questions.`,
};

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contact" title="We’re here to help" intro="Questions about your account, a payment, a wrong answer in a question, or an idea for the app? Write to us.">
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card space-y-2">
          <Mail className="h-5 w-5 text-brand-700" />
          <h3 className="font-medium">Email</h3>
          {CONTACT_EMAIL ? (
            <a href={`mailto:${CONTACT_EMAIL}`} className="block break-all text-sm">
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="!mt-0 text-sm">Our support inbox is being set up. It will be listed here shortly.</p>
          )}
        </div>
        <div className="card space-y-2">
          <Clock className="h-5 w-5 text-brand-700" />
          <h3 className="font-medium">Response time</h3>
          <p className="!mt-0 text-sm">Within 2 working days, Monday to Saturday.</p>
        </div>
        <div className="card space-y-2">
          <MessageSquareWarning className="h-5 w-5 text-brand-700" />
          <h3 className="font-medium">Payment issue?</h3>
          <p className="!mt-0 text-sm">
            Include your Razorpay payment ID. See our <Link href="/refund">refund policy</Link>.
          </p>
        </div>
      </div>

      <h2>When you write, please include</h2>
      <ul>
        <li>The email address you signed up with.</li>
        <li>For a payment: the amount, date and Razorpay payment ID (it starts with “pay_”).</li>
        <li>For a question you think is wrong: the exam, the topic and the question text.</li>
      </ul>

      <h2>Grievances</h2>
      <p>
        Complaints about content, your data or a payment can be sent to the same email with the subject “Grievance”. We acknowledge every grievance within 48 hours and resolve it
        within 15 days.
      </p>

      <h2>Company</h2>
      <p>
        {SITE_NAME} is operated by <strong>{COMPANY}</strong>, India.
      </p>
    </InfoPage>
  );
}
