import 'server-only';

const llmsExportRateLimitStore = new Map<string, number[]>();

export const LLMS_EXPORT_RATE_LIMIT = {
  index: { maxRequests: 60, windowMs: 60_000 },
  full: { maxRequests: 12, windowMs: 60_000 },
  page: { maxRequests: 120, windowMs: 60_000 },
} as const;

export type LlmsExportRateTier = keyof typeof LLMS_EXPORT_RATE_LIMIT;

const UNKNOWN_CLIENT_IP = 'unknown';
const MAX_RATE_LIMIT_KEYS = 10_000;

export function getLlmsExportClientIp(request: Request): string {
  return getFirstForwardedIp(request) ?? getTrimmedHeader(request, 'x-real-ip') ?? UNKNOWN_CLIENT_IP;
}

export function buildLlmsExportRateLimitKey(request: Request, tier: LlmsExportRateTier, scope = 'global'): string {
  return `llms:${tier}:${scope}:${getLlmsExportClientIp(request)}`;
}

export function consumeLlmsExportRateLimit(key: string, tier: LlmsExportRateTier, now = Date.now()): boolean {
  const policy = LLMS_EXPORT_RATE_LIMIT[tier];
  const windowStart = now - policy.windowMs;
  const recentRequests = getRecentRequests(key, windowStart);

  pruneExpiredRateLimitEntries(windowStart);

  if (recentRequests.length >= policy.maxRequests) {
    llmsExportRateLimitStore.set(key, recentRequests);
    return false;
  }

  enforceRateLimitStoreCap();
  llmsExportRateLimitStore.set(key, [...recentRequests, now]);
  return true;
}

/** Test hook only. Do not call from route handlers. */
export function resetLlmsExportRateLimitStore(): void {
  llmsExportRateLimitStore.clear();
}

function getFirstForwardedIp(request: Request): string | null {
  const forwardedFor = getTrimmedHeader(request, 'x-forwarded-for');
  if (!forwardedFor) return null;

  const firstIp = forwardedFor.split(',')[0]?.trim();
  return firstIp || null;
}

function getTrimmedHeader(request: Request, name: string): string | null {
  const value = request.headers.get(name)?.trim();
  return value || null;
}

function getRecentRequests(key: string, windowStart: number): number[] {
  return (llmsExportRateLimitStore.get(key) ?? []).filter((timestamp) => timestamp > windowStart);
}

function pruneExpiredRateLimitEntries(windowStart: number): void {
  for (const [key, timestamps] of llmsExportRateLimitStore) {
    const recent = timestamps.filter((timestamp) => timestamp > windowStart);

    if (recent.length === 0) {
      llmsExportRateLimitStore.delete(key);
      continue;
    }

    if (recent.length !== timestamps.length) {
      llmsExportRateLimitStore.set(key, recent);
    }
  }
}

function enforceRateLimitStoreCap(): void {
  if (llmsExportRateLimitStore.size < MAX_RATE_LIMIT_KEYS) return;

  const oldestKey = llmsExportRateLimitStore.keys().next().value as string | undefined;
  if (oldestKey) {
    llmsExportRateLimitStore.delete(oldestKey);
  }
}
