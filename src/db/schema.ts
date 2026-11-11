import { sql } from "drizzle-orm";
import { boolean, check, date, index, integer, jsonb, pgTable, primaryKey, real, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { MCQ } from "@/lib/types";

/** A section of a full mock: questions [from, from + count) of the attempt, with its own minutes. */
export interface AttemptSection {
  name: string;
  from: number;
  count: number;
  minutes: number;
}

export const users = pgTable(
  "users",
  {
    // Same id as the Neon Auth user (neon_auth.user.id), which owns the password and sessions.
    id: uuid("id").primaryKey(),
    email: text("email").notNull().unique(), // stored lower-cased
    name: text("name"),
    credits: integer("credits").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    /** Invite code for the share link (/login?tab=signup&ref=CODE), created the first time it is needed. */
    referralCode: text("referral_code").unique(),
    /** Public name on the weekly leaderboards. Never the email. */
    displayName: text("display_name"),
    /** Opt-in: show this user on the leaderboards (needs a display name too). */
    leaderboard: boolean("leaderboard").notNull().default(false),
  },
  (t) => [check("credits_non_negative", sql`${t.credits} >= 0`), uniqueIndex("users_display_name_idx").on(sql`lower(${t.displayName})`)],
);

/**
 * Who invited whom. One row per new user (the primary key), so an account can only ever be
 * invited once. `rewardedAt` is set, exactly once, when the new user verifies their email and
 * submits their first timed test; `inviterCredited` records whether the inviter was still under
 * the cap and got their credit too.
 */
export const referrals = pgTable(
  "referrals",
  {
    newUserId: uuid("new_user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    rewardedAt: timestamp("rewarded_at", { withTimezone: true }),
    inviterCredited: boolean("inviter_credited").notNull().default(false),
  },
  (t) => [index("referrals_inviter_idx").on(t.inviterId, t.rewardedAt)],
);

/** One free timed test per user per exam. The primary key makes claiming it race-free. */
export const freeTests = pgTable(
  "free_tests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    examId: text("exam_id").notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.examId] })],
);

export const revisionPasses = pgTable(
  "revision_passes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    examId: text("exam_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.examId] })],
);

/** Unique order and payment ids make granting access idempotent across verify calls and webhooks. */
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderId: text("order_id").notNull().unique(),
    paymentId: text("payment_id").unique(),
    productId: text("product_id").notNull(),
    examId: text("exam_id"),
    amountPaise: integer("amount_paise").notNull(),
    status: text("status", { enum: ["created", "paid", "failed"] }).notNull().default("created"),
    mode: text("mode", { enum: ["live", "demo"] }).notNull().default("live"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [index("payments_user_idx").on(t.userId, t.createdAt)],
);

/** A timed test. Questions (with answers) stay on the server until the test is submitted. */
export const testAttempts = pgTable(
  "test_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    examId: text("exam_id").notNull(),
    // "weekly" is the Sunday All-India Mock (lib/weekly.ts): one shared paper, free, one attempt per week.
    kind: text("kind", { enum: ["full", "topic", "section", "weekly"] }).notNull(),
    topicIds: text("topic_ids").array().notNull(),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    /** Paper sections of a full mock on an exam pattern; null for the generic mock and topic tests. */
    sections: jsonb("sections").$type<AttemptSection[]>(),
    /** Whether each section is locked to its own timer. */
    sectional: boolean("sectional").notNull().default(false),
    paidWith: text("paid_with", { enum: ["free", "credit", "weekly"] }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    answers: jsonb("answers").$type<(number | null)[]>(),
    /** Seconds spent on each question, as reported by the browser. */
    times: jsonb("times").$type<number[]>(),
    correct: integer("correct"),
    wrong: integer("wrong"),
    skipped: integer("skipped"),
    score: real("score"),
  },
  // attempts_rank_idx: ranking a submitted test against everyone else's on the same exam and kind.
  // attempts_week_idx: the weekly leaderboard, every submitted test on an exam within a week.
  (t) => [index("attempts_user_idx").on(t.userId, t.startedAt), index("attempts_rank_idx").on(t.examId, t.kind, t.submittedAt), index("attempts_week_idx").on(t.examId, t.submittedAt)],
);

/**
 * Messages sent from the Contact page: support, refunds, privacy requests and grievances.
 * Read and answer them from the Neon console (SQL editor) until there is an admin screen.
 */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name"),
    email: text("email").notNull(),
    topic: text("topic", { enum: ["account", "payment", "refund", "question", "privacy", "grievance", "other"] }).notNull(),
    message: text("message").notNull(),
    status: text("status", { enum: ["open", "answered", "closed"] }).notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("contact_status_idx").on(t.status, t.createdAt)],
);

export const topicStats = pgTable(
  "topic_stats",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id").notNull(),
    attempted: integer("attempted").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    lastPracticed: timestamp("last_practiced", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.topicId] })],
);

/**
 * The mistake notebook: every bank question a user has got wrong, until they get it right again
 * in a mistakes set. Generated Quant questions are not kept, since they cannot be replayed.
 */
export const mistakes = pgTable(
  "mistakes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    topicId: text("topic_id").notNull(),
    timesWrong: integer("times_wrong").notNull().default(1),
    lastWrongAt: timestamp("last_wrong_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] }), index("mistakes_user_idx").on(t.userId, t.resolvedAt)],
);

/**
 * Per-user documents synced from the browser, one row per key. "sync" holds the flashcard deck,
 * saved questions and deletions (see lib/sync.ts), merged on every write.
 */
export const userData = pgTable(
  "user_data",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

/**
 * Problems users report on a question (wrong key, typo, unclear explanation). Reviewed on
 * /admin/reports; resolving or dismissing a report keeps it for the record.
 */
export const questionReports = pgTable(
  "question_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    questionId: text("question_id").notNull(),
    topicId: text("topic_id"),
    reason: text("reason", { enum: ["wrong-answer", "wrong-question", "wrong-explanation", "duplicate", "other"] }).notNull(),
    note: text("note"),
    status: text("status", { enum: ["open", "resolved", "dismissed"] }).notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reports_status_idx").on(t.status, t.createdAt), index("reports_question_idx").on(t.questionId)],
);

/**
 * How often each bank question is answered and which option people pick, in the question's
 * original option order. When most people pick an option other than the key, the key may be
 * wrong; /admin/reports lists those questions.
 */
export const questionStats = pgTable("question_stats", {
  questionId: text("question_id").primaryKey(),
  topicId: text("topic_id").notNull(),
  answered: integer("answered").notNull().default(0),
  correct: integer("correct").notNull().default(0),
  pick0: integer("pick0").notNull().default(0),
  pick1: integer("pick1").notNull().default(0),
  pick2: integer("pick2").notNull().default(0),
  pick3: integer("pick3").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Privacy-friendly visitor stats: one counter per day (Asia/Kolkata), event and path. No IPs,
 * user ids or cookies are stored. Written by POST /api/event, read on /admin/stats.
 */
export const eventCounts = pgTable(
  "event_counts",
  {
    day: date("day").notNull(),
    name: text("name").notNull(),
    path: text("path").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.name, t.path] })],
);
