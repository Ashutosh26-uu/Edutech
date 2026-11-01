CREATE TABLE "free_tests" (
	"user_id" uuid NOT NULL,
	"exam_id" text NOT NULL,
	"used_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "free_tests_user_id_exam_id_pk" PRIMARY KEY("user_id","exam_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_id" text NOT NULL,
	"payment_id" text,
	"product_id" text NOT NULL,
	"exam_id" text,
	"amount_paise" integer NOT NULL,
	"status" text DEFAULT 'created' NOT NULL,
	"mode" text DEFAULT 'live' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	CONSTRAINT "payments_order_id_unique" UNIQUE("order_id"),
	CONSTRAINT "payments_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "revision_passes" (
	"user_id" uuid NOT NULL,
	"exam_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "revision_passes_user_id_exam_id_pk" PRIMARY KEY("user_id","exam_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"exam_id" text NOT NULL,
	"kind" text NOT NULL,
	"topic_ids" text[] NOT NULL,
	"questions" jsonb NOT NULL,
	"paid_with" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	"submitted_at" timestamp with time zone,
	"answers" jsonb,
	"correct" integer,
	"wrong" integer,
	"skipped" integer,
	"score" real
);
--> statement-breakpoint
CREATE TABLE "topic_stats" (
	"user_id" uuid NOT NULL,
	"topic_id" text NOT NULL,
	"attempted" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"last_practiced" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topic_stats_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password_hash" text NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "credits_non_negative" CHECK ("users"."credits" >= 0)
);
--> statement-breakpoint
ALTER TABLE "free_tests" ADD CONSTRAINT "free_tests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_passes" ADD CONSTRAINT "revision_passes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_stats" ADD CONSTRAINT "topic_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "attempts_user_idx" ON "test_attempts" USING btree ("user_id","started_at");