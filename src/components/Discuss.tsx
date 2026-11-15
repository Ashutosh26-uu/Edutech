"use client";

import { EyeOff, Flag, Loader2, MessageCircle, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@/lib/account";
import { IS_STATIC, postJson, request } from "@/lib/api";
import type { MCQ } from "@/lib/types";

interface Post {
  id: string;
  parentId: string | null;
  name: string;
  body: string;
  createdAt: number;
  mine: boolean;
  hidden?: boolean;
  reports?: number;
}
interface Thread extends Post {
  replies: Post[];
}
interface Data {
  canModerate: boolean;
  threads: Thread[];
}

const MAX = 1000;
const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(t).toLocaleDateString([], { day: "numeric", month: "short" });
};

/** Generated questions (Quant drills) have one-off ids, so they have no shared thread. */
const hasThread = (q: MCQ) => q.answer >= 0 && !/-g[0-9a-z]+$/.test(q.id);

/** "Discuss" under a question in the answer review: students' doubts and replies, with report / hide. */
export function Discuss({ question }: { question: MCQ }) {
  const [open, setOpen] = useState(false);
  if (IS_STATIC || !hasThread(question)) return null;
  return (
    <div className="mt-2">
      <button className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <MessageCircle className="h-3.5 w-3.5" /> {open ? "Hide discussion" : "Discuss this question"}
      </button>
      {open && <Board questionId={question.id} />}
    </div>
  );
}

function Board({ questionId }: { questionId: string }) {
  const account = useAccount();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      request(`/api/discuss?q=${encodeURIComponent(questionId)}`, { cache: "no-store" })
        .then(async (r) => {
          const d = await r.json().catch(() => ({}));
          if (r.ok) setData(d);
          else setError(d.error ?? "Could not load the discussion.");
        })
        .catch(() => setError("You seem to be offline.")),
    [questionId],
  );
  useEffect(() => {
    load();
  }, [load]);

  async function act(path: string, init: { method: string; body?: object }) {
    const res = await request(path, { method: init.method, headers: init.body ? { "Content-Type": "application/json" } : undefined, body: init.body ? JSON.stringify(init.body) : undefined }).catch(() => null);
    const d = res ? await res.json().catch(() => ({})) : {};
    if (!res?.ok) alert(d.error ?? "Something went wrong. Please try again.");
    load();
  }
  const report = (id: string) => confirm("Report this post as wrong, rude or spam?") && act("/api/discuss/report", { method: "POST", body: { id } });
  const remove = (id: string) => confirm("Delete this post?") && act(`/api/discuss?id=${id}`, { method: "DELETE" });
  const moderate = (id: string, hidden: boolean) => act("/api/discuss", { method: "PATCH", body: { id, hidden } });

  const PostView = ({ p, reply }: { p: Post; reply?: boolean }) => (
    <div className={`${reply ? "ml-4 border-l border-slate-200 pl-3" : ""} ${p.hidden ? "opacity-60" : ""}`}>
      <p className="text-xs text-slate-500">
        <b className="font-medium text-slate-700">{p.name}</b> · {ago(p.createdAt)}
        {p.hidden && <span className="ml-1 text-red-700">· hidden{p.reports ? ` (${p.reports} reports)` : ""}</span>}
      </p>
      <p className="mt-0.5 whitespace-pre-line break-words text-slate-800">{p.body}</p>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
        {p.mine ? (
          <button className="inline-flex items-center gap-1 hover:text-slate-900" onClick={() => remove(p.id)}>
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        ) : (
          account.user && (
            <button className="inline-flex items-center gap-1 hover:text-slate-900" onClick={() => report(p.id)}>
              <Flag className="h-3 w-3" /> Report
            </button>
          )
        )}
        {data?.canModerate && (
          <>
            <button className="inline-flex items-center gap-1 hover:text-slate-900" onClick={() => moderate(p.id, !p.hidden)}>
              {p.hidden ? <RotateCcw className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {p.hidden ? "Restore" : "Hide"}
            </button>
            {!p.mine && (
              <button className="inline-flex items-center gap-1 hover:text-slate-900" onClick={() => remove(p.id)}>
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-2 space-y-3 rounded-lg border border-slate-200 bg-surface p-3 text-sm">
      {error && <p className="text-red-700">{error}</p>}
      {!data && !error && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      {data && data.threads.length === 0 && <p className="text-slate-500">No doubts yet. Ask the first one, or explain it in your own words for others.</p>}
      {data?.threads.map((t) => (
        <div key={t.id} className="space-y-2">
          <PostView p={t} />
          {t.replies.map((rp) => (
            <PostView key={rp.id} p={rp} reply />
          ))}
          {account.user && !t.hidden && <Composer questionId={questionId} parentId={t.id} onDone={load} small />}
        </div>
      ))}
      {data &&
        (account.user ? (
          <Composer questionId={questionId} onDone={load} />
        ) : (
          <p className="text-xs text-slate-500">
            <Link href="/login" className="font-medium text-slate-900 underline">
              Log in
            </Link>{" "}
            to ask a doubt or reply.
          </p>
        ))}
      <p className="text-[11px] text-slate-400">Be kind and stay on the question. Posts that get reported are hidden until reviewed.</p>
    </div>
  );
}

function Composer({ questionId, parentId, onDone, small }: { questionId: string; parentId?: string; onDone: () => void; small?: boolean }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(!small);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!open)
    return (
      <button className="ml-4 text-xs font-medium text-slate-500 hover:text-slate-900" onClick={() => setOpen(true)}>
        Reply
      </button>
    );
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) return;
    setBusy(true);
    setError("");
    const { status, data } = await postJson("/api/discuss", { questionId, parentId: parentId ?? null, body: text });
    setBusy(false);
    if (status !== 201) return setError(data.error ?? "Could not post.");
    setText("");
    if (small) setOpen(false);
    onDone();
  }
  return (
    <form onSubmit={send} className={`space-y-2 ${small ? "ml-4" : ""}`}>
      <textarea
        className="input min-h-[64px] text-sm"
        value={text}
        maxLength={MAX}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? "Write a reply…" : "Ask a doubt about this question, or explain a shortcut…"}
        aria-label={parentId ? "Reply" : "Ask a doubt"}
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex items-center gap-2">
        <button className="btn-primary px-3 py-1.5 text-xs" disabled={busy || text.trim().length < 3}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : parentId ? "Reply" : "Post doubt"}
        </button>
        {small && (
          <button type="button" className="btn-quiet px-3 py-1.5 text-xs" onClick={() => setOpen(false)}>
            Cancel
          </button>
        )}
        <span className="ml-auto text-[11px] text-slate-400">
          {text.length}/{MAX}
        </span>
      </div>
    </form>
  );
}
