import { defineI18nOpenAPI } from 'fumadocs-openapi/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';

import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { localeNames, locales } from '@/i18n/config';

import { i18n } from './docs-i18n.config';
import { DOCS_DEFAULT_LOCALE, DOCS_ROUTE_BASE_PATH } from './docs-runtime.contract';

const docsLocales = Object.freeze([...locales]);

type DocsLocale = (typeof docsLocales)[number];

const docsNavTitles = {
  en: 'Afenda Docs',
  'zh-CN': 'Afenda 文档',
  vi: 'Tài liệu Afenda',
  ms: 'Dokumentasi Afenda',
  es: 'Documentación de Afenda',
  id: 'Dokumentasi Afenda',
  th: 'เอกสาร Afenda',
} satisfies Record<DocsLocale, string>;

const localeDisplayNames = Object.fromEntries(
  docsLocales.map((locale) => [
    locale,
    {
      displayName: localeNames[locale] ?? locale,
    },
  ]),
) as Record<DocsLocale, { displayName: string }>;

const openApiLocaleOverrides = Object.fromEntries(docsLocales.map((locale) => [locale, {}])) as Record<
  DocsLocale,
  Record<string, never>
>;

const baseI18nUI = defineI18nUI(i18n, localeDisplayNames);

/** Fumadocs UI shell + OpenAPI playground labels. */
export const i18nUI = defineI18nOpenAPI(baseI18nUI, openApiLocaleOverrides);

export function baseOptions(locale: string): BaseLayoutProps {
  const docsLocale = resolveDocsLocale(locale);

  return {
    nav: {
      url: `/${docsLocale}${DOCS_ROUTE_BASE_PATH}`,
      title: docsNavTitles[docsLocale],
    },
  };
}

function resolveDocsLocale(locale: string): DocsLocale {
  return isDocsLocale(locale) ? locale : DOCS_DEFAULT_LOCALE;
}

function isDocsLocale(locale: string): locale is DocsLocale {
  return docsLocales.includes(locale as DocsLocale);
}
