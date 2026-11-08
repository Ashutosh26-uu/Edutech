"use client";

import { Check, Copy, Share2, Swords } from "lucide-react";
import { useEffect, useState } from "react";
import type { AnswerResult } from "@/components/Quiz";

/**
 * Challenge a friend: a link that carries the question ids of a finished practice set and the
 * sender's score. The friend gets the very same questions (options reshuffled) and, at the end,
 * sees both scores. Everything is in the link, so it works without accounts or a server.
 */

const NAME_KEY = "studyclip:challenge-name";
/** Generated Quant questions have one-off ids and can't be replayed, so they are left out of a challenge. */
const replayable = (id: string) => !/-g[0-9a-z]+$/.test(id);

export interface ChallengeParams {
  ids: string[];
  by: string;
  score: number;
}

/** Reads a challenge from the practice URL, or null when there is none. */
export function readChallenge(params: URLSearchParams): ChallengeParams | null {
  const raw = params.get("challenge");
  if (!raw) return null;
  const ids = raw.split(",").filter((id) => /^[a-z0-9-]{3,80}$/.test(id) && replayable(id)).slice(0, 25);
  if (!ids.length) return null;
  const score = Number(params.get("s"));
  return { ids, by: (params.get("by") ?? "").slice(0, 30) || "Your friend", score: Number.isFinite(score) ? Math.max(0, Math.min(ids.length, Math.round(score))) : 0 };
}

export function ChallengeBox({ results, challenge }: { results: AnswerResult[]; challenge: ChallengeParams | null }) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {
      /* storage blocked */
    }
  }, []);

  const playable = results.filter((r) => replayable(r.question.id));
  if (playable.length < 5) return null;
  const mine = playable.filter((r) => r.correct).length;

  const link = () => {
    const u = new URL("/practice", location.origin);
    u.searchParams.set("challenge", playable.map((r) => r.question.id).join(","));
    u.searchParams.set("s", String(mine));
    if (name.trim()) u.searchParams.set("by", name.trim().slice(0, 30));
    return u.toString();
  };
  const message = () => `I scored ${mine}/${playable.length} on this StudyClip practice set. Can you beat me? ${link()}`;
  const remember = () => {
    try {
      localStorage.setItem(NAME_KEY, name.trim());
    } catch {
      /* storage blocked */
    }
  };
  const share = async () => {
    remember();
    if (navigator.share) {
      await navigator.share({ title: "StudyClip challenge", text: message() }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message())}`, "_blank", "noopener");
    }
  };
  const copy = async () => {
    remember();
    await navigator.clipboard.writeText(link()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card space-y-3">
      {challenge && (
        <div className="rounded-xl bg-violet-50 p-4 text-violet-900">
          <div className="flex items-center gap-2 font-semibold">
            <Swords className="h-4 w-4" /> Challenge result
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-surface p-2">
              <div className="text-xs text-slate-500">You</div>
              <div className="text-2xl font-semibold text-slate-900 tabular-nums">
                {mine}/{playable.length}
              </div>
            </div>
            <div className="rounded-lg bg-surface p-2">
              <div className="truncate text-xs text-slate-500">{challenge.by}</div>
              <div className="text-2xl font-semibold text-slate-900 tabular-nums">
                {challenge.score}/{challenge.ids.length}
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm">{mine > challenge.score ? `You beat ${challenge.by}! 🎉` : mine === challenge.score ? "It’s a tie." : `${challenge.by} wins this one. Try another set and challenge them back.`}</p>
        </div>
      )}
      <div className="flex items-center gap-2 font-semibold text-slate-900">
        <Swords className="h-4 w-4 text-brand-600" /> {challenge ? "Challenge someone else" : "Challenge a friend"}
      </div>
      <p className="text-sm text-slate-600">
        Send this exact set to a friend. They get the same {playable.length} questions and see your score ({mine}/{playable.length}) when they finish.
      </p>
      <div className="flex flex-wrap gap-2">
        <input className="input max-w-48 flex-1" placeholder="Your name (optional)" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name for the challenge" />
        <button className="btn-primary" onClick={share}>
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button className="btn-ghost" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
