"use client";

import { useCallback, useEffect, useState } from "react";
import { CONTACT_TOPICS, type ContactTopic } from "@/data/site";
import { useAccount } from "@/lib/account";

interface Message {
  id: string;
  name: string | null;
  email: string;
  topic: ContactTopic;
  message: string;
  status: "open" | "answered" | "closed";
  createdAt: number;
}

const STATUSES = ["open", "answered", "closed"] as const;

/** Contact-form inbox for the accounts listed in ADMIN_EMAILS. */
export default function AdminMessagesPage() {
  const account = useAccount();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<(typeof STATUSES)[number] | "all">("open");
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/admin/messages${filter === "all" ? "" : `?status=${filter}`}`, { cache: "no-store" });
    if (!res.ok) return setError((await res.json()).error ?? "Could not load messages.");
    setMessages((await res.json()).messages);
  }, [filter]);

  useEffect(() => {
    if (!account.ready || !account.user) return;
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAdmin(!!d.admin))
      .catch(() => setAdmin(false));
  }, [account.ready, account.user]);

  useEffect(() => {
    if (admin) loadMessages();
  }, [admin, loadMessages]);

  const setStatus = async (id: string, status: Message["status"]) => {
    const res = await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) setMessages((ms) => ms?.map((m) => (m.id === id ? { ...m, status } : m)) ?? null);
  };

  if (!account.ready) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!account.user || admin === false) return <div className="card text-sm">This page is for StudyClip admins. Log in with an admin account.</div>;
  if (admin === null) return <p className="text-sm text-slate-500">Checking…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contact messages</h1>
          <p className="mt-1 text-sm text-slate-600">Reply by email, then mark the message answered. Reference numbers are the first 8 characters of the id.</p>
        </div>
        <div className="flex gap-1">
          {(["open", "answered", "closed", "all"] as const).map((s) => (
            <button key={s} className={`chip ${filter === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!messages ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="card text-sm text-slate-600">No {filter === "all" ? "" : filter} messages.</div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="card space-y-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-slate-500">{m.id.slice(0, 8).toUpperCase()}</span> · <b>{m.name || "No name"}</b> ·{" "}
                  <a href={`mailto:${m.email}?subject=Re: StudyClip ${m.id.slice(0, 8).toUpperCase()}`} className="text-brand-700 hover:underline">
                    {m.email}
                  </a>{" "}
                  · <span className="chip bg-slate-100 text-slate-600">{CONTACT_TOPICS[m.topic] ?? m.topic}</span>
                </div>
                <span className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="whitespace-pre-wrap text-slate-800">{m.message}</p>
              <div className="flex gap-1">
                {STATUSES.map((s) => (
                  <button key={s} className={`chip ${m.status === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setStatus(m.id, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
