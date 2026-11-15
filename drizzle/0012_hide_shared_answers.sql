ALTER TABLE "batch_tests" ADD COLUMN "answers_at" timestamp with time zone;--> statement-breakpoint
-- Existing tests: answers open after the due time, or straight away when there is none (as before).
UPDATE "batch_tests" SET "answers_at" = COALESCE("due_at" + interval '2 minutes', "created_at");
