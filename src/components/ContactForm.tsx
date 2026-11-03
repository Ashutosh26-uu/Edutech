"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CONTACT_TOPICS, type ContactTopic } from "@/data/site";
import { IS_STATIC } from "@/lib/api";
import { useAccount } from "@/lib/account";

/** The Contact-page form. Messages are stored on the server; the reply goes to the email given. */
export function ContactForm({ initialTopic }: { initialTopic?: ContactTopic }) {
  const account = useAccount();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic | "">(initialTopic ?? "");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  // Links such as /contact?topic=refund preselect the topic.
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("topic");
    if (t && t in CONTACT_TOPICS) setTopic((cur) => cur || (t as ContactTopic));
  }, []);

  // Signed-in users get their details filled in.
  useEffect(() => {
    if (account.user) {
      setEmail((e) => e || account.user!.email);
      setName((n) => n || account.user!.name || "");
    }
  }, [account.user]);

  if (IS_STATIC) {
    return <p className="card text-sm text-slate-600">The contact form works on the full version of StudyClip.</p>;
  }

  if (reference) {
    return (
      <div className="card flex gap-3" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-medium text-slate-900">Message sent. Thank you!</p>
          <p className="!mt-1 text-sm">
            Your reference is <span className="font-mono font-semibold text-slate-900">{reference}</span>. We will reply to {email} within 2 working days.
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, email, topic, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setReference(data.reference);
      else setError(data.error ?? "Could not send your message. Please try again.");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Name (optional)</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Email for our reply</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} autoComplete="email" />
        </label>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">What is it about?</span>
        <select className="input" required value={topic} onChange={(e) => setTopic(e.target.value as ContactTopic)}>
          <option value="" disabled>
            Choose one
          </option>
          {Object.entries(CONTACT_TOPICS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">Message</span>
        <textarea
          className="input min-h-32 resize-y"
          required
          minLength={10}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={topic === "payment" || topic === "refund" ? "Amount, date and Razorpay payment ID (starts with “pay_”)…" : "How can we help?"}
        />
      </label>
      {/* Honeypot: hidden from people, often filled in by bots. */}
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {error && <p className="!mt-0 text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full py-2.5 sm:w-auto sm:px-6" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </button>
    </form>
  );
}
