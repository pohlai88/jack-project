CREATE TYPE "afenda"."docs_feedback_opinion" AS ENUM('good', 'bad');--> statement-breakpoint
CREATE TABLE "afenda"."docs_page_feedback_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_url" text NOT NULL,
	"page_title" varchar(160) NOT NULL,
	"opinion" "afenda"."docs_feedback_opinion" NOT NULL,
	"message" text,
	"user_id" text,
	"rate_limit_key_hash" varchar(64) NOT NULL,
	"user_agent" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "afenda"."docs_page_feedback_events" ADD CONSTRAINT "docs_page_feedback_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "afenda"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "docs_page_feedback_events_page_url_idx" ON "afenda"."docs_page_feedback_events" USING btree ("page_url");--> statement-breakpoint
CREATE INDEX "docs_page_feedback_events_rate_limit_idx" ON "afenda"."docs_page_feedback_events" USING btree ("rate_limit_key_hash","created_at");--> statement-breakpoint
CREATE INDEX "docs_page_feedback_events_user_idx" ON "afenda"."docs_page_feedback_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "docs_page_feedback_events_created_at_idx" ON "afenda"."docs_page_feedback_events" USING btree ("created_at");