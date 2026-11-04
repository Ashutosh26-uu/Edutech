CREATE TABLE "mistakes" (
	"user_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"topic_id" text NOT NULL,
	"times_wrong" integer DEFAULT 1 NOT NULL,
	"last_wrong_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "mistakes_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
ALTER TABLE "test_attempts" ADD COLUMN "sections" jsonb;--> statement-breakpoint
ALTER TABLE "test_attempts" ADD COLUMN "sectional" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "test_attempts" ADD COLUMN "times" jsonb;--> statement-breakpoint
ALTER TABLE "mistakes" ADD CONSTRAINT "mistakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mistakes_user_idx" ON "mistakes" USING btree ("user_id","resolved_at");