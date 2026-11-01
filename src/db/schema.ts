import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { MCQ } from "@/lib/types";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(), // stored lower-cased
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    credits: integer("credits").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("credits_non_negative", sql`${t.credits} >= 0`)],
);

/** Only a SHA-256 hash of the session token is stored, so a database leak can't be replayed as logins. */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId), index("sessions_expires_idx").on(t.expiresAt)],
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
    kind: text("kind", { enum: ["full", "topic"] }).notNull(),
    topicIds: text("topic_ids").array().notNull(),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    paidWith: text("paid_with", { enum: ["free", "credit"] }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    answers: jsonb("answers").$type<(number | null)[]>(),
    correct: integer("correct"),
    wrong: integer("wrong"),
    skipped: integer("skipped"),
    score: real("score"),
  },
  (t) => [index("attempts_user_idx").on(t.userId, t.startedAt)],
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
