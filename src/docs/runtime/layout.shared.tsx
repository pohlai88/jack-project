import { defineI18nOpenAPI } from 'fumadocs-openapi/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';

import type { BaseLayoutProps } from '@/docs/ui/layouts/shared';
import { localeNames } from '@/i18n/config';

import { i18n } from './i18n';

const docsLocales = ['en', 'zh-CN', 'vi', 'ms', 'es', 'id', 'th'] as const;

type DocsLocale = (typeof docsLocales)[number];

const localeDisplayNames = Object.fromEntries(
  docsLocales.map((locale) => [
    locale,
    {
      displayName: localeNames[locale],
    },
  ]),
) as Record<DocsLocale, { displayName: string }>;

const openApiLocaleOverrides = Object.fromEntries(docsLocales.map((locale) => [locale, {}])) as Record<
  DocsLocale,
  Record<string, never>
>;

const docsNavTitles: Record<DocsLocale, string> = {
  en: 'Afenda Docs',
  'zh-CN': 'Afenda 文档',
  vi: 'Tài liệu Afenda',
  ms: 'Dokumentasi Afenda',
  es: 'Documentación de Afenda',
  id: 'Dokumentasi Afenda',
  th: 'เอกสาร Afenda',
};

const baseI18nUI = defineI18nUI(i18n, localeDisplayNames);

/**
 * Fumadocs UI shell + OpenAPI playground labels.
 *
 * Locale overrides intentionally stay empty until API UI labels are translated.
 */
export const i18nUI = defineI18nOpenAPI(baseI18nUI, openApiLocaleOverrides);

export function baseOptions(locale: string): BaseLayoutProps {
  const docsLocale = docsLocales.includes(locale as DocsLocale) ? (locale as DocsLocale) : 'en';

  return {
    nav: {
      title: docsNavTitles[docsLocale],
    },
  };
}
