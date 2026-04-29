import { DOCS_FALLBACK_DATE } from './docs-runtime.contract';

const LOCAL_HOST_PREFIXES = ['127.', '0.0.0.0'] as const;
const ALLOWED_PROTOCOLS = new Set(['http', 'https']);

export function normalizeOrigin(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol.replace(':', ''))) return null;

    return parsed.origin.replace(/\/+$/, '');
  } catch {
    return null;
  }
}

export function normalizeSameOriginPath(value: string | null | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return '/';

  const pathname = safeExtractPathname(trimmed);
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutDuplicateSlashes = withLeadingSlash.replace(/\/+/g, '/');

  if (withoutDuplicateSlashes === '/') return '/';

  return withoutDuplicateSlashes.replace(/\/+$/, '');
}

export function safeExtractPathname(value: string): string {
  try {
    return new URL(value, 'https://docs.invalid').pathname;
  } catch {
    return '/';
  }
}

export function splitPathSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

export function resolveValidDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isValidDate(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isValidDate(parsed) ? parsed : null;
  }

  return null;
}

export function resolveDateOrFallback(value: unknown): Date {
  return resolveValidDate(value) ?? DOCS_FALLBACK_DATE;
}

export function inferProtocolFromHost(host: string): 'http' | 'https' {
  const normalizedHost = host.trim().toLowerCase();

  if (normalizedHost.includes('localhost') || LOCAL_HOST_PREFIXES.some((prefix) => normalizedHost.startsWith(prefix))) {
    return 'http';
  }

  return 'https';
}

export function firstHeaderValue(value: string | null): string | null {
  const first = value?.split(',')[0]?.trim();
  return first || null;
}

export function normalizeHeaderProtocol(value: string | null): 'http' | 'https' | null {
  const protocol = firstHeaderValue(value)?.toLowerCase();
  return protocol === 'http' || protocol === 'https' ? protocol : null;
}

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}
