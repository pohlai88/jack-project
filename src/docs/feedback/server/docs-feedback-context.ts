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

function firstHeaderValue(value: string | null): string | null {
  const first = value?.split(',')[0]?.trim();
  return first && first.length > 0 ? first : null;
}

function normalizeHost(value: string | null): string | null {
  const host = firstHeaderValue(value)?.toLowerCase();
  return host && host.length > 0 ? host : null;
}

function getOriginHost(origin: string): string | null {
  try {
    return new URL(origin).host.toLowerCase();
  } catch {
    return null;
  }
}

export function assertDocsFeedbackOrigin(headersList: DocsFeedbackHeaderReader): void {
  const origin = headersList.get('origin');
  if (!origin) {
    throw new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-ORIGIN');
  }

  const originHost = getOriginHost(origin);
  const allowedHosts = [
    normalizeHost(headersList.get('x-forwarded-host')),
    normalizeHost(headersList.get('host')),
  ].filter((host): host is string => Boolean(host));

  if (!originHost || allowedHosts.length === 0 || !allowedHosts.includes(originHost)) {
    throw new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-ORIGIN');
  }
}

export function getClientIpAddress(headersList: DocsFeedbackHeaderReader): string | null {
  return (
    firstHeaderValue(headersList.get('x-forwarded-for')) ??
    firstHeaderValue(headersList.get('x-real-ip')) ??
    firstHeaderValue(headersList.get('cf-connecting-ip'))
  );
}

export function getUserAgentFamily(userAgent: string | null | undefined): string | null {
  const normalized = userAgent?.toLowerCase() ?? '';
  if (!normalized) return null;

  if (/bot|crawler|spider|curl|wget|httpie|postman/.test(normalized)) return 'automation';
  if (/edg\//.test(normalized)) return 'edge';
  if (/firefox|fxios/.test(normalized)) return 'firefox';
  if (/chrome|crios|chromium/.test(normalized) && !/opr\//.test(normalized)) return 'chrome';
  if (/safari/.test(normalized) && !/chrome|crios|chromium/.test(normalized)) return 'safari';

  return 'other';
}

export function normalizeUserAgent(userAgent: string | null): string | null {
  const trimmed = userAgent?.trim();
  return trimmed && trimmed.length > 0 ? trimmed.slice(0, 255) : null;
}

export function hashDocsFeedbackRateLimitKey(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function buildDocsFeedbackRateLimitKeyHash(options: BuildRateLimitKeyOptions): string {
  const secret = options.secret ?? process.env.AUTH_SECRET;
  if (!secret) {
    throw new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-CONTEXT');
  }

  const userId = options.userId?.trim();
  if (userId) {
    return hashDocsFeedbackRateLimitKey(`user:${userId}`, secret);
  }

  const ipAddress = options.ipAddress?.trim();
  const userAgentFamily = getUserAgentFamily(options.userAgent);

  if (ipAddress && userAgentFamily) {
    return hashDocsFeedbackRateLimitKey(`anon:${ipAddress}:${userAgentFamily}`, secret);
  }

  if (ipAddress) {
    return hashDocsFeedbackRateLimitKey(`anon:${ipAddress}`, secret);
  }

  if ((options.nodeEnv ?? process.env.NODE_ENV) === 'production') {
    throw new DocsFeedbackPublicError('AFD-DOCS-FEEDBACK-CONTEXT');
  }

  return hashDocsFeedbackRateLimitKey('anon:local-dev', secret);
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

  return {
    userId,
    userAgent,
    rateLimitKeyHash: buildDocsFeedbackRateLimitKeyHash({
      userId,
      ipAddress: getClientIpAddress(headersList),
      userAgent,
    }),
  };
}
