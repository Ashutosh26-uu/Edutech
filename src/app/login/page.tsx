"use client";

import { Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { rememberRef } from "@/components/SiteEvents";
import { useAccount } from "@/lib/account";
import { track } from "@/lib/track";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const account = useAccount();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/today";
  const [tab, setTab] = useState<"login" | "signup">(params.get("tab") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Set once an account needs its emailed 6-digit code: after sign-up, or on login before verifying.
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (account.user) router.replace(next);
  }, [account.user, next, router]);

  // An invite link (/login?tab=signup&ref=CODE): keep the code until the new account signs in.
  const invited = !!params.get("ref");
  useEffect(() => {
    rememberRef(params.get("ref"));
  }, [params]);

  if (account.mode === "local") {
    return (
      <div className="card mx-auto max-w-md text-center text-sm text-slate-600">
        Accounts are available on the full version of StudyClip. On this site, your progress is saved in your browser.{" "}
        <Link href="/today" className="font-medium text-brand-700">
          Continue
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const clean = email.trim().toLowerCase();
    const result = tab === "login" ? await account.login(clean, password) : await account.signup(clean, password, name || undefined);
    if (tab === "signup" && (result === "verify" || result === null)) track("signup");
    if (result === "verify") {
      setBusy(false);
      return setVerifying(clean);
    }
    if (result?.code === "EMAIL_NOT_VERIFIED") {
      // Log-in before verifying: email a fresh code and ask for it.
      const sent = await account.resendCode(clean);
      setBusy(false);
      return sent ? setError(sent.message) : setVerifying(clean);
    }
    setBusy(false);
    if (result) setError(result.message);
    else router.replace(next);
  };

  if (verifying) {
    return (
      <VerifyEmail
        email={verifying}
        onVerified={() => router.replace(next)}
        onBack={() => {
          setVerifying(null);
          setError("");
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-6">
      <div className="space-y-3 text-center">
        <LogoMark className="mx-auto h-10 w-10" />
        <h1 className="text-2xl font-semibold">{tab === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-slate-600">{tab === "login" ? "Log in to use your tests and revision packs." : "Free to join. Get one free timed test for every exam."}</p>
        {invited && tab === "signup" && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">You were invited by a friend. Verify your email and finish your first timed test, and you both get 1 extra test credit.</p>
        )}
      </div>
      <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-surface p-0.5 text-sm">
        {(["login", "signup"] as const).map((t) => (
          <button key={t} onClick={() => (setTab(t), setError(""))} className={`rounded-md py-1.5 ${tab === t ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500"}`}>
            {t === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="card space-y-3">
        {tab === "signup" && (
          <label className="block space-y-1 text-sm">
            <span className="text-slate-600">Name (optional)</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />
          </label>
        )}
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Password</span>
          <input
            className="input"
            type="password"
            required
            minLength={tab === "signup" ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
          {tab === "signup" && <span className="text-xs text-slate-500">At least 8 characters.</span>}
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full py-2.5" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {tab === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

const RESEND_WAIT_SEC = 30;

/** Asks for the 6-digit code Neon Auth emailed; verifying it signs the user in. */
function VerifyEmail({ email, onVerified, onBack }: { email: string; onVerified: () => void; onBack: () => void }) {
  const account = useAccount();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [wait, setWait] = useState(RESEND_WAIT_SEC);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = await account.verifyEmail(email, code);
    setBusy(false);
    if (err) setError(err.message);
    else onVerified();
  };

  const resend = async () => {
    setError("");
    setNotice("");
    const err = await account.resendCode(email);
    if (err) return setError(err.message);
    setNotice("A new code is on its way.");
    setWait(RESEND_WAIT_SEC);
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 py-6">
      <div className="space-y-3 text-center">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-700">
          <MailCheck className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="text-sm text-slate-600">
          We sent a 6-digit code to <span className="font-medium text-slate-900">{email}</span>. Enter it below to verify your account. If it is not in your inbox, check the spam folder.
        </p>
      </div>
      <form onSubmit={submit} className="card space-y-3">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Verification code</span>
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && !error && <p className="text-sm text-emerald-700">{notice}</p>}
        <button className="btn-primary w-full py-2.5" disabled={busy || code.length !== 6}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Verify and continue
        </button>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button type="button" className="hover:text-slate-900" onClick={onBack}>
            Use a different email
          </button>
          <button type="button" className="font-medium text-brand-700 disabled:text-slate-400" disabled={wait > 0} onClick={resend}>
            {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
