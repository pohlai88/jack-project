import { and, count, eq, gte } from 'drizzle-orm';

import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';

import type { SubmitDocsPageFeedbackInput } from '../shared/docs-feedback.types';

export interface RecordDocsPageFeedbackEventInput extends SubmitDocsPageFeedbackInput {
  userId: string | null;
  rateLimitKeyHash: string;
  userAgent: string | null;
}

function normalizeNullableText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeRequiredText(value: string, field: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`[DocsFeedbackService] "${field}" must not be empty.`);
  }

  return trimmed;
}

export async function countRecentDocsPageFeedbackEvents(
  rateLimitKeyHash: string,
  since: Date,
): Promise<number> {
  const normalizedRateLimitKeyHash = normalizeRequiredText(
    rateLimitKeyHash,
    'rateLimitKeyHash',
  );

  const [row] = await db
    .select({ total: count() })
    .from(schema.docsPageFeedbackEvents)
    .where(
      and(
        eq(schema.docsPageFeedbackEvents.rateLimitKeyHash, normalizedRateLimitKeyHash),
        gte(schema.docsPageFeedbackEvents.createdAt, since),
      ),
    );

  return Number(row?.total ?? 0);
}

export async function recordDocsPageFeedbackEvent(
  input: RecordDocsPageFeedbackEventInput,
): Promise<void> {
  await db.insert(schema.docsPageFeedbackEvents).values({
    pageUrl: normalizeRequiredText(input.pageUrl, 'pageUrl'),
    pageTitle: normalizeRequiredText(input.pageTitle, 'pageTitle'),
    opinion: input.opinion,
    message: normalizeNullableText(input.message),
    userId: normalizeNullableText(input.userId),
    rateLimitKeyHash: normalizeRequiredText(input.rateLimitKeyHash, 'rateLimitKeyHash'),
    userAgent: normalizeNullableText(input.userAgent),
  });
}