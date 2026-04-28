import { afterEach, describe, expect, it } from 'vitest';

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

// @ts-expect-error script core is ESM without generated declarations.
import * as catalogCore from '../lib/i18n-catalog-core.mjs';

const {
  alignLocaleCatalogToCanonicalShape,
  compileI18nCatalogs,
  readLocaleModel,
  validateI18nCatalogs,
  writeFallbackManifest,
} = catalogCore;

const tempRoots: string[] = [];

function toJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeFixtureFile(root: string, file: string, content: string) {
  const fullPath = join(root, file);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
}

function registrySource(configLocales = "'en', 'es'") {
  return `export const defaultLocale = 'en' as const;
export const activeLocales = [${configLocales}] as const;
export const inactiveLocales = ['id', 'th'] as const;
export const localeAliases = { 'ms-MY': 'ms', 'id-ID': 'id' } as const;
export const localeRegistry = {
  en: { name: 'English', status: 'active', catalogLocale: 'en', fallbackChain: ['en'], protectedFallback: false },
  es: { name: 'Español', status: 'active', catalogLocale: 'es', fallbackChain: ['es', 'en'], protectedFallback: true },
  id: { name: 'Bahasa Indonesia', status: 'inactive', catalogLocale: 'id', fallbackChain: ['id', 'en'], protectedFallback: true },
  th: { name: 'ไทย', status: 'inactive', catalogLocale: 'th', fallbackChain: ['th', 'en'], protectedFallback: true },
} as const;
`;
}

function configSource(configLocales = "'en', 'es'") {
  return `export const locales = [${configLocales}] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeNames: Record<Locale, string> = { en: 'English', es: 'Español' };
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
`;
}

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'afenda-i18n-catalog-'));
  tempRoots.push(root);

  writeFixtureFile(root, 'src/i18n/locale-registry.ts', registrySource());
  writeFixtureFile(root, 'src/i18n/config.ts', configSource());
  writeFixtureFile(
    root,
    'src/i18n/catalogs/source/en.json',
    toJson({
      common: {
        hello: 'Hello {name}',
        rich: 'Open <link>{label}</link>',
        count: '{count, plural, one {One item} other {# items}}',
      },
    }),
  );
  writeFixtureFile(
    root,
    'src/i18n/catalogs/fallback/es.json',
    toJson({
      common: {
        hello: 'Hola {name}',
        rich: 'Abrir <link>{label}</link>',
        count: '{count, plural, one {Un elemento} other {# elementos}}',
      },
    }),
  );
  writeFallbackManifest({ root });
  compileI18nCatalogs({ root });

  return root;
}

afterEach(() => {
  delete process.env.I18N_ALLOW_GENERATED_UPDATE;
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('i18n catalog core', () => {
  it('aligns locale catalog to canonical key order and drops extra keys', () => {
    const canonical = { a: { x: '1', y: '2' }, b: '3' };
    const input = { b: 'Tres', a: { y: 'dos', x: 'uno' }, z: 'extra' };
    const out = alignLocaleCatalogToCanonicalShape(canonical, input);
    expect(out).toEqual({ a: { x: 'uno', y: 'dos' }, b: 'Tres' });
  });

  it('aligns with English leaves where translation is empty', () => {
    const canonical = { t: 'Hello' };
    expect(alignLocaleCatalogToCanonicalShape(canonical, { t: '   ' })).toEqual({ t: 'Hello' });
  });

  it('parses the locale registry contract', () => {
    const root = createFixture();
    const model = readLocaleModel({ root, requireRegistry: true });

    expect(model.activeLocales).toEqual(['en', 'es']);
    expect(model.inactiveLocales).toEqual(['id', 'th']);
    expect(model.localeAliases).toEqual({ 'ms-MY': 'ms', 'id-ID': 'id' });
    expect(model.localeRegistry.es.fallbackChain).toEqual(['es', 'en']);
  });

  it('compiles generated messages before fallback and source fallback', () => {
    const root = createFixture();
    writeFixtureFile(
      root,
      'src/i18n/catalogs/source/en.json',
      toJson({
        common: {
          generatedWins: 'Source',
          fallbackFills: 'Source',
          sourceFills: 'Source',
        },
      }),
    );
    writeFixtureFile(
      root,
      'src/i18n/catalogs/fallback/es.json',
      toJson({
        common: {
          generatedWins: 'Fallback',
          fallbackFills: 'Fallback',
          sourceFills: 'Source',
        },
      }),
    );
    writeFixtureFile(
      root,
      'src/i18n/catalogs/generated/es.json',
      toJson({
        common: {
          generatedWins: 'Generated',
        },
      }),
    );

    compileI18nCatalogs({ root });

    const runtime = JSON.parse(readFileSync(join(root, 'src/i18n/messages/es.json'), 'utf8'));
    expect(runtime.common).toEqual({
      generatedWins: 'Generated',
      fallbackFills: 'Fallback',
      sourceFills: 'Source',
    });
  });

  it('detects ICU placeholder, tag, and plural/select mismatches', () => {
    const root = createFixture();
    writeFixtureFile(
      root,
      'src/i18n/catalogs/fallback/es.json',
      toJson({
        common: {
          hello: 'Hola {fullName}',
          rich: 'Abrir <button>{label}</button>',
          count: '{total, plural, one {Un elemento} other {# elementos}}',
        },
      }),
    );

    const errors = validateI18nCatalogs({ root }).errors;

    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('placeholder mismatch')]));
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('rich-text tag mismatch')]));
    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('plural/select mismatch')]));
  });

  it('detects unsupported locale catalogs', () => {
    const root = createFixture();
    writeFixtureFile(root, 'src/i18n/catalogs/generated/fr.json', toJson({ common: { hello: 'Bonjour {name}' } }));

    expect(validateI18nCatalogs({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('unsupported locale "fr"')]),
    );
  });

  it('guards generated catalog edits without automation flag', () => {
    const root = createFixture();
    const fallback = JSON.parse(readFileSync(join(root, 'src/i18n/catalogs/fallback/es.json'), 'utf8'));
    writeFixtureFile(root, 'src/i18n/catalogs/generated/es.json', toJson(fallback));
    execFileSync('git', ['init'], { cwd: root, stdio: 'pipe' });

    expect(validateI18nCatalogs({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('reserved machine output')]),
    );
  });

  it('guards protected fallback hashes', () => {
    const root = createFixture();
    writeFixtureFile(
      root,
      'src/i18n/catalogs/fallback/es.json',
      toJson({
        common: {
          hello: 'Changed {name}',
          rich: 'Abrir <link>{label}</link>',
          count: '{count, plural, one {Un elemento} other {# elementos}}',
        },
      }),
    );

    expect(validateI18nCatalogs({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('protected fallback manifest hash')]),
    );
  });

  it('detects inactive locale runtime exposure', () => {
    const root = createFixture();
    writeFixtureFile(root, 'src/i18n/config.ts', configSource("'en', 'es', 'id'"));

    expect(validateI18nCatalogs({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('Inactive locale id is exposed at runtime')]),
    );
  });
});
