CREATE TABLE "batch_trainers" (
	"batch_id" uuid NOT NULL,
	"email" text NOT NULL,
	"added_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "batch_trainers_batch_id_email_pk" PRIMARY KEY("batch_id","email")
);
--> statement-breakpoint
CREATE TABLE "content_editors" (
	"email" text PRIMARY KEY NOT NULL,
	"organisation" text,
	"granted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" date NOT NULL,
	"title" text NOT NULL,
	"questions" jsonb NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_quizzes_day_unique" UNIQUE("day")
);
--> statement-breakpoint
CREATE TABLE "exam_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" text,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"day" date NOT NULL,
	"end_day" date,
	"link" text,
	"note" text,
	"created_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "batch_trainers" ADD CONSTRAINT "batch_trainers_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_trainers" ADD CONSTRAINT "batch_trainers_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_editors" ADD CONSTRAINT "content_editors_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_quizzes" ADD CONSTRAINT "daily_quizzes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_events" ADD CONSTRAINT "exam_events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_trainers_email_idx" ON "batch_trainers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "daily_quizzes_published_idx" ON "daily_quizzes" USING btree ("published","day");--> statement-breakpoint
CREATE INDEX "exam_events_day_idx" ON "exam_events" USING btree ("day");--> statement-breakpoint
CREATE INDEX "exam_events_exam_idx" ON "exam_events" USING btree ("exam_id","day");