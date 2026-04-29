'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { logger } from '@/shared/lib/logger';

import { assertDocsFeedbackOrigin, getDocsFeedbackRequestContext } from './docs-feedback-context.server';
import { assertDocsFeedbackRateLimit } from './docs-feedback-rate-limit.server';
import { recordDocsPageFeedbackEvent } from './docs-feedback-service.server';
import { DocsFeedbackPublicError, getDocsFeedbackErrorMessage } from '../shared/docs-feedback.errors';
import { parseSubmitDocsPageFeedbackInput } from '../shared/docs-feedback.schema';
import {
  DOCS_FEEDBACK_SUCCESS_MESSAGE,
  type DocsFeedbackErrorCode,
  type DocsPageFeedbackActionResult,
  failDocsFeedback,
  okDocsFeedback,
  type SubmitDocsPageFeedbackInput,
} from '../shared/docs-feedback.types';

function rejectDocsFeedback(
  code: DocsFeedbackErrorCode,
  message = getDocsFeedbackErrorMessage(code),
): DocsPageFeedbackActionResult {
  return failDocsFeedback(code, message);
}

function mapDocsFeedbackActionError(error: unknown): DocsPageFeedbackActionResult {
  if (error instanceof z.ZodError) {
    logger.warn(
      {
        issueCount: error.issues.length,
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          code: issue.code,
          message: issue.message,
        })),
      },
      'Rejected invalid docs page feedback',
    );

    return rejectDocsFeedback('AFD-DOCS-FEEDBACK-VALIDATION');
  }

  if (error instanceof DocsFeedbackPublicError) {
    logger.warn({ code: error.code }, 'Rejected docs page feedback');

    return rejectDocsFeedback(error.code, error.safeMessage);
  }

  logger.error({ error }, 'Failed to record docs page feedback');

  return rejectDocsFeedback('AFD-DOCS-FEEDBACK-STORAGE');
}

async function recordValidatedDocsPageFeedback(
  payload: SubmitDocsPageFeedbackInput,
): Promise<{ authenticated: boolean }> {
  const headersList = await headers();

  assertDocsFeedbackOrigin(headersList);

  const context = await getDocsFeedbackRequestContext(headersList);

  await assertDocsFeedbackRateLimit(context.rateLimitKeyHash);

  await recordDocsPageFeedbackEvent({
    ...payload,
    userId: context.userId,
    rateLimitKeyHash: context.rateLimitKeyHash,
    userAgent: context.userAgent,
  });

  return {
    authenticated: Boolean(context.userId),
  };
}

export async function submitDocsPageFeedbackAction(input: unknown): Promise<DocsPageFeedbackActionResult> {
  try {
    const payload = parseSubmitDocsPageFeedbackInput(input);
    const result = await recordValidatedDocsPageFeedback(payload);

    logger.info(
      {
        pageUrl: payload.pageUrl,
        opinion: payload.opinion,
        authenticated: result.authenticated,
      },
      'Recorded docs page feedback',
    );

    return okDocsFeedback(DOCS_FEEDBACK_SUCCESS_MESSAGE);
  } catch (error) {
    return mapDocsFeedbackActionError(error);
  }
}
