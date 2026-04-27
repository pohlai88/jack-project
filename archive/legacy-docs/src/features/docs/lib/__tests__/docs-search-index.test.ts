import { getAllDocSlugs } from '../docs-content';
import { buildSearchIndex, type SearchIndexItem } from '../docs-search-index';

function expectDocsUrlShape(item: SearchIndexItem, locale: string) {
  expect(item.url).toBe(item.slug ? `/docs/${item.slug}` : '/docs');
  expect(item.url).not.toMatch(new RegExp(`^/${locale}/docs(?:/|$)`));
}

function expectNativeSearchIndex(locale: 'vi' | 'ms' | 'zh-CN') {
  const localeSlugs = getAllDocSlugs(locale);
  const index = buildSearchIndex(locale);

  expect(localeSlugs.length).toBeGreaterThan(0);
  expect(index).toHaveLength(localeSlugs.length);

  for (const item of index) {
    expect(item.requestedLocale).toBe(locale);
    expect(item.resolvedLocale).toBe(locale);
    expect(item.isFallback).toBe(false);
    expectDocsUrlShape(item, locale);
  }
}

describe('buildSearchIndex', () => {
  it('indexes native Vietnamese docs for Vietnamese search', () => {
    expectNativeSearchIndex('vi');
  });

  it('indexes native Malay docs for Malay search', () => {
    expectNativeSearchIndex('ms');
  });

  it('indexes native Simplified Chinese docs for Simplified Chinese search', () => {
    expectNativeSearchIndex('zh-CN');
  });

  it('keeps Spanish search on native Spanish docs', () => {
    const spanishSlugs = getAllDocSlugs('es');
    const index = buildSearchIndex('es');

    expect(spanishSlugs.length).toBeGreaterThan(0);
    expect(index).toHaveLength(spanishSlugs.length);

    for (const item of index) {
      expect(item.requestedLocale).toBe('es');
      expect(item.resolvedLocale).toBe('es');
      expect(item.isFallback).toBe(false);
      expectDocsUrlShape(item, 'es');
    }
  });

  it('keeps English search on native English docs', () => {
    const englishSlugs = getAllDocSlugs('en');
    const index = buildSearchIndex('en');

    expect(index).toHaveLength(englishSlugs.length);

    for (const item of index) {
      expect(item.requestedLocale).toBe('en');
      expect(item.resolvedLocale).toBe('en');
      expect(item.isFallback).toBe(false);
      expectDocsUrlShape(item, 'en');
    }
  });

  it('does not expose inactive or unsupported locales through docs search', () => {
    expect(buildSearchIndex('id')).toEqual([]);
    expect(buildSearchIndex('th')).toEqual([]);
    expect(buildSearchIndex('fr')).toEqual([]);
  });
});
