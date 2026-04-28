ALTER TABLE "afenda"."tenants" ADD COLUMN "custom_domain_hostname" varchar(253);--> statement-breakpoint
ALTER TABLE "afenda"."tenants" ADD COLUMN "custom_domain_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "afenda"."tenants" ADD COLUMN "custom_domain_verify_token" varchar(128);--> statement-breakpoint
ALTER TABLE "afenda"."tenants" ADD CONSTRAINT "tenants_custom_domain_hostname_unique" UNIQUE("custom_domain_hostname");