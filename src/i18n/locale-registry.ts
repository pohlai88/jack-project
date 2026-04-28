export const defaultLocale = 'en' as const;

export const activeLocales = ['en', 'zh-CN', 'vi', 'ms', 'es', 'id', 'th'] as const;
export const inactiveLocales = [] as const;

export type ActiveLocale = (typeof activeLocales)[number];
export type InactiveLocale = (typeof inactiveLocales)[number];
export type RegisteredLocale = ActiveLocale | InactiveLocale;

export const localeAliases = {
  'ms-MY': 'ms',
  'id-ID': 'id',
} as const;

/** Per-locale BCP 47 tag used for catalog filenames (`*.json`) and tooling. */
export const localeRegistry = {
  en: {
    name: 'English',
    status: 'active',
    catalogLocale: 'en',
    fallbackChain: ['en'],
    protectedFallback: false,
  },
  es: {
    name: 'Español',
    status: 'active',
    catalogLocale: 'es',
    fallbackChain: ['es', 'en'],
    protectedFallback: true,
  },
  vi: {
    name: 'Tiếng Việt',
    status: 'active',
    catalogLocale: 'vi',
    fallbackChain: ['vi', 'en'],
    protectedFallback: true,
  },
  ms: {
    name: 'Bahasa Melayu',
    status: 'active',
    catalogLocale: 'ms',
    fallbackChain: ['ms', 'en'],
    protectedFallback: true,
  },
  'zh-CN': {
    name: '简体中文',
    status: 'active',
    catalogLocale: 'zh-CN',
    fallbackChain: ['zh-CN', 'en'],
    protectedFallback: true,
  },
  id: {
    name: 'Bahasa Indonesia',
    status: 'active',
    catalogLocale: 'id',
    fallbackChain: ['id', 'en'],
    protectedFallback: true,
  },
  th: {
    name: 'ไทย',
    status: 'active',
    catalogLocale: 'th',
    fallbackChain: ['th', 'en'],
    protectedFallback: true,
  },
} as const;

export const protectedFallbackLocales = [
  'es',
  'id',
  'ms',
  'th',
  'vi',
  'zh-CN',
] as const satisfies ReadonlyArray<RegisteredLocale>;
