import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import { afterAll, beforeAll, vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
}));

// Server helpers are not available in Vitest's jsdom context without this stub.
vi.mock('next-intl/server', () => ({
  getLocale: () => Promise.resolve('en'),
  getRequestConfig: vi.fn(),
  getTranslations: () => () => Promise.resolve((key: string) => key),
  getMessages: () => Promise.resolve({}),
  setRequestLocale: vi.fn(),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ tenant: 'test-tenant' }),
}));

// Mock locale-aware navigation (next-intl) — UI barrel pulls modules that import `next-intl/navigation`,
// which does not resolve cleanly under Vitest without this stub.
vi.mock('@/i18n/navigation', () => {
  const Link = ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>;
  return {
    Link,
    redirect: vi.fn(),
    usePathname: () => '/en/test',
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    getPathname: () => '/en/test',
    localizeHref: (_locale: string, href: string) => href,
  };
});

// Mock next/link
vi.mock('next/link', () => {
  const Link = ({ children, href }: { children: ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  return { default: Link };
});

// Mock @auth/drizzle-adapter to avoid ESM issues
vi.mock('@auth/drizzle-adapter', () => ({
  DrizzleAdapter: vi.fn(() => ({})),
}));

// Mock next-auth to avoid ESM issues with drizzle-adapter
vi.mock('next-auth', () => {
  const mockAuth = vi.fn().mockResolvedValue(null);
  return {
    __esModule: true,
    default: vi.fn(() => ({
      handlers: { GET: vi.fn(), POST: vi.fn() },
      signIn: vi.fn(),
      signOut: vi.fn(),
      auth: mockAuth,
    })),
  };
});

// Mock the shared auth module
vi.mock('@/shared/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}));

const originalError = console.error;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: An update to') ||
        args[0].includes('act(...)'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
