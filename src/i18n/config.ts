import { activeLocales, localeRegistry, defaultLocale as registryDefaultLocale } from './locale-registry';

// Internationalization configuration.
// next-intl uses cookie-based locale detection rather than URL prefixes,
// preserving the existing tenant routing structure.
// `activeLocales` is the single list of supported runtime UI locales.
export const locales = activeLocales;
export type Locale = (typeof activeLocales)[number];

export const defaultLocale: Locale = registryDefaultLocale;

/** Used by next-intl formatters and `useTimeZone` when no other zone is set. */
export const defaultTimeZone = 'UTC';

export const localeNames: Record<Locale, string> = {
  en: localeRegistry.en.name,
  es: localeRegistry.es.name,
  vi: localeRegistry.vi.name,
  ms: localeRegistry.ms.name,
  'zh-CN': localeRegistry['zh-CN'].name,
};

// Cookie name for storing user's locale preference
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
