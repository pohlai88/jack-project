import { defineI18nOpenAPI } from 'fumadocs-openapi/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { localeNames } from '@/i18n/config';
import { i18n } from './i18n';

const baseI18nUI = defineI18nUI(i18n, {
  en: {
    displayName: localeNames.en,
  },
  'zh-CN': {
    displayName: localeNames['zh-CN'],
  },
  vi: {
    displayName: localeNames.vi,
  },
  ms: {
    displayName: localeNames.ms,
  },
  es: {
    displayName: localeNames.es,
  },
  id: {
    displayName: localeNames.id,
  },
  th: {
    displayName: localeNames.th,
  },
});

/**
 * Fumadocs UI shell + OpenAPI playground labels (`fumadocs-openapi` merges into the same provider config).
 * Locales omit overrides to use package defaults; add keys per locale when translating API UI.
 *
 * @see https://www.fumadocs.dev/docs/ui (default theme) — OpenAPI UI strings:
 *      https://www.fumadocs.dev/docs/integrations/openapi/api-page
 */
export const i18nUI = defineI18nOpenAPI(baseI18nUI, {
  en: {},
  'zh-CN': {},
  vi: {},
  ms: {},
  es: {},
  id: {},
  th: {},
});

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: locale === 'zh-CN' ? 'Afenda 文档' : 'Afenda Docs',
    },
  };
}
