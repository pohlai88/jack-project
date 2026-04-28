import { createHmac } from 'node:crypto';

import { auth } from '@/shared/lib/auth';

import { DocsFeedbackPublicError } from '../shared/docs-feedback.errors';

export interface DocsFeedbackHeaderReader {
  get(name: string): string | null;
}

export interface DocsFeedbackRequestContext {
  userId: string | null;
  rateLimitKeyHash: string;
  userAgent: string | null;
}

interface BuildRateLimitKeyOptions {
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  secret?: string;
  nodeEnv?: string;
}

const MAX_USER_AGENT_LENGTH = 255;
const CONTEXT_ERROR_CODE = 'AFD-DOCS-FEEDBACK-CONTEXT';
const ORIGIN_ERROR_CODE = 'AFD-DOCS-FEEDBACK-ORIGIN';

function throwOriginError(): never {
  throw new DocsFeedbackPublicError(ORIGIN_ERROR_CODE);
}

function throwContextError(): never {
  throw new DocsFeedbackPublicError(CONTEXT_ERROR_CODE);
}

function firstHeaderValue(value: string | null): string | null {
  const first = value?.split(',')[0]?.trim();
  return first ? first : null;
}

function normalizeHost(value: string | null): string | null {
  const host = firstHeaderValue(value)?.toLowerCase();
  return host || null;
}

function normalizeForwardedHost(value: string | null): string | null {
  const first = firstHeaderValue(value);
  if (!first) return null;

  // RFC 7239 style: Forwarded: for=...;host=example.com;proto=https
  const hostMatch = first.match(/(?:^|;)\s*host="?([^";]+)"?/i);
  return (hostMatch?.[1] ?? first).toLowerCase();
}

function getOriginHost(origin: string): string | null {
  try {
    return new URL(origin).host.toLowerCase();
  } catch {
    return null;
  }
}

function getAllowedRequestHosts(headersList: DocsFeedbackHeaderReader): string[] {
  return [
    normalizeForwardedHost(headersList.get('forwarded')),
    normalizeHost(headersList.get('x-forwarded-host')),
    normalizeHost(headersList.get('host')),
  ].filter((host): host is string => Boolean(host));
}

export function assertDocsFeedbackOrigin(headersList: DocsFeedbackHeaderReader): void {
  const origin = headersList.get('origin');
  if (!origin) throwOriginError();

  const originHost = getOriginHost(origin);
  const allowedHosts = getAllowedRequestHosts(headersList);

  if (!originHost || allowedHosts.length === 0 || !allowedHosts.includes(originHost)) {
    throwOriginError();
  }
}

export function getClientIpAddress(headersList: DocsFeedbackHeaderReader): string | null {
  return (
    firstHeaderValue(headersList.get('cf-connecting-ip')) ??
    firstHeaderValue(headersList.get('x-real-ip')) ??
    firstHeaderValue(headersList.get('x-forwarded-for'))
  );
}

export function getUserAgentFamily(userAgent: string | null | undefined): string | null {
  const normalized = userAgent?.toLowerCase().trim();
  if (!normalized) return null;

  if (/bot|crawler|spider|curl|wget|httpie|postman/.test(normalized)) return 'automation';
  if (/edg\//.test(normalized)) return 'edge';
  if (/firefox|fxios/.test(normalized)) return 'firefox';
  if (/opr\//.test(normalized)) return 'opera';
  if (/chrome|crios|chromium/.test(normalized)) return 'chrome';
  if (/safari/.test(normalized)) return 'safari';

  return 'other';
}

export function normalizeUserAgent(userAgent: string | null): string | null {
  const trimmed = userAgent?.trim();
  return trimmed ? trimmed.slice(0, MAX_USER_AGENT_LENGTH) : null;
}

export function hashDocsFeedbackRateLimitKey(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function getRateLimitIdentity(options: BuildRateLimitKeyOptions): string {
  const userId = options.userId?.trim();
  if (userId) return `user:${userId}`;

  const ipAddress = options.ipAddress?.trim();
  const userAgentFamily = getUserAgentFamily(options.userAgent);

  if (ipAddress && userAgentFamily) return `anon:${ipAddress}:${userAgentFamily}`;
  if (ipAddress) return `anon:${ipAddress}`;

  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  if (nodeEnv === 'production') throwContextError();

  return 'anon:local-dev';
}

export function buildDocsFeedbackRateLimitKeyHash(options: BuildRateLimitKeyOptions): string {
  const secret = options.secret ?? process.env.AUTH_SECRET;
  if (!secret) throwContextError();

  return hashDocsFeedbackRateLimitKey(getRateLimitIdentity(options), secret);
}

async function getOptionalUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function getDocsFeedbackRequestContext(
  headersList: DocsFeedbackHeaderReader,
): Promise<DocsFeedbackRequestContext> {
  const userAgent = normalizeUserAgent(headersList.get('user-agent'));
  const userId = await getOptionalUserId();

  const rateLimitKeyHash = buildDocsFeedbackRateLimitKeyHash({
    userId,
    ipAddress: getClientIpAddress(headersList),
    userAgent,
  });

  return {
    userId,
    userAgent,
    rateLimitKeyHash,
  };
}
