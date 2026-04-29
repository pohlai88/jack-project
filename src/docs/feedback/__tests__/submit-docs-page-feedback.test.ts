const actionMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  error: vi.fn(),
  headers: vi.fn(),
  info: vi.fn(),
  recordDocsPageFeedbackEvent: vi.fn(),
  assertDocsFeedbackRateLimit: vi.fn(),
  warn: vi.fn(),
}));

vi.mock('server-only', () => ({}));

vi.mock('next/headers', () => ({
  headers: actionMocks.headers,
}));

vi.mock('@/shared/lib/auth', () => ({
  auth: actionMocks.auth,
}));

vi.mock('@/shared/lib/logger', () => ({
  logger: {
    error: actionMocks.error,
    info: actionMocks.info,
    warn: actionMocks.warn,
  },
}));

vi.mock('../server/docs-feedback-rate-limit.server', () => ({
  assertDocsFeedbackRateLimit: actionMocks.assertDocsFeedbackRateLimit,
}));

vi.mock('../server/docs-feedback-service.server', () => ({
  recordDocsPageFeedbackEvent: actionMocks.recordDocsPageFeedbackEvent,
}));

import { submitDocsPageFeedbackAction } from '../server/submit-docs-page-feedback.action';
import { DocsFeedbackPublicError } from '../shared/docs-feedback.errors';
import { DOCS_FEEDBACK_SUCCESS_MESSAGE } from '../shared/docs-feedback.types';

function sameOriginHeaders() {
  return new Headers({
    origin: 'https://app.afenda.test',
    host: 'app.afenda.test',
    'x-forwarded-for': '203.0.113.10',
    'user-agent': 'Mozilla/5.0 Chrome/120.0',
  });
}

describe('submitDocsPageFeedbackAction', () => {
  const originalAuthSecret = process.env.AUTH_SECRET;

  beforeEach(() => {
    process.env.AUTH_SECRET = 'test-secret-with-enough-entropy';
    actionMocks.auth.mockReset();
    actionMocks.auth.mockResolvedValue(null);
    actionMocks.error.mockClear();
    actionMocks.headers.mockReset();
    actionMocks.headers.mockResolvedValue(sameOriginHeaders());
    actionMocks.info.mockClear();
    actionMocks.recordDocsPageFeedbackEvent.mockReset();
    actionMocks.recordDocsPageFeedbackEvent.mockResolvedValue(undefined);
    actionMocks.assertDocsFeedbackRateLimit.mockReset();
    actionMocks.assertDocsFeedbackRateLimit.mockResolvedValue(undefined);
    actionMocks.warn.mockClear();
  });

  afterAll(() => {
    process.env.AUTH_SECRET = originalAuthSecret;
  });

  it('records valid feedback', async () => {
    actionMocks.auth.mockResolvedValue({ user: { id: 'user-1' } });

    const result = await submitDocsPageFeedbackAction({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'good',
      message: 'Useful',
    });

    expect(result).toEqual({ ok: true, message: DOCS_FEEDBACK_SUCCESS_MESSAGE });
    expect(actionMocks.assertDocsFeedbackRateLimit).toHaveBeenCalledOnce();
    expect(actionMocks.recordDocsPageFeedbackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        pageUrl: '/docs',
        pageTitle: 'Documentation',
        opinion: 'good',
        message: 'Useful',
        userId: 'user-1',
        userAgent: 'Mozilla/5.0 Chrome/120.0',
      }),
    );
  });

  it('rejects cross-origin requests before storage', async () => {
    actionMocks.headers.mockResolvedValue(
      new Headers({
        origin: 'https://evil.example',
        host: 'app.afenda.test',
      }),
    );

    const result = await submitDocsPageFeedbackAction({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'good',
    });

    expect(result).toMatchObject({ ok: false, code: 'AFD-DOCS-FEEDBACK-ORIGIN' });
    expect(actionMocks.recordDocsPageFeedbackEvent).not.toHaveBeenCalled();
  });

  it('rejects invalid payloads before rate limiting', async () => {
    const result = await submitDocsPageFeedbackAction({
      pageUrl: '/dashboard',
      pageTitle: 'Dashboard',
      opinion: 'good',
    });

    expect(result).toMatchObject({ ok: false, code: 'AFD-DOCS-FEEDBACK-VALIDATION' });
    expect(actionMocks.assertDocsFeedbackRateLimit).not.toHaveBeenCalled();
    expect(actionMocks.recordDocsPageFeedbackEvent).not.toHaveBeenCalled();
  });

  it('returns safe rate-limit failures', async () => {
    actionMocks.assertDocsFeedbackRateLimit.mockRejectedValue(
      new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-RATE-LIMIT'),
    );

    const result = await submitDocsPageFeedbackAction({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'bad',
    });

    expect(result).toMatchObject({ ok: false, code: 'AFD-DOCS-FEEDBACK-RATE-LIMIT' });
    expect(actionMocks.recordDocsPageFeedbackEvent).not.toHaveBeenCalled();
  });

  it('returns safe storage failures', async () => {
    actionMocks.recordDocsPageFeedbackEvent.mockRejectedValue(new Error('database unavailable'));

    const result = await submitDocsPageFeedbackAction({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'bad',
    });

    expect(result).toMatchObject({ ok: false, code: 'AFD-DOCS-FEEDBACK-STORAGE' });
    expect(actionMocks.error).toHaveBeenCalledOnce();
  });
});
