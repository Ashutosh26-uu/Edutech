"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { useAccount } from "@/lib/account";
import { IS_STATIC, postJson } from "@/lib/api";

/** Account settings: who is signed in, and deleting the account with its data. */
export default function AccountPage() {
  const account = useAccount();
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ loginDeleted: boolean } | null>(null);

  if (IS_STATIC) return <StaticNotice>Accounts work on the full site only.</StaticNotice>;
  if (done)
    return (
      <div className="card mx-auto max-w-xl space-y-3">
        <h1 className="text-xl font-semibold">Your account has been deleted</h1>
        <p className="text-sm text-slate-600">
          Your progress, tests, notes, batches, challenges and posts are gone. Payment records are kept without your name, as tax law requires.
          {done.loginDeleted ? "" : " If you can still log in with the same email, write to us from the Contact page and we will remove the login too."}
        </p>
        <Link href="/" className="btn-primary">
          Back to StudyClip
        </Link>
      </div>
    );
  if (!account.ready) return <PageSkeleton tiles={1} />;
  if (!account.user)
    return (
      <div className="card mx-auto max-w-xl space-y-3 text-sm">
        <p>Log in to manage your account.</p>
        <Link href="/login?next=/account" className="btn-primary">
          Log in
        </Link>
      </div>
    );

  async function remove() {
    setBusy(true);
    setError("");
    const { status, data } = await postJson<{ loginDeleted: boolean }>("/api/account/delete", { confirm: "DELETE" });
    if (status !== 200) {
      setBusy(false);
      return setError(data.error ?? "Could not delete the account. Please try again.");
    }
    await account.logout().catch(() => {});
    setDone({ loginDeleted: data.loginDeleted });
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="card space-y-1">
        <p className="eyebrow">Account</p>
        {account.user.name && <h1 className="text-xl font-semibold">{account.user.name}</h1>}
        <p className="text-sm text-slate-600">{account.user.email}</p>
      </div>
      <div className="card space-y-3 border-red-200">
        <h2 className="flex items-center gap-2 font-semibold text-red-800">
          <Trash2 className="h-4 w-4" /> Delete my account
        </h2>
        <p className="text-sm text-slate-600">
          This permanently deletes your progress, test history, mistakes, notes, credits, revision packs, batches you run, challenges and posts. Access given to your email (publishing, co-trainer, institute staff) is removed. It can&rsquo;t be undone.
        </p>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">
            Type <b>DELETE</b> to confirm
          </span>
          <input className="input" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary bg-red-700 hover:bg-red-800" onClick={remove} disabled={busy || typed !== "DELETE"}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete my account
        </button>
      </div>
    </div>
  );
}
