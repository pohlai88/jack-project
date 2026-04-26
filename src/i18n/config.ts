import { localeRegistry, defaultLocale as registryDefaultLocale } from './locale-registry';

// Internationalization configuration.
// next-intl uses cookie-based locale detection rather than URL prefixes,
// preserving the existing tenant routing structure.
export const locales = ['en', 'es', 'vi', 'ms', 'zh-CN'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = registryDefaultLocale;

export const localeNames: Record<Locale, string> = {
  en: localeRegistry.en.name,
  es: localeRegistry.es.name,
  vi: localeRegistry.vi.name,
  ms: localeRegistry.ms.name,
  'zh-CN': localeRegistry['zh-CN'].name,
};

// Cookie name for storing user's locale preference
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
