/** Who runs the site. Used by the footer and the About, Contact and policy pages. */
export const SITE_NAME = "StudyClip";
export const COMPANY = "Reasonateai Private Limited";

/**
 * Support and grievance email, set with NEXT_PUBLIC_CONTACT_EMAIL. Pages show a fallback
 * line until it is set, so no made-up address is ever published.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;

/** What a Contact-page message can be about, with the label shown in the form. */
export const CONTACT_TOPICS = {
  account: "Account or login",
  payment: "Payment problem",
  refund: "Refund request",
  question: "Wrong answer in a question",
  privacy: "My data / privacy request",
  grievance: "Complaint (grievance)",
  other: "Something else",
} as const;
export type ContactTopic = keyof typeof CONTACT_TOPICS;

/** Shown on the policy pages. Update it whenever a policy changes. */
export const POLICIES_UPDATED = "3 November 2026";
