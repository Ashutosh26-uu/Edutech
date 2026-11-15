CREATE TABLE "challenge_plays" (
	"challenge_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"correct" integer NOT NULL,
	"wrong" integer NOT NULL,
	"seconds" integer NOT NULL,
	"played_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "challenge_plays_challenge_id_user_id_pk" PRIMARY KEY("challenge_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_id" uuid NOT NULL,
	"exam_id" text NOT NULL,
	"topic_ids" text[] NOT NULL,
	"questions" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenge_plays" ADD CONSTRAINT "challenge_plays_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_plays" ADD CONSTRAINT "challenge_plays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "challenges_creator_idx" ON "challenges" USING btree ("creator_id","created_at");