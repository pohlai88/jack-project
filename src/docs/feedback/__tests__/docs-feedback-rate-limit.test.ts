const countRecentDocsPageFeedbackEventsMock = vi.hoisted(() => vi.fn());

vi.mock('../server/docs-feedback-service', () => ({
  countRecentDocsPageFeedbackEvents: countRecentDocsPageFeedbackEventsMock,
}));

import {
  assertDocsFeedbackRateLimit,
  DOCS_FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS,
  DOCS_FEEDBACK_RATE_LIMIT_WINDOW_MS,
} from '../server/docs-feedback-rate-limit';
import { DocsFeedbackPublicError } from '../shared/docs-feedback.errors';

describe('docs feedback rate limit', () => {
  beforeEach(() => {
    countRecentDocsPageFeedbackEventsMock.mockReset();
  });

  it('allows submissions below the window limit', async () => {
    countRecentDocsPageFeedbackEventsMock.mockResolvedValue(DOCS_FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS - 1);
    const now = new Date('2026-04-27T12:00:00.000Z');

    await expect(assertDocsFeedbackRateLimit('hash', now)).resolves.toBeUndefined();

    expect(countRecentDocsPageFeedbackEventsMock).toHaveBeenCalledWith(
      'hash',
      new Date(now.getTime() - DOCS_FEEDBACK_RATE_LIMIT_WINDOW_MS),
    );
  });

  it('rejects submissions at the window limit', async () => {
    countRecentDocsPageFeedbackEventsMock.mockResolvedValue(DOCS_FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS);

    await expect(assertDocsFeedbackRateLimit('hash')).rejects.toThrow(DocsFeedbackPublicError);
  });
});
