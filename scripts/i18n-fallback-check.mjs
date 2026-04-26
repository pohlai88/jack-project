import { checkI18nFallbacks, writeFallbackManifest } from './lib/i18n-catalog-core.mjs';

if (process.argv.includes('--write-manifest')) {
  writeFallbackManifest();
  console.log('i18n protected fallback manifest written.');
  process.exit(0);
}

const result = checkI18nFallbacks();

if (result.errors.length > 0) {
  console.error('i18n fallback check failed:\n');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`i18n fallback check passed for active locales: ${result.model.activeLocales.join(', ')}`);
