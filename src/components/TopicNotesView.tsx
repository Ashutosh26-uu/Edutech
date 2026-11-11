"use client";

import { useEffect, useState } from "react";
import { TopicNotesContent } from "@/components/TopicNotesContent";
import { NOTES_LOADERS } from "@/data/notes";
import type { TopicNotes } from "@/lib/notes";

/** Short revision notes for a topic, loaded only when the topic is opened. Nothing renders for a topic without notes. */
export function TopicNotesView({ topicId }: { topicId: string }) {
  const [notes, setNotes] = useState<TopicNotes | null>(null);
  useEffect(() => {
    let on = true;
    setNotes(null);
    NOTES_LOADERS[topicId]?.().then((m) => on && setNotes(m.default));
    return () => {
      on = false;
    };
  }, [topicId]);
  if (!notes) return null;
  return <TopicNotesContent notes={notes} />;
}
