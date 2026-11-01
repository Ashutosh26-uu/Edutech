# StudyClip AI

Turn long YouTube lectures into short chapters, crisp notes and quizzes, and prepare for one-day exams (SSC, Banking, Railway, UPSC, CTET) in one place.

> **Status:** working prototype. All "AI" features currently run on a built-in, rule-based engine, so the app works with no API key. An LLM provider (e.g. Claude) can be plugged in later without changing the UI.

## Features

| Module | What it does |
|---|---|
| **Today** (`/today`) | Exam countdown, a daily plan that ticks itself off as you study (flashcards due, smart practice, one lecture, mock tests: every 2 days in the last month), focus topics, daily XP goal, streak, levels and an activity heatmap. |
| **Video breakdown** (`/video`) | Paste a YouTube link. The app reads the video's captions, detects where the topic changes and splits the lecture into timestamped chapters, each with a title, a summary and a **High / Medium / Low** importance tag. Clicking a chapter plays the video from that point in YouTube's official embedded player; nothing is downloaded or re-hosted. |
| **Smart play and live transcript** | ⚡ Smart play skips everything except High-importance chapters. Speed control from 1× to 2×. A searchable transcript follows the video and jumps on click. |
| **Notes and quiz** | One-line summary, keywords, key points and facts (each linked to its timestamp), your own timestamped notes, read-aloud, export to **Markdown** or **PDF**, and an auto-generated quiz you can save as flashcards. |
| **Flashcards** (`/review`) | Spaced repetition with the **FSRS** scheduler (the algorithm modern Anki offers). Add topic decks, video quiz cards or your own cards, then review with Space and keys 1–4. |
| **Exam prep** (`/exams`) | Pick an exam to see its syllabus, practise any topic with instant explanations, use **🧠 Smart practice** (adaptive and interleaved), or take a timed **mock test** with the exam's negative marking. |
| **Learn** (`/learn`) | Search any topic, by typing or by **voice (English or Hindi)**, for notes, practice questions and the exams it appears in, or ask a question to get its answer. |
| **My progress** (`/progress`) | Accuracy per topic, weak topics, mock-test history and recently studied videos. |
| **Everywhere** | **Ctrl + K** command palette (or press `/`), dark mode, and an installable app (PWA) with offline support for pages you've visited. |

### The learning science behind it

- **Spaced repetition (FSRS):** each card tracks stability and difficulty and is scheduled for when recall is predicted to drop to 90%. On the open spaced-repetition benchmark, FSRS predicts recall better than SM-2 for the large majority of users.
- **Retrieval practice with feedback:** every practice question and flashcard shows the answer and an explanation right away. Retrieval without feedback helps far less.
- **Interleaving:** Smart practice mixes topics instead of practising them in blocks, which meta-analyses link to better final-test performance (around g ≈ 0.4).
- **Targeting weak areas:** topic weights use a Beta(1,1) prior on accuracy, so a single answer doesn't swing the plan, plus a boost for topics you haven't practised in a while.

Videos without captions can still be analysed: paste the transcript from YouTube's **Show transcript** panel.

## Exams covered

91 Indian government and competitive exams in 13 categories: SSC, banking, insurance, railways, UPSC, defence, 22 state PSCs, police, teaching (CTET, UGC NET, state TETs, KVS, DSSSB), engineering and medical entrance (JEE, NEET, GATE), law and management (CLAT, CAT), CUET and other central exams. Each exam lists its conducting body, syllabus areas, negative marking (only where it is fixed; otherwise the page points to the official notification) and official website. Subjects linked to the question bank have topic practice, smart practice and mock tests.

## Live site (GitHub Pages)

Every push to `main` builds a static version and publishes it to GitHub Pages via `.github/workflows/deploy-pages.yml`: **https://ashutosh26-uu.github.io/Edutech/**

GitHub Pages has no server, so the static build (`NEXT_PUBLIC_STATIC=1`) runs the API logic in the browser (`src/lib/api.ts` → `src/lib/handlers.ts`). Everything works the same except automatic YouTube caption fetching, which browsers can't do directly; on the live site, paste the video's transcript instead. For the full version, run it locally or deploy it to a Node host such as Vercel.

## Running locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How it works

```
YouTube link
  → captions fetched with timestamps          src/lib/youtube.ts
  → transcript split into ~15–60 s blocks
  → topic boundaries found (TextTiling)       src/lib/nlp.ts
  → titles, summaries, importance, notes, quiz src/lib/ai/local-video.ts
  → cached in memory, shown with the embedded player
```

- **Topic detection:** each block becomes a word-frequency vector. Where the similarity between neighbouring windows dips sharply, a new chapter starts.
- **Titles and keywords:** recurring words and two-word phrases are ranked with TF-IDF.
- **Importance:** chapters are ranked by keyword density and lecturer cues ("important", "remember", "exam", definitions, dates).
- **Quizzes:** key sentences become fill-in-the-blank questions; the other options are other keywords from the same video.
- **Exam questions:** a sample question bank (`src/data/topics.ts`) plus generators that create unlimited Quant questions with computed answers (`src/lib/generators.ts`).

## Project structure

```
src/
  app/                 pages (Next.js App Router) and API routes
    api/video          POST { url, transcript? } → chapters, notes, quiz
    api/practice       POST { topicIds, count }  → MCQs
    api/topic          POST { query }            → notes, exams, questions
    api/solve          POST { question }         → answer and related topics
  components/          Quiz, YouTube player, navigation
  data/                exams, syllabus topics, notes and question bank
  lib/ai/              AI provider interface and the local (rule-based) provider
  lib/                 YouTube captions, text analysis, generators, browser storage
```

## Adding an AI model later

All AI work goes through the `AIProvider` interface in `src/lib/ai/provider.ts`:

1. Create `src/lib/ai/claude.ts` that implements `AIProvider` (video breakdown, practice questions, topic notes, question solving).
2. Return it from `getProvider()` in `src/lib/ai/index.ts`, for example when `AI_PROVIDER=claude`.
3. Put the API key in `.env.local` (already git-ignored).

The pages and API routes don't need to change.

## Known limitations

- Rule-based chapters and quizzes are useful but rougher than an LLM's output; titles are keyword-based.
- The question bank is a small sample of practice questions written in exam style. They are not official previous-year questions.
- Progress is saved in the browser (localStorage), not in an account.
- The video cache is in memory and resets when the server restarts.
- Transcript fetching depends on YouTube's public caption endpoints, which can change.
