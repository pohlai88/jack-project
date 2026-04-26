const { mockOpenAIList, mockS3Send } = vi.hoisted(() => ({
  mockOpenAIList: vi.fn(),
  mockS3Send: vi.fn(),
}));

vi.mock('openai', () => ({
  default: class OpenAI {
    models = {
      list: mockOpenAIList,
    };
  },
}));

vi.mock('@aws-sdk/client-s3', () => ({
  HeadBucketCommand: class HeadBucketCommand {
    input: unknown;

    constructor(input: unknown) {
      this.input = input;
    }
  },
  S3Client: class S3Client {
    send = mockS3Send;
  },
}));

import {
  consumeConnectionTestRateLimit,
  resetConnectionTestRateLimitStore,
  testAIConnection,
  testStorageConnection,
} from '../connection-test-service';

describe('connection-test-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    resetConnectionTestRateLimitStore();
  });

  describe('consumeConnectionTestRateLimit', () => {
    it('allows five requests per minute and rejects the sixth', () => {
      const key = 'tenant:user:endpoint';
      const now = 1_000;

      expect(consumeConnectionTestRateLimit(key, now)).toBe(true);
      expect(consumeConnectionTestRateLimit(key, now + 1)).toBe(true);
      expect(consumeConnectionTestRateLimit(key, now + 2)).toBe(true);
      expect(consumeConnectionTestRateLimit(key, now + 3)).toBe(true);
      expect(consumeConnectionTestRateLimit(key, now + 4)).toBe(true);
      expect(consumeConnectionTestRateLimit(key, now + 5)).toBe(false);
    });
  });

  describe('testAIConnection', () => {
    it('maps OpenAI credential failures safely', async () => {
      mockOpenAIList.mockRejectedValue(Object.assign(new Error('Unauthorized'), { status: 401 }));

      const result = await testAIConnection({ provider: 'openai', apiKey: 'bad-key' });

      expect(result).toMatchObject({
        ok: false,
        code: 'INVALID_CREDENTIALS',
        message: 'OpenAI rejected the provided API key.',
      });
      expect(result.durationMs).toEqual(expect.any(Number));
    });

    it('maps Anthropic timeouts to NETWORK_ERROR', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(Object.assign(new Error('Aborted'), { name: 'AbortError' })));

      const result = await testAIConnection({ provider: 'anthropic', apiKey: 'bad-key' });

      expect(result).toMatchObject({
        ok: false,
        code: 'NETWORK_ERROR',
        message: 'The Anthropic connection test timed out. Please try again.',
      });
    });

    it('returns UNSUPPORTED_PROVIDER for unknown providers', async () => {
      const result = await testAIConnection({ provider: 'other' as never, apiKey: 'key' });

      expect(result).toEqual({
        ok: false,
        code: 'UNSUPPORTED_PROVIDER',
        durationMs: 0,
        message: 'Only the configured AI providers can be tested.',
      });
    });
  });

  describe('testStorageConnection', () => {
    it('maps missing buckets to BUCKET_NOT_FOUND', async () => {
      mockS3Send.mockRejectedValue({
        $metadata: {
          httpStatusCode: 404,
        },
      });

      const result = await testStorageConnection({
        provider: 's3',
        accessKey: 'access',
        secretKey: 'secret',
        bucket: 'missing-bucket',
      });

      expect(result).toMatchObject({
        ok: false,
        code: 'BUCKET_NOT_FOUND',
        message: 'The configured bucket could not be found.',
      });
    });

    it('maps rejected storage credentials to INVALID_CREDENTIALS', async () => {
      mockS3Send.mockRejectedValue({
        $metadata: {
          httpStatusCode: 403,
        },
      });

      const result = await testStorageConnection({
        provider: 's3',
        accessKey: 'access',
        secretKey: 'secret',
        bucket: 'private-bucket',
      });

      expect(result).toMatchObject({
        ok: false,
        code: 'INVALID_CREDENTIALS',
        message: 'The storage credentials were rejected.',
      });
    });
  });
});
