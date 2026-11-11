"use client";

import { Check, Copy, Gift, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { track } from "@/lib/track";

interface Invites {
  code: string;
  joined: number;
  rewarded: number;
  credited: number;
  cap: number;
  invitedBy: "pending" | "rewarded" | null;
}

/** "Invite friends, get free tests": the user's invite link and how many friends joined. */
export default function InvitePage() {
  const account = useAccount();
  const [data, setData] = useState<Invites | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!account.ready || !account.user) return;
    fetch("/api/referral", { cache: "no-store" })
      .then(async (r) => (r.ok ? setData(await r.json()) : setError((await r.json().catch(() => ({}))).error ?? "Could not load your invites.")))
      .catch(() => setError("Could not load your invites."));
  }, [account.ready, account.user]);

  if (IS_STATIC || (account.ready && account.mode === "local")) {
    return <div className="card text-sm">Invites need an account and run on the full site, not this demo build.</div>;
  }
  if (!account.ready) return <PageSkeleton tiles={0} />;
  if (!account.user) {
    return (
      <div className="card mx-auto max-w-md space-y-3 py-8 text-center">
        <Gift className="mx-auto h-8 w-8 text-slate-400" />
        <h1 className="text-lg font-semibold">Invite friends, get free tests</h1>
        <p className="text-sm text-slate-600">Log in to get your invite link. Every friend who joins and takes a timed test earns you both a free test.</p>
        <Link href="/login?next=/invite" className="btn-primary">
          Log in or sign up
        </Link>
      </div>
    );
  }
  if (error) return <div className="card text-sm text-red-600">{error}</div>;
  if (!data) return <PageSkeleton tiles={0} />;

  const link = `${location.origin}/login?tab=signup&ref=${data.code}`;
  const message = `I’m preparing for my exams on StudyClip: free practice questions, mock tests and video notes. Join with my link and we both get a free timed test: ${link}`;
  const share = async () => {
    track("share_click");
    if (navigator.share) await navigator.share({ title: "Join me on StudyClip", text: message }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };
  const copy = async () => {
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const left = Math.max(0, data.cap - data.credited);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Gift className="h-6 w-6 text-brand-600" /> Invite friends, get free tests
        </h1>
        <p className="text-sm text-slate-600">
          Share your link. When a friend signs up with it, verifies their email and finishes their first timed test, you both get <b>1 test credit</b>.
        </p>
      </div>

      <div className="card space-y-3">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Your invite link</span>
          <input className="input font-mono text-xs" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={share}>
            <Share2 className="h-4 w-4" /> Share
          </button>
          <a className="btn-ghost" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" onClick={() => track("share_click")}>
            WhatsApp
          </a>
          <button className="btn-ghost" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-center text-sm">
        <div className="bg-surface p-3">
          <dt className="text-xs text-slate-500">Friends joined</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{data.joined}</dd>
        </div>
        <div className="bg-surface p-3">
          <dt className="text-xs text-slate-500">Took a test</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{data.rewarded}</dd>
        </div>
        <div className="bg-surface p-3">
          <dt className="text-xs text-slate-500">Credits earned</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{data.credited}</dd>
        </div>
      </dl>

      {data.invitedBy === "pending" && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">You joined with a friend’s invite. Finish your first timed test (answer at least 5 questions) to get your free test credit.</p>
      )}

      <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
        <li>The bonus counts once per new account, for accounts that sign up with your link.</li>
        <li>
          You can earn credits for up to {data.cap} friends{left < data.cap ? ` (${left} left)` : ""}. Friends who join after that still get their own credit.
        </li>
        <li>Credits work for a timed test on any exam.</li>
      </ul>
    </div>
  );
}
