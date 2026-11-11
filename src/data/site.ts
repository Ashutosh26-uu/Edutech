/** Who runs the site. Used by the footer and the About, Contact and policy pages. */
export const SITE_NAME = "StudyClip";
export const COMPANY = "Reasonateai Private Limited";

/**
 * The public address of the site root (including any sub-path it is served from), set with
 * NEXT_PUBLIC_SITE_URL. Used for the sitemap, robots.txt and canonical links.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://studyclip.netlify.app").replace(/\/+$/, "");

/** Absolute URL of a page; the static export serves every page with a trailing slash. */
export function absoluteUrl(path: string) {
  const p = path === "/" ? "/" : process.env.NEXT_PUBLIC_STATIC === "1" ? `${path.replace(/\/$/, "")}/` : path;
  return SITE_URL + p;
}

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
