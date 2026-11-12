import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { crumbFor } from "@/data/sitemap-nav";

export interface PageAction {
  href: string;
  label: string;
}

interface Props {
  /** This page's path, used to build the breadcrumb from the menu config (e.g. "/review" or "/exams/ssc-cgl"). */
  path: string;
  title: ReactNode;
  /** One plain sentence: what you can do on this page. */
  intro: ReactNode;
  /** Main thing to do here. */
  action?: PageAction;
  /** A quieter second link. */
  secondary?: PageAction;
  /** Extra content under the intro (chips, pickers, small notes). */
  children?: ReactNode;
  /** Content on the right of the title on wide screens (e.g. a picker). */
  aside?: ReactNode;
}

/**
 * The top of a page: "Section › Page" breadcrumb, the page title, one line on what you can do
 * here, and an optional main button. Gives every page the same clear start for first-time visitors.
 */
export function PageHeader({ path, title, intro, action, secondary, children, aside }: Props) {
  const { section, item } = crumbFor(path);
  const isSubpage = item && item.href !== path;
  return (
    <header className="space-y-3">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
          <li>{section}</li>
          {item && (
            <>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                {isSubpage ? (
                  <Link href={item.href} className="underline-offset-2 hover:text-slate-900 hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-slate-700">
                    {item.label}
                  </span>
                )}
              </li>
            </>
          )}
          {isSubpage && (
            <>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="max-w-[60vw] truncate font-medium text-slate-700">
                {title}
              </li>
            </>
          )}
        </ol>
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1.5 text-slate-600">{intro}</p>
        </div>
        {aside}
      </div>
      {children}
      {(action || secondary) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {action && (
            <Link href={action.href} className="btn-primary">
              {action.label} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          {secondary && (
            <Link href={secondary.href} className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline">
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
