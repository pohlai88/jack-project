'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { logger } from '@/shared/lib/logger';

import { assertDocsFeedbackOrigin, getDocsFeedbackRequestContext } from './docs-feedback-context';
import { assertDocsFeedbackRateLimit } from './docs-feedback-rate-limit';
import { recordDocsPageFeedbackEvent } from './docs-feedback-service';
import { DocsFeedbackPublicError, getDocsFeedbackErrorMessage } from '../shared/docs-feedback.errors';
import { parseSubmitDocsPageFeedbackInput } from '../shared/docs-feedback.schema';
import type { DocsPageFeedbackActionResult } from '../shared/docs-feedback.types';

function mapDocsFeedbackActionError(error: unknown): DocsPageFeedbackActionResult {
  if (error instanceof z.ZodError) {
    logger.warn({ issues: error.issues }, 'Rejected invalid docs page feedback');
    return {
      ok: false,
      code: 'AFD-DOCS-FEEDBACK-VALIDATION',
      message: getDocsFeedbackErrorMessage('AFD-DOCS-FEEDBACK-VALIDATION'),
    };
  }

  if (error instanceof DocsFeedbackPublicError) {
    logger.warn({ code: error.code }, 'Rejected docs page feedback');
    return {
      ok: false,
      code: error.code,
      message: error.safeMessage,
    };
  }

  logger.error({ error }, 'Failed to record docs page feedback');
  return {
    ok: false,
    code: 'AFD-DOCS-FEEDBACK-STORAGE',
    message: getDocsFeedbackErrorMessage('AFD-DOCS-FEEDBACK-STORAGE'),
  };
}

export async function submitDocsPageFeedbackAction(input: unknown): Promise<DocsPageFeedbackActionResult> {
  try {
    const headersList = await headers();

    assertDocsFeedbackOrigin(headersList);
    const payload = parseSubmitDocsPageFeedbackInput(input);
    const context = await getDocsFeedbackRequestContext(headersList);

    await assertDocsFeedbackRateLimit(context.rateLimitKeyHash);
    await recordDocsPageFeedbackEvent({
      ...payload,
      userId: context.userId,
      rateLimitKeyHash: context.rateLimitKeyHash,
      userAgent: context.userAgent,
    });

    logger.info(
      {
        pageUrl: payload.pageUrl,
        opinion: payload.opinion,
        authenticated: Boolean(context.userId),
      },
      'Recorded docs page feedback',
    );

    return {
      ok: true,
      message: 'Thanks for the feedback.',
    };
  } catch (error) {
    return mapDocsFeedbackActionError(error);
  }
}
