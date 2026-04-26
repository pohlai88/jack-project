import { type Locale, localeNames, locales } from './config';

export const activatedLocaleValues = locales;

export type ActivatedLocale = (typeof activatedLocaleValues)[number];

export const activatedLocaleOptions = activatedLocaleValues.map((value) => ({
  value,
  label: localeNames[value],
})) satisfies ReadonlyArray<{
  value: Locale;
  label: string;
}>;
