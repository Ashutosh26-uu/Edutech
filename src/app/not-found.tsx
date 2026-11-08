import Link from "next/link";

export const metadata = { title: "Page not found" };

const LINKS = [
  { href: "/exams", label: "Exams & mock tests" },
  { href: "/practice", label: "Practice by topic" },
  { href: "/learn", label: "Learn a topic" },
  { href: "/progress", label: "My progress" },
];

/** Shown for any URL that does not match a page, with ways back into the site. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-5 py-12 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <h1 className="text-2xl font-semibold text-slate-900">This page doesn’t exist</h1>
      <p className="text-sm text-slate-600">The link may be old or mistyped. Try one of these instead:</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="card-link card py-3 text-sm font-medium">
            {l.label}
          </Link>
        ))}
      </div>
      <Link href="/" className="btn-primary inline-flex">
        Go to home
      </Link>
    </div>
  );
}
