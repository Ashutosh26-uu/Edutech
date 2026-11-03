import { Clock, Mail, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { InfoPage } from "@/components/InfoPage";
import { COMPANY, CONTACT_EMAIL, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Get help with your ${SITE_NAME} account, payments, refunds or questions.`,
};

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contact" title="We’re here to help" intro="Questions about your account, a payment, a wrong answer in a question, or an idea for the app? Send us a message.">
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card space-y-2">
          <Mail className="h-5 w-5 text-brand-700" />
          <h3 className="font-medium">Message us</h3>
          {CONTACT_EMAIL ? (
            <p className="!mt-0 text-sm">
              Use the form below or email <a href={`mailto:${CONTACT_EMAIL}`} className="break-all">{CONTACT_EMAIL}</a>.
            </p>
          ) : (
            <p className="!mt-0 text-sm">Use the form below. We reply to the email address you give.</p>
          )}
        </div>
        <div className="card space-y-2">
          <Clock className="h-5 w-5 text-brand-700" />
          <h3 className="font-medium">Response time</h3>
          <p className="!mt-0 text-sm">Within 2 working days, Monday to Saturday.</p>
        </div>
        <div className="card space-y-2">
          <Receipt className="h-5 w-5 text-brand-700" />
          <h3 className="font-medium">Payment issue?</h3>
          <p className="!mt-0 text-sm">
            Include your Razorpay payment ID. See our <Link href="/refund">refund policy</Link>.
          </p>
        </div>
      </div>

      <h2 id="form" className="scroll-mt-20">
        Send a message
      </h2>
      <div className="mt-4">
        <ContactForm />
      </div>

      <h2>To help us reply faster</h2>
      <ul>
        <li>Use the email address you signed up with.</li>
        <li>For a payment: the amount, date and Razorpay payment ID (it starts with “pay_”).</li>
        <li>For a question you think is wrong: the exam, the topic and the question text.</li>
      </ul>

      <h2>Grievances</h2>
      <p>
        Complaints about content, your data or a payment can be sent with the form above by choosing “Complaint (grievance)”. We acknowledge every grievance within 48 hours
        and resolve it within 15 days.
      </p>

      <h2>Company</h2>
      <p>
        {SITE_NAME} is operated by <strong>{COMPANY}</strong>, India.
      </p>
    </InfoPage>
  );
}
