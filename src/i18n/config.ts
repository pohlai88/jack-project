import { activeLocales, localeRegistry, defaultLocale as registryDefaultLocale } from './locale-registry';

// `activeLocales` is the single list of runtime locales exposed by the app.
export const locales = activeLocales;
export type Locale = (typeof activeLocales)[number];

export const defaultLocale: Locale = registryDefaultLocale;

/** Used by next-intl formatters and `useTimeZone` when no other zone is set. */
export const defaultTimeZone = 'UTC';

export const localeNames: Record<Locale, string> = {
  en: localeRegistry.en.name,
  'zh-CN': localeRegistry['zh-CN'].name,
  vi: localeRegistry.vi.name,
  ms: localeRegistry.ms.name,
  es: localeRegistry.es.name,
  id: localeRegistry.id.name,
  th: localeRegistry.th.name,
};

// Cookie name for storing user's locale preference.
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
