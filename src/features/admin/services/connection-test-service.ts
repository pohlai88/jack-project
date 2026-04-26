import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import OpenAI from 'openai';

import type {
  AIConnectionTestInput,
  ConnectionTestCode,
  ConnectionTestResult,
  StorageConnectionTestInput,
} from '../types/connection-test';

export const CONNECTION_TEST_TIMEOUT_MS = 8000;
export const CONNECTION_TEST_RATE_LIMIT_MAX_REQUESTS = 5;
export const CONNECTION_TEST_RATE_LIMIT_WINDOW_MS = 60_000;

const connectionTestRateLimitStore = new Map<string, number[]>();

export function consumeConnectionTestRateLimit(key: string, now = Date.now()): boolean {
  const windowStart = now - CONNECTION_TEST_RATE_LIMIT_WINDOW_MS;
  const recentTimestamps = (connectionTestRateLimitStore.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (recentTimestamps.length >= CONNECTION_TEST_RATE_LIMIT_MAX_REQUESTS) {
    connectionTestRateLimitStore.set(key, recentTimestamps);
    return false;
  }

  recentTimestamps.push(now);
  connectionTestRateLimitStore.set(key, recentTimestamps);
  return true;
}

export function resetConnectionTestRateLimitStore(): void {
  connectionTestRateLimitStore.clear();
}

async function runWithTimeout(
  runner: (signal: AbortSignal) => Promise<void>,
): Promise<{ ok: true; durationMs: number } | { ok: false; durationMs: number; error: unknown }> {
  const startedAt = Date.now();
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), CONNECTION_TEST_TIMEOUT_MS);

  try {
    await runner(abortController.signal);
    return { ok: true, durationMs: Date.now() - startedAt };
  } catch (error) {
    return { ok: false, durationMs: Date.now() - startedAt, error };
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildFailureResult(message: string, code: ConnectionTestCode, durationMs: number): ConnectionTestResult {
  return {
    ok: false,
    message,
    code,
    durationMs,
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : Boolean(
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        typeof error.name === 'string' &&
        error.name === 'AbortError',
      );
}

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  if ('$metadata' in error && typeof error.$metadata === 'object' && error.$metadata !== null) {
    const statusCode = Reflect.get(error.$metadata, 'httpStatusCode');
    if (typeof statusCode === 'number') {
      return statusCode;
    }
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }

  if ('response' in error && typeof error.response === 'object' && error.response !== null) {
    const statusCode = Reflect.get(error.response, 'status');
    if (typeof statusCode === 'number') {
      return statusCode;
    }
  }

  return undefined;
}

function mapOpenAIError(error: unknown, durationMs: number): ConnectionTestResult {
  if (isAbortError(error)) {
    return buildFailureResult('The OpenAI connection test timed out. Please try again.', 'NETWORK_ERROR', durationMs);
  }

  const status = getHttpStatus(error);
  if (status === 401 || status === 403) {
    return buildFailureResult('OpenAI rejected the provided API key.', 'INVALID_CREDENTIALS', durationMs);
  }

  return buildFailureResult('Unable to verify the OpenAI connection right now.', 'UNKNOWN', durationMs);
}

function mapAnthropicError(error: unknown, durationMs: number): ConnectionTestResult {
  if (isAbortError(error)) {
    return buildFailureResult(
      'The Anthropic connection test timed out. Please try again.',
      'NETWORK_ERROR',
      durationMs,
    );
  }

  const status = getHttpStatus(error);
  if (status === 401 || status === 403) {
    return buildFailureResult('Anthropic rejected the provided API key.', 'INVALID_CREDENTIALS', durationMs);
  }

  if (status !== undefined && status >= 400 && status < 500) {
    return buildFailureResult('Anthropic could not verify the provided credentials.', 'UNKNOWN', durationMs);
  }

  return buildFailureResult('Unable to verify the Anthropic connection right now.', 'UNKNOWN', durationMs);
}

function mapStorageError(error: unknown, durationMs: number): ConnectionTestResult {
  if (isAbortError(error)) {
    return buildFailureResult('The storage connection test timed out. Please try again.', 'NETWORK_ERROR', durationMs);
  }

  const status = getHttpStatus(error);
  if (status === 404) {
    return buildFailureResult('The configured bucket could not be found.', 'BUCKET_NOT_FOUND', durationMs);
  }
  if (status === 401 || status === 403) {
    return buildFailureResult('The storage credentials were rejected.', 'INVALID_CREDENTIALS', durationMs);
  }

  return buildFailureResult('Unable to verify the storage connection right now.', 'NETWORK_ERROR', durationMs);
}

async function verifyOpenAIConnection(apiKey: string, signal: AbortSignal): Promise<void> {
  const client = new OpenAI({ apiKey });
  await client.models.list({ signal });
}

async function verifyAnthropicConnection(apiKey: string, signal: AbortSignal): Promise<void> {
  const response = await fetch('https://api.anthropic.com/v1/models', {
    method: 'GET',
    headers: {
      'anthropic-version': '2023-06-01',
      'x-api-key': apiKey,
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error('Anthropic verification failed');
    Object.assign(error, { status: response.status });
    throw error;
  }
}

async function verifyStorageConnection(input: StorageConnectionTestInput, signal: AbortSignal): Promise<void> {
  const client = new S3Client({
    region: input.region || 'us-east-1',
    ...(input.endpoint && {
      endpoint: input.endpoint,
      forcePathStyle: input.forcePathStyle !== false,
    }),
    credentials: {
      accessKeyId: input.accessKey,
      secretAccessKey: input.secretKey,
    },
  });

  await client.send(
    new HeadBucketCommand({
      Bucket: input.bucket,
    }),
    { abortSignal: signal },
  );
}

export async function testAIConnection(input: AIConnectionTestInput): Promise<ConnectionTestResult> {
  if (input.provider === 'openai') {
    const outcome = await runWithTimeout((signal) => verifyOpenAIConnection(input.apiKey, signal));
    return outcome.ok
      ? { ok: true, message: 'OpenAI connection verified successfully.', durationMs: outcome.durationMs }
      : mapOpenAIError(outcome.error, outcome.durationMs);
  }

  if (input.provider === 'anthropic') {
    const outcome = await runWithTimeout((signal) => verifyAnthropicConnection(input.apiKey, signal));
    return outcome.ok
      ? { ok: true, message: 'Anthropic connection verified successfully.', durationMs: outcome.durationMs }
      : mapAnthropicError(outcome.error, outcome.durationMs);
  }

  return buildFailureResult('Only the configured AI providers can be tested.', 'UNSUPPORTED_PROVIDER', 0);
}

export async function testStorageConnection(input: StorageConnectionTestInput): Promise<ConnectionTestResult> {
  const outcome = await runWithTimeout((signal) => verifyStorageConnection(input, signal));
  return outcome.ok
    ? { ok: true, message: 'Storage connection verified successfully.', durationMs: outcome.durationMs }
    : mapStorageError(outcome.error, outcome.durationMs);
}
