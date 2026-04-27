import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { localeNames } from '@/i18n/config';
import { i18n } from './i18n';

export const i18nUI = defineI18nUI(i18n, {
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

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: locale === 'zh-CN' ? 'Afenda 文档' : 'Afenda Docs',
    },
  };
}
