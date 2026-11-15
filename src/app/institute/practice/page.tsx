"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Quiz, type AnswerResult } from "@/components/Quiz";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { instApi, instituteHref } from "@/lib/institutes";
import { recordAnswers } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

interface SetData {
  institute: { slug: string; name: string; verified: boolean };
  set: { id: string; title: string; description: string | null; questions: MCQ[] };
}

export default function InstitutePracticePage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={0} />}>
      <Practice />
    </Suspense>
  );
}

function Practice() {
  const id = useSearchParams().get("set") ?? "";
  const account = useAccount();
  const [d, setD] = useState<SetData | null>(null);
  const [error, setError] = useState<{ text: string; status: number } | null>(null);
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (IS_STATIC || !account.ready) return;
    instApi<SetData>(`/set?id=${encodeURIComponent(id)}`).then((r) => (r.data ? setD(r.data) : setError({ text: r.error ?? "", status: r.status })));
  }, [id, account.ready, account.user]);

  if (IS_STATIC) return <StaticNotice>Institute sets are on the full site.</StaticNotice>;
  if (error)
    return (
      <div className="card max-w-xl space-y-3 text-sm">
        <p className="text-slate-700">{error.text}</p>
        {error.status === 401 && (
          <Link href={`/login?next=${encodeURIComponent(`/institute/practice?set=${id}`)}`} className="btn-primary">
            Log in
          </Link>
        )}
        <Link href="/institutes" className="block font-medium text-brand-700 hover:underline">
          See all institutes
        </Link>
      </div>
    );
  if (!d) return <PageSkeleton tiles={0} />;

  return (
    <div className="space-y-5">
      <Link href={instituteHref(d.institute.slug)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> {d.institute.name}
      </Link>
      <header className="space-y-1">
        <VerifiedBadge verified={d.institute.verified} />
        <h1 className="text-2xl font-semibold">{d.set.title}</h1>
        {d.set.description && <p className="text-slate-600">{d.set.description}</p>}
      </header>
      <div className="card">
        <Quiz
          key={round}
          questions={d.set.questions}
          mode="practice"
          onRestart={() => setRound((r) => r + 1)}
          restartLabel="Practise this set again"
          share={{ title: `${d.set.title} · ${d.institute.name}` }}
          onFinish={(results: AnswerResult[]) => recordAnswers(results.filter((r) => r.chosen !== null).map((r) => ({ correct: r.correct })))}
        />
      </div>
    </div>
  );
}
