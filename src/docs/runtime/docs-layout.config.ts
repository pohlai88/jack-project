import { defineI18nOpenAPI } from 'fumadocs-openapi/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import type { RootProviderProps } from 'fumadocs-ui/provider/next';
import { createElement } from 'react';
import { localeNames, locales } from '@/i18n/config';

import { i18n } from './docs-i18n.config';
import {
  DOCS_DEFAULT_LOCALE,
  DOCS_LLM_FULL_PATH,
  DOCS_LLM_INDEX_PATH,
  DOCS_ROUTE_BASE_PATH,
  DOCS_SEARCH_API_PATH,
} from './docs-runtime.contract';

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

type DocsSearchOptions = NonNullable<RootProviderProps['search']>;

export function baseOptions(locale: string): BaseLayoutProps {
  const docsLocale = resolveDocsLocale(locale);

  return {
    nav: {
      url: `/${docsLocale}${DOCS_ROUTE_BASE_PATH}`,
      title: createElement(
        'span',
        { className: 'inline-flex items-center gap-2' },
        createElement('img', {
          src: '/brand/afenda/afenda-icon-transparent.svg',
          alt: '',
          width: 24,
          height: 24,
          className: 'afenda-theme-light h-6 w-6 shrink-0 object-contain',
          'aria-hidden': true,
        }),
        createElement('img', {
          src: '/brand/afenda/afenda-icon-inline-dark.svg',
          alt: '',
          width: 24,
          height: 24,
          className: 'afenda-theme-dark h-6 w-6 shrink-0 object-contain',
          'aria-hidden': true,
        }),
        createElement('span', null, docsNavTitles[docsLocale]),
      ),
    },
  };
}

export function docsSearchOptions(locale: string): DocsSearchOptions {
  const docsLocale = resolveDocsLocale(locale);

  return {
    enabled: true,
    preload: true,
    links: [
      [docsNavTitles[docsLocale], `/${docsLocale}${DOCS_ROUTE_BASE_PATH}`],
      ['Brand guidelines', `/${docsLocale}${DOCS_ROUTE_BASE_PATH}/curated/brand-guidelines`],
      ['LLMs index', DOCS_LLM_INDEX_PATH],
      ['Full LLM export', DOCS_LLM_FULL_PATH],
    ],
    options: {
      type: 'fetch',
      api: DOCS_SEARCH_API_PATH,
      delayMs: 120,
    },
  };
}

function resolveDocsLocale(locale: string): DocsLocale {
  return isDocsLocale(locale) ? locale : DOCS_DEFAULT_LOCALE;
}

function isDocsLocale(locale: string): locale is DocsLocale {
  return docsLocales.includes(locale as DocsLocale);
}
