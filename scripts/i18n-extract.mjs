import { extractI18nSource } from './lib/i18n-catalog-core.mjs';

const result = extractI18nSource();

if (result.errors.length > 0) {
  console.error('i18n extract failed:\n');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`i18n source catalog ready: ${result.keyCount} keys in src/i18n/catalogs/source/en.json`);
