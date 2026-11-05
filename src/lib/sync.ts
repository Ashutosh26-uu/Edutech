import type { Flashcard } from "./storage";
import type { MCQ } from "./types";

/**
 * Flashcards and saved questions follow the account: the browser keeps its copy, and when signed
 * in the two copies are merged item by item. The newer version of an item wins, and a deletion
 * wins over any version older than it, so reviewing on the phone and deleting on the laptop both
 * survive the next sync. The same merge runs in the browser and on the server.
 */

/** A question the learner saved to come back to. The whole question is kept, so generated ones can be replayed too. */
export interface Bookmark {
  id: string;
  question: MCQ;
  savedAt: number;
}

export interface SyncDoc {
  cards: Record<string, Flashcard>;
  bookmarks: Record<string, Bookmark>;
  /** Deletions: "card:<id>" or "bm:<id>" → when it was deleted (epoch ms). */
  deleted: Record<string, number>;
}

export const EMPTY_SYNC: SyncDoc = { cards: {}, bookmarks: {}, deleted: {} };

/** Deletions older than this are forgotten; a device offline for longer may bring the item back. */
const TOMBSTONE_TTL = 180 * 86_400_000;
export const MAX_CARDS = 5000;
export const MAX_BOOKMARKS = 1000;

const cardVersion = (c: Flashcard) => Math.max(c.created ?? 0, c.lastReview ?? 0);
const bookmarkVersion = (b: Bookmark) => b.savedAt;

function mergeMap<T>(a: Record<string, T>, b: Record<string, T>, version: (x: T) => number, deleted: Record<string, number>, prefix: string): Record<string, T> {
  const out: Record<string, T> = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id];
    const y = b[id];
    const best = !x ? y : !y ? x : version(y) > version(x) ? y : x;
    if ((deleted[prefix + id] ?? -1) >= version(best)) continue;
    out[id] = best;
  }
  return out;
}

/** Keeps the newest items when a map is over its cap. */
function cap<T>(m: Record<string, T>, max: number, version: (x: T) => number): Record<string, T> {
  const entries = Object.entries(m);
  if (entries.length <= max) return m;
  return Object.fromEntries(entries.sort((p, q) => version(q[1]) - version(p[1])).slice(0, max));
}

export function mergeSync(a: SyncDoc, b: SyncDoc, now = Date.now()): SyncDoc {
  const deleted: Record<string, number> = {};
  for (const [k, t] of [...Object.entries(a.deleted ?? {}), ...Object.entries(b.deleted ?? {})]) {
    if (now - t < TOMBSTONE_TTL) deleted[k] = Math.max(deleted[k] ?? 0, t);
  }
  return {
    cards: cap(mergeMap(a.cards ?? {}, b.cards ?? {}, cardVersion, deleted, "card:"), MAX_CARDS, cardVersion),
    bookmarks: cap(mergeMap(a.bookmarks ?? {}, b.bookmarks ?? {}, bookmarkVersion, deleted, "bm:"), MAX_BOOKMARKS, bookmarkVersion),
    deleted,
  };
}

/** A cheap fingerprint to tell whether anything changed since the last sync. */
export function syncFingerprint(d: SyncDoc): string {
  let h = 0;
  const s = JSON.stringify([
    Object.entries(d.cards).map(([k, c]) => [k, cardVersion(c)]),
    Object.entries(d.bookmarks).map(([k, b]) => [k, b.savedAt]),
    d.deleted,
  ]);
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `${s.length}:${h}`;
}
