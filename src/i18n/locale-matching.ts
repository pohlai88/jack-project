type LocaleMatchingOptions = {
  locales: readonly string[];
  defaultLocale: string;
};

function normalizeLocale(locale: string): string {
  return locale.trim().toLowerCase();
}

export function resolveConfiguredLocale(input: string | null | undefined, options: LocaleMatchingOptions): string {
  if (!input) {
    return options.defaultLocale;
  }

  const candidate = input.trim();
  if (!candidate) {
    return options.defaultLocale;
  }

  const exactMatch = options.locales.find((locale) => locale === candidate);
  if (exactMatch) {
    return exactMatch;
  }

  const normalizedCandidate = normalizeLocale(candidate);
  const normalizedExactMatch = options.locales.find((locale) => normalizeLocale(locale) === normalizedCandidate);
  if (normalizedExactMatch) {
    return normalizedExactMatch;
  }

  const [languageSubtag] = normalizedCandidate.split('-');
  if (!languageSubtag || normalizedCandidate === languageSubtag) {
    return options.defaultLocale;
  }

  const languageOnlyMatch = options.locales.find((locale) => normalizeLocale(locale) === languageSubtag);
  if (languageOnlyMatch) {
    return languageOnlyMatch;
  }

  return options.defaultLocale;
}
