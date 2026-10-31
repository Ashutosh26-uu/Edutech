# StudyClip AI

Turn long YouTube lectures into short chapters, crisp notes and quizzes, and prepare for one-day exams (SSC, Banking, Railway, UPSC, CTET) in one place.

> **Status:** working prototype. All "AI" features currently run on a built-in, rule-based engine, so the app works with no API key. An LLM provider (e.g. Claude) can be plugged in later without changing the UI.

## Features

| Module | What it does |
|---|---|
| **Video breakdown** (`/video`) | Paste a YouTube link. The app reads the video's captions, detects where the topic changes and splits the lecture into timestamped chapters, each with a title, a summary and a **High / Medium / Low** importance tag. Clicking a chapter plays the video from that point in YouTube's official embedded player; nothing is downloaded or re-hosted. |
| **Notes and quiz** | A one-line summary, keywords, key points and important facts (each linked to its timestamp), plus an auto-generated fill-in-the-blank quiz. |
| **Exam prep** (`/exams`) | Pick an exam to see its syllabus by subject and topic, practise any topic with instant explanations, or take a timed **mock test** with the exam's negative marking and a topic-wise score breakdown. |
| **Learn** (`/learn`) | Search any topic for notes, practice questions and the exams it appears in, or paste a question to get its answer and related concepts. |
| **My progress** (`/progress`) | Accuracy per topic, weak topics to focus on, mock-test history and recently studied videos. |

Videos without captions can still be analysed: paste the transcript from YouTube's **Show transcript** panel.

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
