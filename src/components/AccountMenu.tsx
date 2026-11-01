"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@/lib/account";

/** Log in button, or the signed-in user's menu. Hidden on the static build, which has no accounts. */
export function AccountMenu() {
  const a = useAccount();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (a.mode === "local" || !a.ready) return null;
  if (!a.user) {
    return (
      <Link href="/login" className="btn-primary ml-1 h-8 px-3 text-xs">
        Log in
      </Link>
    );
  }

  return (
    <div ref={box} className="relative ml-1">
      <button onClick={() => setOpen(!open)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold uppercase text-slate-700 hover:bg-slate-200" aria-label="Account menu">
        {(a.user.name ?? a.user.email)[0]}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-30 w-60 rounded-xl border border-slate-200 bg-surface p-1.5 text-sm shadow-lg">
          <div className="flex items-center gap-2 px-2.5 py-2">
            <UserRound className="h-4 w-4 text-slate-400" />
            <div className="min-w-0">
              {a.user.name && <div className="truncate font-medium text-slate-900">{a.user.name}</div>}
              <div className="truncate text-xs text-slate-500">{a.user.email}</div>
            </div>
          </div>
          <div className="mx-2.5 mb-1 rounded-lg bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
            Test credits: <b className="text-slate-900">{a.credits}</b>
            {Object.keys(a.revisionPasses).length > 0 && <> · Revision packs: <b className="text-slate-900">{Object.keys(a.revisionPasses).length}</b></>}
          </div>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block rounded-md px-2.5 py-2 text-slate-700 hover:bg-slate-100">
            Buy tests or revision
          </Link>
          <button
            onClick={async () => {
              setOpen(false);
              await a.logout();
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
