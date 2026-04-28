import { defineRouting } from 'next-intl/routing';

import { resolveSharedCookieDomain } from '@/shared/lib/auth-cookie-domain';

import { defaultLocale, LOCALE_COOKIE_NAME, locales } from './config';
import { LOCALE_COOKIE_MAX_AGE_SECONDS } from './locale-cookie';

/** `NEXT_PUBLIC_*` only — safe when this module is bundled for the client (no server `env`). */
const sharedCookieDomain = resolveSharedCookieDomain(
  undefined,
  undefined,
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN,
);

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  ...(sharedCookieDomain
    ? {
        localeCookie: {
          name: LOCALE_COOKIE_NAME,
          sameSite: 'lax' as const,
          path: '/',
          maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
          domain: sharedCookieDomain,
        },
      }
    : {}),
});
