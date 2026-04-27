import {
  compileI18nCatalogs,
  normalizeI18nSourceAndFallbackCatalogs,
  validateI18nCatalogs,
  writeFallbackManifest,
} from './lib/i18n-catalog-core.mjs';

const normalizeResult = normalizeI18nSourceAndFallbackCatalogs();
if (normalizeResult.errors.length > 0) {
  console.error('i18n normalize failed:\n');
  for (const error of normalizeResult.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (process.argv.includes('--verbose') || process.env.VERBOSE) {
  console.log('i18n normalized & stable-formatted:');
  for (const p of normalizeResult.wrote) {
    console.log(`- ${p}`);
  }
}

writeFallbackManifest();
console.log('i18n protected fallback manifest written.');

const compile = compileI18nCatalogs();
if (compile.errors.length > 0) {
  console.error('i18n compile failed:\n');
  for (const error of compile.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const validation = validateI18nCatalogs();
if (validation.errors.length > 0) {
  console.error('i18n validation failed after sync:\n');
  for (const error of validation.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('i18n sync complete. Active locales: %s', validation.model.activeLocales.join(', '));
