const store = new Map<string, number[]>();

export const LLMS_EXPORT_RATE_LIMIT = {
  index: { maxRequests: 60, windowMs: 60_000 },
  full: { maxRequests: 12, windowMs: 60_000 },
  page: { maxRequests: 120, windowMs: 60_000 },
} as const;

export type LlmsExportRateTier = keyof typeof LLMS_EXPORT_RATE_LIMIT;

export function getLlmsExportClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

export function consumeLlmsExportRateLimit(key: string, tier: LlmsExportRateTier, now = Date.now()): boolean {
  const { maxRequests, windowMs } = LLMS_EXPORT_RATE_LIMIT[tier];
  const windowStart = now - windowMs;
  const recent = (store.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= maxRequests) {
    store.set(key, recent);
    return false;
  }

  recent.push(now);
  store.set(key, recent);
  return true;
}

/** Test hook: clear in-memory counters. */
export function resetLlmsExportRateLimitStore(): void {
  store.clear();
}
