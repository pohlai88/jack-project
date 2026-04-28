import { runI18nInventoryCheck } from './lib/i18n-inventory-check-core.mjs';

const { errors } = runI18nInventoryCheck();

if (errors.length > 0) {
  console.error('i18n inventory check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('i18n inventory check passed for source, optional generated, and protected fallback catalogs');
