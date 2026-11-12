"use client";

import { Check, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { load, setExam, setLastViewedExam, type TopicStat } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

/** Shows the learner's accuracy on a topic from their saved practice history. */
export function TopicAccuracy({ topicId }: { topicId: string }) {
  const [stat, setStat] = useState<TopicStat | null>(null);
  useEffect(() => setStat(load().topics[topicId] ?? null), [topicId]);
  if (!stat) return <div className="text-xs text-slate-400">Not practised yet</div>;
  const p = Math.round((stat.correct / stat.attempted) * 100);
  return (
    <div className={`text-xs ${p >= 70 ? "text-emerald-600" : p >= 40 ? "text-amber-600" : "text-red-600"}`}>
      {p}% accuracy · {stat.attempted} attempted{p < 60 ? " · needs work" : ""}
    </div>
  );
}

/** Notes which exam page was viewed last. It never changes the student's chosen exam. */
export function RememberExam({ examId }: { examId: string }) {
  useEffect(() => setLastViewedExam(examId), [examId]);
  return null;
}

/** Lets the student choose this exam on purpose. Shows "Your exam" once it is the chosen one. */
export function MakeMyExamButton({ examId }: { examId: string }) {
  const store = useStore();
  if (!store) return null;
  if (store.examId === examId)
    return (
      <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10">
        <Check className="h-3.5 w-3.5" strokeWidth={3} /> Your exam
      </span>
    );
  return (
    <button type="button" className="btn-ghost" onClick={() => setExam(examId)}>
      <Target className="h-4 w-4" /> Make this my exam
    </button>
  );
}
