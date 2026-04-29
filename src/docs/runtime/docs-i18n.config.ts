import { defineI18n } from 'fumadocs-core/i18n';

import { defaultLocale, locales } from '@/i18n/config';

const SUPPORTED_LANGUAGES = Object.freeze([...locales]);

assertDefaultLocaleIsSupported(defaultLocale, SUPPORTED_LANGUAGES);
assertLocalesAreUnique(SUPPORTED_LANGUAGES);

/** Canonical Fumadocs i18n configuration for the docs runtime. */
export const i18n = defineI18n({
  defaultLanguage: defaultLocale,
  fallbackLanguage: defaultLocale,
  languages: [...SUPPORTED_LANGUAGES],
  parser: 'dir',
});

function assertDefaultLocaleIsSupported(defaultLocale: string, supported: readonly string[]): void {
  if (!supported.includes(defaultLocale)) {
    throw new Error(
      [
        '[docs:i18n] Invalid configuration:',
        `defaultLocale "${defaultLocale}" is not included in supported locales.`,
        `Supported: [${supported.join(', ')}]`,
      ].join(' '),
    );
  }
}

function assertLocalesAreUnique(supported: readonly string[]): void {
  const duplicates = supported.filter((locale, index) => supported.indexOf(locale) !== index);

  if (duplicates.length > 0) {
    throw new Error(`[docs:i18n] Duplicate locale(s): ${Array.from(new Set(duplicates)).join(', ')}`);
  }
}
