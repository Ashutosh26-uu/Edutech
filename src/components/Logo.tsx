import Link from "next/link";

/** Brand mark: a play shape beside three "chapter" bars of decreasing length. */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-ink" />
      <path d="M9 10.2v11.6c0 .8.9 1.3 1.6.9l9.3-5.8c.6-.4.6-1.3 0-1.7l-9.3-5.8c-.7-.4-1.6.1-1.6.8z" className="fill-on-ink" />
      <rect x="21.5" y="10" width="3" height="3" rx="1" className="fill-brand-500" />
      <rect x="21.5" y="14.5" width="3" height="3" rx="1" className="fill-on-ink opacity-60" />
      <rect x="21.5" y="19" width="3" height="3" rx="1" className="fill-on-ink opacity-30" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="StudyClip home">
      <LogoMark />
      <span className="hidden text-[15px] font-semibold tracking-tight text-slate-900 sm:inline">StudyClip</span>
    </Link>
  );
}
