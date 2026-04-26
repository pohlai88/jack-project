import { compileI18nCatalogs } from './lib/i18n-catalog-core.mjs';

const check = process.argv.includes('--check');
const result = compileI18nCatalogs({ check });

if (result.errors.length > 0) {
  console.error(`i18n compile ${check ? 'check ' : ''}failed:\n`);
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const locales = [...result.outputs.keys()].join(', ');
console.log(check ? `i18n compiled runtime output is current: ${locales}` : `i18n compiled runtime output: ${locales}`);
