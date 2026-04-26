import { resolveConfiguredLocale } from '../locale-matching';

describe('resolveConfiguredLocale', () => {
  it('returns exact configured language-only locales', () => {
    expect(resolveConfiguredLocale('en', { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('en');
    expect(resolveConfiguredLocale('es', { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('es');
  });

  it('returns exact configured regional locales', () => {
    expect(resolveConfiguredLocale('zh-CN', { locales: ['en', 'zh-CN'], defaultLocale: 'en' })).toBe('zh-CN');
  });

  it('normalizes case for exact regional locale matches', () => {
    expect(resolveConfiguredLocale('zh-cn', { locales: ['en', 'zh-CN'], defaultLocale: 'en' })).toBe('zh-CN');
  });

  it('falls back from regional inputs to configured language-only locales', () => {
    expect(resolveConfiguredLocale('vi-VN', { locales: ['en', 'vi'], defaultLocale: 'en' })).toBe('vi');
    expect(resolveConfiguredLocale('ms-MY', { locales: ['en', 'ms'], defaultLocale: 'en' })).toBe('ms');
    expect(resolveConfiguredLocale('id-ID', { locales: ['en', 'id'], defaultLocale: 'en' })).toBe('id');
    expect(resolveConfiguredLocale('th-TH', { locales: ['en', 'th'], defaultLocale: 'en' })).toBe('th');
  });

  it('does not infer regional locales from language-only inputs', () => {
    expect(resolveConfiguredLocale('zh', { locales: ['en', 'zh-CN'], defaultLocale: 'en' })).toBe('en');
  });

  it('falls back to the default locale for unsupported locales', () => {
    expect(resolveConfiguredLocale('fr-FR', { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('en');
  });

  it('falls back to the default locale for nullish or empty input', () => {
    expect(resolveConfiguredLocale(null, { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('en');
    expect(resolveConfiguredLocale(undefined, { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('en');
    expect(resolveConfiguredLocale('', { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('en');
    expect(resolveConfiguredLocale('   ', { locales: ['en', 'es'], defaultLocale: 'en' })).toBe('en');
  });
});
