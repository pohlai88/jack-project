import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '@/docs/runtime/source';

export const { GET } = createFromSource(source, {
  localeMap: {
    en: 'english',
    'zh-CN': 'english',
    vi: 'english',
    ms: 'english',
  },
});
