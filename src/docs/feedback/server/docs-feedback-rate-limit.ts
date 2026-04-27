import { countRecentDocsPageFeedbackEvents } from './docs-feedback-service';
import { DocsFeedbackPublicError } from '../shared/docs-feedback.errors';

export const DOCS_FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS = 5;
export const DOCS_FEEDBACK_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function assertDocsFeedbackRateLimit(rateLimitKeyHash: string, now = new Date()): Promise<void> {
  const since = new Date(now.getTime() - DOCS_FEEDBACK_RATE_LIMIT_WINDOW_MS);
  const recentCount = await countRecentDocsPageFeedbackEvents(rateLimitKeyHash, since);

  if (recentCount >= DOCS_FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS) {
    throw new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-RATE-LIMIT');
  }
}
