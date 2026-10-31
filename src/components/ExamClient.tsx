"use client";

import { useEffect, useState } from "react";
import { load, setExam, type TopicStat } from "@/lib/storage";

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

export function RememberExam({ examId }: { examId: string }) {
  useEffect(() => setExam(examId), [examId]);
  return null;
}
