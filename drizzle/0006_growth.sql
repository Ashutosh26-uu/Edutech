CREATE TABLE "event_counts" (
	"day" date NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "event_counts_day_name_path_pk" PRIMARY KEY("day","name","path")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"new_user_id" uuid PRIMARY KEY NOT NULL,
	"inviter_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rewarded_at" timestamp with time zone,
	"inviter_credited" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "leaderboard" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_new_user_id_users_id_fk" FOREIGN KEY ("new_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "referrals_inviter_idx" ON "referrals" USING btree ("inviter_id","rewarded_at");--> statement-breakpoint
CREATE INDEX "attempts_week_idx" ON "test_attempts" USING btree ("exam_id","submitted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_display_name_idx" ON "users" USING btree (lower("display_name"));--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code");