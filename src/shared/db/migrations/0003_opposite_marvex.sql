ALTER TABLE "afenda"."tenants" ADD COLUMN "subdomain" varchar(100);--> statement-breakpoint
ALTER TABLE "afenda"."tenants" ADD CONSTRAINT "tenants_subdomain_unique" UNIQUE("subdomain");