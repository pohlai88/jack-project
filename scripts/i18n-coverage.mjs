import { calculateI18nCoverage, formatCoverage } from './lib/i18n-catalog-core.mjs';

const result = calculateI18nCoverage();

if (result.errors.length > 0) {
  console.error('i18n coverage failed:\n');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('i18n coverage:');
console.log(formatCoverage(result.records));
