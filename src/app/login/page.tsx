"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { useAccount } from "@/lib/account";

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

  useEffect(() => {
    if (account.user) router.replace(next);
  }, [account.user, next, router]);

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
    const err = tab === "login" ? await account.login(email, password) : await account.signup(email, password, name || undefined);
    setBusy(false);
    if (err) setError(err);
    else router.replace(next);
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 py-6">
      <div className="space-y-3 text-center">
        <LogoMark className="mx-auto h-10 w-10" />
        <h1 className="text-2xl font-semibold">{tab === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-slate-600">{tab === "login" ? "Log in to use your tests and revision packs." : "Free to join. Get one free timed test for every exam."}</p>
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
