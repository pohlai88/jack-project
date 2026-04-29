import { routing } from '@/i18n/routing';

import { DOCS_DEFAULT_LOCALE } from './docs-runtime.contract';

/**
 * Canonical fallback locale for LLM export routes.
 *
 * English remains the canonical source for machine-readable exports.
 */
export const DEFAULT_LLM_EXPORT_LOCALE = DOCS_DEFAULT_LOCALE;

const SUPPORTED_LLM_EXPORT_LOCALES = new Set<string>(routing.locales);

export function resolveLlmsExportLocale(requestedLocale: string | null | undefined): string {
  const normalizedLocale = requestedLocale?.trim();

  if (normalizedLocale && SUPPORTED_LLM_EXPORT_LOCALES.has(normalizedLocale)) {
    return normalizedLocale;
  }

  return DEFAULT_LLM_EXPORT_LOCALE;
}
