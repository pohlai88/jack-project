import { describe, expect, it } from 'vitest';

import { DEFAULT_LLM_EXPORT_LOCALE, resolveLlmsExportLocale } from '../docs-llm-locale';

describe('resolveLlmsExportLocale', () => {
  it('defaults invalid or missing locale to English', () => {
    expect(resolveLlmsExportLocale(undefined)).toBe(DEFAULT_LLM_EXPORT_LOCALE);
    expect(resolveLlmsExportLocale(null)).toBe(DEFAULT_LLM_EXPORT_LOCALE);
    expect(resolveLlmsExportLocale('')).toBe(DEFAULT_LLM_EXPORT_LOCALE);
    expect(resolveLlmsExportLocale('xx')).toBe(DEFAULT_LLM_EXPORT_LOCALE);
  });

  it('accepts active locales', () => {
    expect(resolveLlmsExportLocale('vi')).toBe('vi');
    expect(resolveLlmsExportLocale('zh-CN')).toBe('zh-CN');
    expect(resolveLlmsExportLocale('ms')).toBe('ms');
  });
});
