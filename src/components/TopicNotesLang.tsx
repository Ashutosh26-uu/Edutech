"use client";

import { LangToggle } from "@/components/Quiz";
import { TopicNotesContent } from "@/components/TopicNotesContent";
import { useLang } from "@/lib/lang";
import type { TopicNotes } from "@/lib/notes";

/**
 * Topic notes that follow the site's question language: Hindi when the student picks Hindi and the
 * notes have a Hindi version, English otherwise. The switch only shows when a Hindi version exists.
 * The first render is English, matching the server-rendered page.
 */
export function TopicNotesLang({ notes, headingLevel = 3 }: { notes: TopicNotes; headingLevel?: 2 | 3 }) {
  const [lang, setLang] = useLang();
  return <TopicNotesContent notes={notes} headingLevel={headingLevel} lang={lang} toggle={notes.hi ? <LangToggle lang={lang} setLang={setLang} /> : undefined} />;
}
