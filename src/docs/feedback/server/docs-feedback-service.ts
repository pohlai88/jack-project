import { and, count, eq, gte } from 'drizzle-orm';

import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';

import type { SubmitDocsPageFeedbackInput } from '../shared/docs-feedback.types';

export interface RecordDocsPageFeedbackEventInput extends SubmitDocsPageFeedbackInput {
  userId: string | null;
  rateLimitKeyHash: string;
  userAgent: string | null;
}

export async function countRecentDocsPageFeedbackEvents(rateLimitKeyHash: string, since: Date): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(schema.docsPageFeedbackEvents)
    .where(
      and(
        eq(schema.docsPageFeedbackEvents.rateLimitKeyHash, rateLimitKeyHash),
        gte(schema.docsPageFeedbackEvents.createdAt, since),
      ),
    );

  return Number(row?.total ?? 0);
}

export async function recordDocsPageFeedbackEvent(input: RecordDocsPageFeedbackEventInput): Promise<void> {
  await db.insert(schema.docsPageFeedbackEvents).values({
    pageUrl: input.pageUrl,
    pageTitle: input.pageTitle,
    opinion: input.opinion,
    message: input.message ?? null,
    userId: input.userId,
    rateLimitKeyHash: input.rateLimitKeyHash,
    userAgent: input.userAgent,
  });
}
