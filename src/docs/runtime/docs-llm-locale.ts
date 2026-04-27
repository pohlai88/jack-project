import { routing } from '@/i18n/routing';

/** Default locale for bulk LLM exports when `locale` is missing or invalid. */
export const DEFAULT_LLM_EXPORT_LOCALE = 'en';

const supportedLocales = new Set<string>(routing.locales);

export function resolveLlmsExportLocale(requested: string | null | undefined): string {
  if (requested && supportedLocales.has(requested)) {
    return requested;
  }
  return DEFAULT_LLM_EXPORT_LOCALE;
}
