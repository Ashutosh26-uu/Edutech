import { sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
  },
  (t) => [check("credits_non_negative", sql`${t.credits} >= 0`)],
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
    kind: text("kind", { enum: ["full", "topic", "section"] }).notNull(),
    topicIds: text("topic_ids").array().notNull(),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    /** Paper sections of a full mock on an exam pattern; null for the generic mock and topic tests. */
    sections: jsonb("sections").$type<AttemptSection[]>(),
    /** Whether each section is locked to its own timer. */
    sectional: boolean("sectional").notNull().default(false),
    paidWith: text("paid_with", { enum: ["free", "credit"] }).notNull(),
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
  (t) => [index("attempts_user_idx").on(t.userId, t.startedAt)],
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
