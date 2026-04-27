const authMock = vi.hoisted(() => vi.fn());

vi.mock('@/shared/lib/auth', () => ({
  auth: authMock,
}));

import {
  assertDocsFeedbackOrigin,
  buildDocsFeedbackRateLimitKeyHash,
  getDocsFeedbackRequestContext,
} from '../server/docs-feedback-context';
import { DocsFeedbackPublicError } from '../shared/docs-feedback.errors';

describe('docs feedback context', () => {
  const originalAuthSecret = process.env.AUTH_SECRET;

  beforeEach(() => {
    process.env.AUTH_SECRET = 'test-secret-with-enough-entropy';
    authMock.mockReset();
    authMock.mockResolvedValue(null);
  });

  afterAll(() => {
    process.env.AUTH_SECRET = originalAuthSecret;
  });

  it('accepts same-origin feedback requests', () => {
    const headersList = new Headers({
      origin: 'https://app.afenda.test',
      host: 'app.afenda.test',
    });

    expect(() => assertDocsFeedbackOrigin(headersList)).not.toThrow();
  });

  it('rejects cross-origin feedback requests', () => {
    const headersList = new Headers({
      origin: 'https://evil.example',
      host: 'app.afenda.test',
    });

    expect(() => assertDocsFeedbackOrigin(headersList)).toThrow(DocsFeedbackPublicError);
  });

  it('rejects anonymous production requests without an IP-derived key', () => {
    expect(() =>
      buildDocsFeedbackRateLimitKeyHash({
        secret: 'test-secret',
        nodeEnv: 'production',
      }),
    ).toThrow(DocsFeedbackPublicError);
  });

  it('prioritizes authenticated user identity over anonymous headers', () => {
    const first = buildDocsFeedbackRateLimitKeyHash({
      userId: 'user-1',
      ipAddress: '203.0.113.10',
      userAgent: 'Mozilla/5.0 Chrome/120.0',
      secret: 'test-secret',
    });
    const second = buildDocsFeedbackRateLimitKeyHash({
      userId: 'user-1',
      ipAddress: '198.51.100.10',
      userAgent: 'Mozilla/5.0 Firefox/122.0',
      secret: 'test-secret',
    });

    expect(first).toBe(second);
  });

  it('groups anonymous rate-limit keys by IP and user-agent family', () => {
    const chromeOne = buildDocsFeedbackRateLimitKeyHash({
      ipAddress: '203.0.113.10',
      userAgent: 'Mozilla/5.0 Chrome/120.0',
      secret: 'test-secret',
    });
    const chromeTwo = buildDocsFeedbackRateLimitKeyHash({
      ipAddress: '203.0.113.10',
      userAgent: 'Mozilla/5.0 Chrome/121.0',
      secret: 'test-secret',
    });
    const firefox = buildDocsFeedbackRateLimitKeyHash({
      ipAddress: '203.0.113.10',
      userAgent: 'Mozilla/5.0 Firefox/122.0',
      secret: 'test-secret',
    });

    expect(chromeOne).toBe(chromeTwo);
    expect(chromeOne).not.toBe(firefox);
  });

  it('builds request context without storing raw IP address', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-1' } });

    const context = await getDocsFeedbackRequestContext(
      new Headers({
        'x-forwarded-for': '203.0.113.10, 198.51.100.10',
        'user-agent': 'Mozilla/5.0 Chrome/120.0',
      }),
    );

    expect(context).toMatchObject({
      userId: 'user-1',
      userAgent: 'Mozilla/5.0 Chrome/120.0',
    });
    expect(context.rateLimitKeyHash).toHaveLength(64);
    expect(context.rateLimitKeyHash).not.toContain('203.0.113.10');
  });
});
