CREATE TABLE "question_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"question_id" text NOT NULL,
	"topic_id" text,
	"reason" text NOT NULL,
	"note" text,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_stats" (
	"question_id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"answered" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"pick0" integer DEFAULT 0 NOT NULL,
	"pick1" integer DEFAULT 0 NOT NULL,
	"pick2" integer DEFAULT 0 NOT NULL,
	"pick3" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "question_reports" ADD CONSTRAINT "question_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "question_reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reports_question_idx" ON "question_reports" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "attempts_rank_idx" ON "test_attempts" USING btree ("exam_id","kind","submitted_at");