"use client";

import { useCallback, useEffect, useState } from "react";
import { loadPlan, loadStatuses, markRevised, PLAN_EVENT, savePlan, saveStatuses, syncPlan, type RevisionPlan, type StatusEntry, type TopicStatus } from "./revision-plan";
import type { StoreData } from "./useStore";

/**
 * The topic statuses for one exam and the revision plan, kept up to date with practice totals.
 * Re-renders when either changes (in this tab or another). Null until mounted.
 */
export function useRevision(store: StoreData | null, examId: string | undefined) {
  const [state, setState] = useState<{ plan: RevisionPlan; statuses: Record<string, StatusEntry> } | null>(null);

  useEffect(() => {
    const refresh = () => setState({ plan: loadPlan(), statuses: examId ? loadStatuses(examId) : {} });
    refresh();
    window.addEventListener(PLAN_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PLAN_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [examId]);

  // Fold new practice into the schedule whenever the totals change.
  useEffect(() => {
    if (!store || !state) return;
    const next = syncPlan(state.plan, store.topics, state.statuses);
    if (next !== state.plan) savePlan(next);
  }, [store, state]);

  const setStatus = useCallback(
    (topicId: string, s: TopicStatus) => {
      if (!examId) return;
      const all = loadStatuses(examId);
      all[topicId] = { s, at: Date.now() };
      saveStatuses(examId, all);
    },
    [examId],
  );

  /** Revised from notes without practising: push the topic one gap further, and mark it Revised. */
  const revised = useCallback(
    (topicId: string) => {
      savePlan(markRevised(loadPlan(), topicId, store?.topics[topicId]));
      if (examId) {
        const all = loadStatuses(examId);
        if (all[topicId]?.s !== "revised") {
          all[topicId] = { s: "revised", at: Date.now() };
          saveStatuses(examId, all);
        }
      }
    },
    [examId, store],
  );

  return state ? { ...state, setStatus, revised } : null;
}
