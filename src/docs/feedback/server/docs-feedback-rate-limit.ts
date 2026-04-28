import { countRecentDocsPageFeedbackEvents } from './docs-feedback-service';
import { DocsFeedbackPublicError } from '../shared/docs-feedback.errors';

export const DOCS_FEEDBACK_RATE_LIMIT = Object.freeze({
  maxSubmissions: 5,
  windowMs: 10 * 60 * 1000,
  errorCode: 'AFD-DOCS-FEEDBACK-RATE-LIMIT',
} as const);

export const DOCS_FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS = DOCS_FEEDBACK_RATE_LIMIT.maxSubmissions;
export const DOCS_FEEDBACK_RATE_LIMIT_WINDOW_MS = DOCS_FEEDBACK_RATE_LIMIT.windowMs;

export function getDocsFeedbackRateLimitWindowStart(now = new Date()): Date {
  return new Date(now.getTime() - DOCS_FEEDBACK_RATE_LIMIT.windowMs);
}

export async function assertDocsFeedbackRateLimit(rateLimitKeyHash: string, now = new Date()): Promise<void> {
  const normalizedKey = rateLimitKeyHash.trim();

  if (!normalizedKey) {
    throw new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-CONTEXT');
  }

  const since = getDocsFeedbackRateLimitWindowStart(now);
  const recentCount = await countRecentDocsPageFeedbackEvents(normalizedKey, since);

  if (recentCount >= DOCS_FEEDBACK_RATE_LIMIT.maxSubmissions) {
    throw new DocsFeedbackPublicError(DOCS_FEEDBACK_RATE_LIMIT.errorCode);
  }
}
