import { sql } from "drizzle-orm";
import { boolean, check, date, index, integer, jsonb, pgTable, primaryKey, real, smallint, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
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

/**
 * Unique order and payment ids make granting access idempotent across verify calls and webhooks.
 * Deleting an account keeps its payments (needed for refunds, reconciliation and tax) with the
 * user cleared.
 */
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
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
    // "batch" is a test a trainer assigned to a batch (batches.ts): one fixed paper per assignment.
    kind: text("kind", { enum: ["full", "topic", "section", "weekly", "batch"] }).notNull(),
    topicIds: text("topic_ids").array().notNull(),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    /** Paper sections of a full mock on an exam pattern; null for the generic mock and topic tests. */
    sections: jsonb("sections").$type<AttemptSection[]>(),
    /** Whether each section is locked to its own timer. */
    sectional: boolean("sectional").notNull().default(false),
    paidWith: text("paid_with", { enum: ["free", "credit", "weekly", "batch"] }).notNull(),
    /** The trainer's assignment this attempt answers, for kind "batch". */
    batchTestId: uuid("batch_test_id").references(() => batchTests.id, { onDelete: "set null" }),
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
  // attempts_batch_test_idx: one attempt per student per assignment, and the trainer's results query.
  (t) => [
    index("attempts_user_idx").on(t.userId, t.startedAt),
    index("attempts_rank_idx").on(t.examId, t.kind, t.submittedAt),
    index("attempts_week_idx").on(t.examId, t.submittedAt),
    uniqueIndex("attempts_batch_test_idx").on(t.batchTestId, t.userId).where(sql`${t.batchTestId} is not null`),
  ],
);

/**
 * Trainer mode: a trainer (a placement officer or teacher) runs a batch of students. Students
 * join with the batch's code; the trainer assigns fixed papers and sees every member's result.
 */
export const batches = pgTable(
  "batches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trainerId: uuid("trainer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    institution: text("institution"),
    /** Short code students type (or open as a link) to join. */
    joinCode: text("join_code").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("batches_trainer_idx").on(t.trainerId, t.createdAt)],
);

export const batchMembers = pgTable(
  "batch_members",
  {
    batchId: uuid("batch_id")
      .notNull()
      .references(() => batches.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.batchId, t.userId] }), index("batch_members_user_idx").on(t.userId)],
);

/** A paper a trainer assigned: the same questions for every member (each gets their own option order). */
export const batchTests = pgTable(
  "batch_tests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    batchId: uuid("batch_id")
      .notNull()
      .references(() => batches.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    /** The exam track the paper was built from (its marking applies), or "custom" for chosen topics. */
    examId: text("exam_id").notNull(),
    topicIds: text("topic_ids").array().notNull(),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    minutes: integer("minutes").notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }),
    /** When takers may see correct answers and explanations; null = held until the trainer releases them. */
    answersAt: timestamp("answers_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("batch_tests_batch_idx").on(t.batchId, t.createdAt)],
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

/**
 * Web Push subscriptions for the opt-in daily reminder. One row per browser (endpoint), signed in
 * or not. `hour_ist` is the India hour to send at; `last_sent_on` (India date) stops a second send
 * the same day. Written by /api/push/subscribe, read by /api/push/send (hourly Netlify schedule).
 */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    examId: text("exam_id"),
    hourIst: smallint("hour_ist").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSentOn: date("last_sent_on"),
    failures: integer("failures").notNull().default(0),
  },
  (t) => [index("push_hour_idx").on(t.hourIst, t.lastSentOn)],
);

/**
 * Co-trainers: the batch owner gives other people (by email) the same access to a batch, so a
 * university can let its whole placement team assign tests and read results. The email may not
 * have an account yet; access applies once someone logs in with it.
 */
export const batchTrainers = pgTable(
  "batch_trainers",
  {
    batchId: uuid("batch_id")
      .notNull()
      .references(() => batches.id, { onDelete: "cascade" }),
    email: text("email").notNull(), // lower-cased
    addedBy: uuid("added_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.batchId, t.email] }), index("batch_trainers_email_idx").on(t.email)],
);

/**
 * People who may publish site content (the daily current-affairs quiz and the exam calendar),
 * granted by an admin (ADMIN_EMAILS) by email, so access can be given before the account exists.
 */
export const contentEditors = pgTable("content_editors", {
  email: text("email").primaryKey(), // lower-cased
  /** Shown next to what they publish, e.g. a university or coaching name. */
  organisation: text("organisation"),
  grantedBy: uuid("granted_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One current-affairs quiz per day (India date). Drafts stay hidden until published. */
export const dailyQuizzes = pgTable(
  "daily_quizzes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    day: date("day").notNull().unique(),
    title: text("title").notNull(),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    published: boolean("published").notNull().default(false),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("daily_quizzes_published_idx").on(t.published, t.day)],
);

/** Exam calendar: application windows, admit cards, exam days and results, with the official link. */
export const examEvents = pgTable(
  "exam_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** An exam from data/exams.ts, or null for an event that belongs to no listed exam. */
    examId: text("exam_id"),
    kind: text("kind", { enum: ["notification", "apply-start", "apply-end", "admit-card", "exam", "result", "other"] }).notNull(),
    title: text("title").notNull(),
    day: date("day").notNull(),
    /** Optional last day of a range (an exam held over several days). */
    endDay: date("end_day"),
    link: text("link"),
    note: text("note"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("exam_events_day_idx").on(t.day), index("exam_events_exam_idx").on(t.examId, t.day)],
);

/**
 * Institution pages: a college, university or coaching centre publishes its own question sets.
 * Anyone logged in can create one; it is live at once but marked unverified until a site admin
 * verifies it (or removes it). Public sets are open to everyone; members-only sets need the
 * institution's join code.
 */
export const institutions = pgTable(
  "institutions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    city: text("city"),
    about: text("about"),
    website: text("website"),
    joinCode: text("join_code").notNull().unique(),
    verified: boolean("verified").notNull().default(false),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("institutions_verified_idx").on(t.verified, t.name)],
);

/** Who runs an institution page: the owner (who created it) and staff the owner adds by email. */
export const institutionStaff = pgTable(
  "institution_staff",
  {
    institutionId: uuid("institution_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    email: text("email").notNull(), // lower-cased
    role: text("role", { enum: ["owner", "staff"] }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.institutionId, t.email] }), index("institution_staff_email_idx").on(t.email)],
);

/** Students who joined an institution with its code, for members-only sets. */
export const institutionMembers = pgTable(
  "institution_members",
  {
    institutionId: uuid("institution_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.institutionId, t.userId] }), index("institution_members_user_idx").on(t.userId)],
);

/** A question set an institution published. */
export const institutionSets = pgTable(
  "institution_sets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    institutionId: uuid("institution_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    visibility: text("visibility", { enum: ["public", "members"] }).notNull().default("public"),
    published: boolean("published").notNull().default(true),
    questions: jsonb("questions").$type<MCQ[]>().notNull(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("institution_sets_inst_idx").on(t.institutionId, t.updatedAt)],
);
