ALTER TABLE "afenda"."embedding_chunks" ALTER COLUMN "entity_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "afenda"."embedding_entity_type";--> statement-breakpoint
CREATE TYPE "afenda"."embedding_entity_type" AS ENUM('evidence', 'knowledge_doc', 'knowledge_doc_version');--> statement-breakpoint
ALTER TABLE "afenda"."embedding_chunks" ALTER COLUMN "entity_type" SET DATA TYPE "afenda"."embedding_entity_type" USING "entity_type"::"afenda"."embedding_entity_type";