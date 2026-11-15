CREATE TABLE "batch_members" (
	"batch_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "batch_members_batch_id_user_id_pk" PRIMARY KEY("batch_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "batch_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"title" text NOT NULL,
	"exam_id" text NOT NULL,
	"topic_ids" text[] NOT NULL,
	"questions" jsonb NOT NULL,
	"minutes" integer NOT NULL,
	"due_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trainer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"institution" text,
	"join_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "batches_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
ALTER TABLE "test_attempts" ADD COLUMN "batch_test_id" uuid;--> statement-breakpoint
ALTER TABLE "batch_members" ADD CONSTRAINT "batch_members_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_members" ADD CONSTRAINT "batch_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_tests" ADD CONSTRAINT "batch_tests_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_members_user_idx" ON "batch_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "batch_tests_batch_idx" ON "batch_tests" USING btree ("batch_id","created_at");--> statement-breakpoint
CREATE INDEX "batches_trainer_idx" ON "batches" USING btree ("trainer_id","created_at");--> statement-breakpoint
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_batch_test_id_batch_tests_id_fk" FOREIGN KEY ("batch_test_id") REFERENCES "public"."batch_tests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attempts_batch_test_idx" ON "test_attempts" USING btree ("batch_test_id","user_id") WHERE "test_attempts"."batch_test_id" is not null;