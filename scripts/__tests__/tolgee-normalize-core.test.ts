import { describe, expect, it } from 'vitest';

import { expandDotKeys, resolveCatalogLocale, unwrapTolgeeLocaleWrapper } from '@scripts-lib/tolgee-normalize-core';

describe('unwrapTolgeeLocaleWrapper', () => {
  it('unwraps single zh-CN wrapper', () => {
    const inner = { common: { save: 'S' } };
    const { messages, detectedLocale } = unwrapTolgeeLocaleWrapper({ 'zh-CN': inner }, null);
    expect(detectedLocale).toBe('zh-CN');
    expect(messages).toEqual(inner);
  });

  it('leaves nested export unchanged when multiple top-level keys', () => {
    const obj = { common: { save: 'S' }, tenant: { x: 'y' } };
    const { messages, detectedLocale } = unwrapTolgeeLocaleWrapper(obj, null);
    expect(detectedLocale).toBeNull();
    expect(messages).toEqual(obj);
  });
});

describe('expandDotKeys', () => {
  it('expands dotted keys', () => {
    expect(expandDotKeys({ 'a.b': 'v', c: 'w' })).toEqual({ a: { b: 'v' }, c: 'w' });
  });
});

describe('resolveCatalogLocale', () => {
  const map = { 'zh-Hans-CN': 'zh-CN', en: 'en' };

  it('maps Tolgee tag to catalog locale', () => {
    expect(resolveCatalogLocale('zh-Hans-CN', map, ['en', 'zh-CN'])).toEqual({ catalogLocale: 'zh-CN' });
  });

  it('passes through active stem when unmapped', () => {
    expect(resolveCatalogLocale('vi', map, ['en', 'vi'])).toEqual({ catalogLocale: 'vi' });
  });

  it('skips unknown stem', () => {
    const r = resolveCatalogLocale('unknown', map, ['en']);
    expect('skip' in r).toBe(true);
  });
});
