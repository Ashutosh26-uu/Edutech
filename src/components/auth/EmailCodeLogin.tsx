"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "@/lib/account";

const RESEND_WAIT_SEC = 30;

/**
 * Log in without a password: enter an email, get a 6-digit code, enter it. A new email becomes
 * a new account. `onDone` runs once the account is signed in and loaded.
 */
export function EmailCodeLogin({ onDone }: { onDone: () => void }) {
  const account = useAccount();
  const [email, setEmail] = useState("");
  // The address the code was sent to; null while still asking for the email.
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const send = async (to: string, again: boolean) => {
    setBusy(true);
    setError("");
    setNotice("");
    const err = await account.sendLoginCode(to);
    setBusy(false);
    if (err) return setError(err.message);
    setSentTo(to);
    setCode("");
    setWait(RESEND_WAIT_SEC);
    if (again) setNotice("A new code is on its way.");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentTo) return;
    setBusy(true);
    setError("");
    setNotice("");
    const err = await account.loginWithCode(sentTo, code);
    if (!err) return onDone();
    setBusy(false);
    setError(err.message);
    // An expired or locked-out code can never work: clear it so the next step is "Resend code".
    if (err.code === "OTP_EXPIRED" || err.code === "TOO_MANY_ATTEMPTS") setCode("");
  };

  const messages = (
    <div aria-live="polite">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {notice && !error && <p className="text-sm text-emerald-700">{notice}</p>}
    </div>
  );

  if (!sentTo) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(email.trim().toLowerCase(), false);
        }}
        className="card space-y-3"
      >
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" />
        </label>
        <p className="text-xs text-slate-500">We’ll email you a 6-digit code. No password needed.</p>
        {messages}
        <button className="btn-primary w-full py-2.5" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Send code
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="card space-y-3">
      <p className="text-sm text-slate-600">
        We sent a 6-digit code to <span className="font-medium break-all text-slate-900">{sentTo}</span>. If it is not in your inbox, check the spam folder.
      </p>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">6-digit code</span>
        <input
          className="input text-center text-lg tracking-[0.4em]"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          autoFocus
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </label>
      {messages}
      <button className="btn-primary w-full py-2.5" disabled={busy || code.length !== 6}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Log in
      </button>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-500">
        <button
          type="button"
          className="min-h-8 hover:text-slate-900"
          onClick={() => {
            setSentTo(null);
            setCode("");
            setError("");
            setNotice("");
          }}
        >
          Use a different email
        </button>
        <button type="button" className="min-h-8 font-medium text-brand-700 disabled:text-slate-400" disabled={wait > 0 || busy} onClick={() => send(sentTo, true)}>
          {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
