CREATE TABLE "institution_members" (
	"institution_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institution_members_institution_id_user_id_pk" PRIMARY KEY("institution_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "institution_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"visibility" text DEFAULT 'public' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"questions" jsonb NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_staff" (
	"institution_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institution_staff_institution_id_email_pk" PRIMARY KEY("institution_id","email")
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"city" text,
	"about" text,
	"website" text,
	"join_code" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institutions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "institutions_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_sets" ADD CONSTRAINT "institution_sets_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_sets" ADD CONSTRAINT "institution_sets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_staff" ADD CONSTRAINT "institution_staff_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "institution_members_user_idx" ON "institution_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "institution_sets_inst_idx" ON "institution_sets" USING btree ("institution_id","updated_at");--> statement-breakpoint
CREATE INDEX "institution_staff_email_idx" ON "institution_staff" USING btree ("email");--> statement-breakpoint
CREATE INDEX "institutions_verified_idx" ON "institutions" USING btree ("verified","name");