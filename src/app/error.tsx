"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Shown when a page throws while rendering: retry, or leave for a working page. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="text-sm text-slate-600">This page hit an error. Your saved progress is safe. Try again, or go back.</p>
      {error.digest && <p className="text-xs text-slate-400">Error ref: {error.digest}</p>}
      <div className="flex flex-wrap justify-center gap-2">
        <button className="btn-primary" onClick={reset}>
          Try again
        </button>
        <button className="btn-ghost" onClick={() => history.back()}>
          ← Go back
        </button>
        <Link href="/" className="btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
