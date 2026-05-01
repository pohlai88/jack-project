import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '@/docs/runtime/docs-source.registry';
import type { Locale } from '@/i18n/config';

const searchLocaleMap = {
  en: 'english',
  'zh-CN': 'english',
  vi: 'english',
  ms: 'english',
  es: 'english',
  id: 'english',
  th: 'english',
} as const satisfies Record<Locale, 'english'>;

export const { GET } = createFromSource(source, {
  localeMap: searchLocaleMap,
});
