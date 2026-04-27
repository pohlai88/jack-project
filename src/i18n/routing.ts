import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './config';

/**
 * App-wide routing config for next-intl.
 * `localePrefix: "never"` keeps cookie-based locale detection without `/en/...` URL segments
 * (tenant and app routes stay unchanged).
 */
export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'never',
});
