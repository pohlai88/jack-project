import { validateI18nCatalogs } from './lib/i18n-catalog-core.mjs';

const result = validateI18nCatalogs();

if (result.errors.length > 0) {
  console.error('i18n validation failed:\n');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`i18n validation passed for active locales: ${result.model.activeLocales.join(', ')}`);
