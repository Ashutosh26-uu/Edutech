import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PageAction } from "./PageHeader";

/** "Nothing here yet" box that always says what to do next, with a button to do it. */
export function EmptyState({ title, children, action, secondary }: { title: string; children?: ReactNode; action: PageAction; secondary?: PageAction }) {
  return (
    <div className="card space-y-3 text-sm text-slate-600">
      <p className="font-semibold text-slate-900">{title}</p>
      {children && <div>{children}</div>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link href={action.href} className="btn-primary">
          {action.label} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {secondary && (
          <Link href={secondary.href} className="font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline">
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}

/** Where "practise" should go: the chosen exam's smart practice, or the exam list when none is chosen. */
export const practiseHref = (examId?: string) => (examId ? `/practice?exam=${examId}&smart=1` : "/exams");
