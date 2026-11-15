"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";

/** Trainer-mode pages need an account: shows the static-build notice or a log-in prompt otherwise. */
export function BatchGate({ children }: { children: ReactNode }) {
  const account = useAccount();
  const path = usePathname();
  const params = useSearchParams();
  if (IS_STATIC) return <StaticNotice>Batches need an account, so they work on the full site only.</StaticNotice>;
  if (!account.ready) return <PageSkeleton tiles={2} />;
  if (!account.user) {
    const next = encodeURIComponent(`${path}${params.size ? `?${params}` : ""}`);
    return (
      <div className="card max-w-xl space-y-3">
        <h1 className="text-xl font-semibold">Log in to use batches</h1>
        <p className="text-sm text-slate-600">Students join their trainer’s batch to take assigned tests. Trainers create batches, assign tests and see every student’s result. Both need a free account.</p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/login?next=${next}`} className="btn-primary">
            Log in
          </Link>
          <Link href={`/login?tab=signup&next=${next}`} className="btn-ghost">
            Create a free account
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
