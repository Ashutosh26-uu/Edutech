import type { Metadata } from "next";
import { ContactEmail, InfoPage } from "@/components/InfoPage";
import { POLICIES_UPDATED, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Refund and cancellation policy",
  description: `When ${SITE_NAME} purchases can be refunded and how to ask for one.`,
};

export default function RefundPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Refund and cancellation policy"
      updated={POLICIES_UPDATED}
      intro={`${SITE_NAME} sells small one-time digital packs. There is no subscription, so there is nothing to cancel and you are never charged again automatically.`}
    >
      <h2>You will get a full refund if</h2>
      <ul>
        <li>Money was deducted but the test credits or revision pack did not appear in your account within 24 hours.</li>
        <li>You were charged more than once for the same order.</li>
        <li>
          You bought a <strong>test pack</strong> and have not used any of its credits, and you ask within <strong>7 days</strong> of the purchase.
        </li>
      </ul>

      <h2>We cannot refund</h2>
      <ul>
        <li>A test pack after one or more of its credits has been used.</li>
        <li>A revision pack, because it unlocks the full syllabus immediately, unless it failed to activate.</li>
        <li>Purchases made more than 7 days ago, except for a failed or duplicate payment.</li>
      </ul>

      <h2>How to ask</h2>
      <p>
        Send a request through <ContactEmail topic="refund" />, using the email you signed up with. Include the amount, the date and the Razorpay payment ID (it starts with “pay_”).
      </p>

      <h2>When you will get it</h2>
      <p>
        Approved refunds are sent to the original payment method (UPI, card, net banking or wallet) within <strong>5–7 working days</strong>. Your bank may take a few more days to
        show it. Any credits or pack linked to the refunded payment are removed.
      </p>
    </InfoPage>
  );
}
