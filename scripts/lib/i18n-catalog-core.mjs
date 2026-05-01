import { parse, TYPE } from '@formatjs/icu-messageformat-parser';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

export const I18N_PATHS = {
  registry: 'src/i18n/locale-registry.ts',
  config: 'src/i18n/config.ts',
  sourceDir: 'src/i18n/catalogs/source',
  fallbackDir: 'src/i18n/catalogs/fallback',
  generatedDir: 'src/i18n/catalogs/generated',
  messagesDir: 'src/i18n/messages',
  fallbackManifest: 'src/i18n/catalogs/fallback/MANIFEST.json',
};

/**
 * Locale registry parsing: `parseExportLiteral` regex-captures `export const <name> = (...) as const;` from
 * `locale-registry.ts` and evaluates the captured literal via `vm.runInNewContext`. `readConfiguredLocales` reads
 * `config.ts` and either parses an inline `locales = [...] as const` list or, when `locales = activeLocales`, re-parses
 * the `activeLocales` tuple from the registry (bracket split). Human-facing contract: `src/i18n/README.md`.
 *
 * VM options intentionally omit `timeout`: the evaluated snippet is always read from this repo’s registry/config
 * files (bounded size). A short timeout caused flaky `i18n-catalog-core` Vitest failures under parallel CPU load
 * while evaluating the large `localeRegistry` object literal.
 */

const CANONICAL_LOCALE = 'en';
const PLATFORM_SYNC_ENV = new Set(['1', 'true', 'yes']);

function toPosixPath(path) {
  return path.replaceAll('\\', '/');
}

function normalizeText(content) {
  return content.replace(/\r\n?/g, '\n');
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(content) {
  return createHash('sha256').update(normalizeText(content)).digest('hex');
}

function readText(root, path) {
  return readFileSync(join(root, path), 'utf8');
}

function readJson(root, path, errors = []) {
  try {
    return JSON.parse(readText(root, path));
  } catch (error) {
    errors.push(`${path} is not valid JSON: ${error.message}`);
    return null;
  }
}

function writeJson(root, path, value) {
  const fullPath = join(root, path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, stableJson(value), 'utf8');
}

function listJsonFiles(root, dir) {
  const fullDir = join(root, dir);
  if (!existsSync(fullDir)) {
    return [];
  }

  return readdirSync(fullDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort()
    .map((fileName) => `${dir}/${fileName}`);
}

export function flattenMessageValues(value, prefix = '', values = []) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, nested] of Object.entries(value)) {
      flattenMessageValues(nested, prefix ? `${prefix}.${key}` : key, values);
    }
    return values;
  }

  values.push({ key: prefix, value });
  return values;
}

function getValueAtPath(value, dottedPath) {
  let current = value;
  for (const segment of dottedPath.split('.')) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = current[segment];
  }
  return current;
}

function hasUsableCatalogValue(value) {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  return true;
}

/**
 * Rebuilds a locale catalog to match the nested structure and key order of the canonical
 * (en) source. Non-empty leaves from `input` are kept; otherwise the canonical value is used.
 * Extra keys in `input` (not in canonical) are dropped. Used by `i18n:sync` to remove formatting drift.
 *
 * @param {unknown} canonical
 * @param {unknown} input
 */
export function alignLocaleCatalogToCanonicalShape(canonical, input) {
  if (Array.isArray(canonical)) {
    const inArr = Array.isArray(input) ? input : [];
    return canonical.map((item, index) => alignLocaleCatalogToCanonicalShape(item, inArr[index]));
  }

  if (canonical !== null && typeof canonical === 'object') {
    const inObj = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    return Object.fromEntries(
      Object.keys(canonical).map((key) => [key, alignLocaleCatalogToCanonicalShape(canonical[key], inObj[key])]),
    );
  }

  if (hasUsableCatalogValue(input) && (typeof input !== 'object' || input === null)) {
    return input;
  }

  return canonical;
}

/**
 * Stable-formats `en.json` and rewrites every locale file in `catalogs/fallback/`
 * (except MANIFEST) so it matches the canonical key tree, ordering, and JSON style.
 * Does not add new fallback files. Returns paths written.
 */
export function normalizeI18nSourceAndFallbackCatalogs({ root = process.cwd() } = {}) {
  const errors = [];
  const wrote = [];
  const canonical = loadCanonicalCatalog({ root, errors });

  if (!canonical) {
    return { errors, wrote };
  }

  const enPath = sourceCatalogPath();
  writeJson(root, enPath, canonical);
  wrote.push(enPath);

  for (const file of listJsonFiles(root, I18N_PATHS.fallbackDir)) {
    if (file === I18N_PATHS.fallbackManifest) {
      continue;
    }
    if (!existsSync(join(root, file))) {
      continue;
    }
    const existing = readJson(root, file, errors);
    if (!existing) {
      continue;
    }
    const aligned = alignLocaleCatalogToCanonicalShape(canonical, existing);
    writeJson(root, file, aligned);
    wrote.push(file);
  }

  return { errors, wrote };
}

function buildCatalogFromCanonical(canonical, catalogs, path = '') {
  if (canonical !== null && typeof canonical === 'object' && !Array.isArray(canonical)) {
    return Object.fromEntries(
      Object.entries(canonical).map(([key, nested]) => [
        key,
        buildCatalogFromCanonical(nested, catalogs, path ? `${path}.${key}` : key),
      ]),
    );
  }

  for (const catalog of catalogs) {
    const candidate = catalog ? getValueAtPath(catalog, path) : undefined;
    if (hasUsableCatalogValue(candidate)) {
      return candidate;
    }
  }

  return canonical;
}

function parseExportLiteral(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName} = ([\\s\\S]*?) as const;`));
  if (!match) {
    return null;
  }

  return vm.runInNewContext(`(${match[1]})`, Object.create(null));
}

export function readConfiguredLocales(root) {
  const configPath = join(root, I18N_PATHS.config);
  if (!existsSync(configPath)) {
    return [];
  }

  const config = readFileSync(configPath, 'utf8');
  const match = config.match(/export const locales = \[([^\]]+)\] as const;/);
  if (match) {
    return match[1]
      .split(',')
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }

  if (/export const locales = activeLocales;/.test(config)) {
    const registryPath = join(root, I18N_PATHS.registry);
    if (!existsSync(registryPath)) {
      return [];
    }

    const activeLocales = parseExportLiteral(readFileSync(registryPath, 'utf8'), 'activeLocales');
    return Array.isArray(activeLocales) ? activeLocales : [];
  }

  return [];
}

function readLocaleNamesFromConfig(root) {
  const configPath = join(root, I18N_PATHS.config);
  if (!existsSync(configPath)) {
    return {};
  }

  const config = readFileSync(configPath, 'utf8');
  const match = config.match(/export const localeNames: Record<Locale, string> = \{([\s\S]*?)\n\};/);
  if (!match) {
    return {};
  }

  const names = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim().replace(/,$/, '');
    const entryMatch = trimmed.match(/^(?:'([^']+)'|([A-Za-z0-9_-]+)):\s*'([^']+)'$/);
    if (entryMatch) {
      names[entryMatch[1] ?? entryMatch[2]] = entryMatch[3];
    }
  }

  return names;
}

function buildLegacyLocaleModel(root) {
  const activeLocales = readConfiguredLocales(root);
  const localeNames = readLocaleNamesFromConfig(root);
  const messageLocales = listJsonFiles(root, I18N_PATHS.messagesDir).map((path) =>
    path
      .split('/')
      .pop()
      .replace(/\.json$/, ''),
  );
  const inactiveLocales = messageLocales.filter((locale) => !activeLocales.includes(locale));
  const registry = {};

  for (const locale of [...activeLocales, ...inactiveLocales]) {
    registry[locale] = {
      name: localeNames[locale] ?? locale,
      status: activeLocales.includes(locale) ? 'active' : 'inactive',
      catalogLocale: locale,
      fallbackChain: locale === CANONICAL_LOCALE ? [CANONICAL_LOCALE] : [locale, CANONICAL_LOCALE],
      protectedFallback: locale !== CANONICAL_LOCALE,
    };
  }

  return {
    activeLocales,
    inactiveLocales,
    allLocales: [...new Set([...activeLocales, ...inactiveLocales])],
    localeNames,
    localeAliases: {},
    localeRegistry: registry,
    defaultLocale: CANONICAL_LOCALE,
    hasRegistry: false,
  };
}

export function readLocaleModel({ root = process.cwd(), requireRegistry = false } = {}) {
  const registryPath = join(root, I18N_PATHS.registry);
  if (!existsSync(registryPath)) {
    if (requireRegistry) {
      throw new Error(`Missing locale registry: ${I18N_PATHS.registry}`);
    }
    return buildLegacyLocaleModel(root);
  }

  const source = readFileSync(registryPath, 'utf8');
  const activeLocales = parseExportLiteral(source, 'activeLocales') ?? [];
  const inactiveLocales = parseExportLiteral(source, 'inactiveLocales') ?? [];
  const localeAliases = parseExportLiteral(source, 'localeAliases') ?? {};
  const localeRegistry = parseExportLiteral(source, 'localeRegistry') ?? {};
  const allLocales = [...new Set([...activeLocales, ...inactiveLocales])];
  const localeNames = Object.fromEntries(
    activeLocales.map((locale) => [locale, localeRegistry[locale]?.name ?? locale]),
  );

  return {
    activeLocales,
    inactiveLocales,
    allLocales,
    localeNames,
    localeAliases,
    localeRegistry,
    defaultLocale: CANONICAL_LOCALE,
    hasRegistry: true,
  };
}

function sourceCatalogPath(locale = CANONICAL_LOCALE) {
  return `${I18N_PATHS.sourceDir}/${locale}.json`;
}

function fallbackCatalogPath(locale) {
  return `${I18N_PATHS.fallbackDir}/${locale}.json`;
}

function generatedCatalogPath(locale) {
  return `${I18N_PATHS.generatedDir}/${locale}.json`;
}

function runtimeMessagePath(locale) {
  return `${I18N_PATHS.messagesDir}/${locale}.json`;
}

function readCatalogIfExists(root, path, errors) {
  if (!existsSync(join(root, path))) {
    return null;
  }
  return readJson(root, path, errors);
}

export function loadCanonicalCatalog({ root = process.cwd(), errors = [] } = {}) {
  const sourcePath = sourceCatalogPath();
  if (existsSync(join(root, sourcePath))) {
    return readJson(root, sourcePath, errors);
  }

  return readCatalogIfExists(root, runtimeMessagePath(CANONICAL_LOCALE), errors);
}

export function compileI18nCatalogs({ root = process.cwd(), check = false } = {}) {
  const errors = [];
  const model = readLocaleModel({ root, requireRegistry: false });
  const canonical = loadCanonicalCatalog({ root, errors });
  const outputs = new Map();

  if (!canonical) {
    errors.push(`Missing canonical source catalog: ${sourceCatalogPath()}`);
    return { errors, outputs, model };
  }

  for (const locale of model.activeLocales) {
    let output;
    if (locale === CANONICAL_LOCALE) {
      output = canonical;
    } else {
      const generated = readCatalogIfExists(root, generatedCatalogPath(locale), errors);
      const fallback = readCatalogIfExists(root, fallbackCatalogPath(locale), errors);
      output = buildCatalogFromCanonical(canonical, [generated, fallback, canonical]);
    }

    outputs.set(locale, output);
  }

  const messageFiles = listJsonFiles(root, I18N_PATHS.messagesDir);
  const activeMessagePaths = new Set(model.activeLocales.map(runtimeMessagePath));

  for (const file of messageFiles) {
    if (!activeMessagePaths.has(file)) {
      const message = `${file} is compiled runtime output for an inactive or unsupported locale. Remove it from ${I18N_PATHS.messagesDir}.`;
      if (check) {
        errors.push(message);
      } else {
        rmSync(join(root, file), { force: true });
      }
    }
  }

  for (const [locale, output] of outputs) {
    const path = runtimeMessagePath(locale);
    const expected = stableJson(output);
    const fullPath = join(root, path);
    const existing = existsSync(fullPath) ? normalizeText(readFileSync(fullPath, 'utf8')) : null;

    if (check) {
      if (existing !== expected) {
        errors.push(`${path} is stale or manually edited; regenerate it with pnpm i18n:compile.`);
      }
      continue;
    }

    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, expected, 'utf8');
  }

  return { errors, outputs, model };
}

function getCatalogLocale(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.json$/, '');
}

function compareKeyInventory({ catalogPath, catalog, canonicalKeys, canonicalKeySet, errors }) {
  const values = flattenMessageValues(catalog);
  const keys = values.map(({ key }) => key);
  const keySet = new Set(keys);

  for (const key of canonicalKeys) {
    if (!keySet.has(key)) {
      errors.push(`${catalogPath} is missing key "${key}" from ${sourceCatalogPath()}.`);
    }
  }

  for (const key of keys) {
    if (!canonicalKeySet.has(key)) {
      errors.push(`${catalogPath} has extra key "${key}" not present in ${sourceCatalogPath()}.`);
    }
  }

  if (keys.length === canonicalKeys.length) {
    const mismatchIndex = canonicalKeys.findIndex((key, index) => keys[index] !== key);
    if (mismatchIndex !== -1) {
      errors.push(`${catalogPath} key order does not match ${sourceCatalogPath()}.`);
    }
  }
}

function validateJsonFormatting({ root, path, catalog, errors }) {
  const raw = normalizeText(readText(root, path));
  const expected = stableJson(catalog);
  if (raw !== expected) {
    errors.push(`${path} does not match stable JSON formatting; use 2-space indentation and canonical key order.`);
  }
}

function getAstSignature(value) {
  const result = {
    arguments: new Set(),
    tags: new Set(),
    selectors: new Set(),
    error: null,
  };

  if (typeof value !== 'string') {
    return result;
  }

  let ast;
  try {
    ast = parse(value, { requiresOtherClause: true });
  } catch (error) {
    result.error = error.message;
    return result;
  }

  function visit(elements) {
    for (const element of elements) {
      if (
        element.type === TYPE.argument ||
        element.type === TYPE.number ||
        element.type === TYPE.date ||
        element.type === TYPE.time ||
        element.type === TYPE.select ||
        element.type === TYPE.plural
      ) {
        result.arguments.add(element.value);
      }

      if (element.type === TYPE.tag) {
        result.tags.add(element.value);
        visit(element.children ?? []);
      }

      if (element.type === TYPE.select || element.type === TYPE.plural) {
        const optionKeys = Object.keys(element.options ?? {}).sort();
        result.selectors.add(`${element.value}:${TYPE[element.type]}:${optionKeys.join('|')}`);
        for (const option of Object.values(element.options ?? {})) {
          visit(option.value ?? []);
        }
      }
    }
  }

  visit(ast);
  return result;
}

function formatSet(set) {
  return [...set]
    .sort()
    .map((value) => `"${value}"`)
    .join(', ');
}

function sameSet(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }
  return true;
}

function validateMessageValues({ catalogPath, catalog, canonicalValueMap, errors }) {
  for (const { key, value } of flattenMessageValues(catalog)) {
    if (value === null) {
      errors.push(`${catalogPath} contains null at key "${key}".`);
      continue;
    }

    if (typeof value === 'string' && value.trim() === '') {
      errors.push(`${catalogPath} contains an empty string at key "${key}".`);
      continue;
    }

    const signature = getAstSignature(value);
    if (signature.error) {
      errors.push(`${catalogPath} has ICU syntax error at key "${key}": ${signature.error}.`);
      continue;
    }

    if (!canonicalValueMap.has(key)) {
      continue;
    }

    const sourceSignature = getAstSignature(canonicalValueMap.get(key));
    if (sourceSignature.error) {
      continue;
    }

    if (!sameSet(sourceSignature.arguments, signature.arguments)) {
      errors.push(
        `${catalogPath} has placeholder mismatch at key "${key}": expected ${formatSet(
          sourceSignature.arguments,
        )} but found ${formatSet(signature.arguments)}.`,
      );
    }

    if (!sameSet(sourceSignature.tags, signature.tags)) {
      errors.push(
        `${catalogPath} has rich-text tag mismatch at key "${key}": expected ${formatSet(
          sourceSignature.tags,
        )} but found ${formatSet(signature.tags)}.`,
      );
    }

    if (!sameSet(sourceSignature.selectors, signature.selectors)) {
      errors.push(
        `${catalogPath} has plural/select mismatch at key "${key}": expected ${formatSet(
          sourceSignature.selectors,
        )} but found ${formatSet(signature.selectors)}.`,
      );
    }
  }
}

function getGitStatusForPath(root, path) {
  try {
    const output = execFileSync('git', ['status', '--porcelain', '--', path], {
      cwd: root,
      encoding: 'utf8',
    });
    return output
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.slice(3).trim());
  } catch {
    return [];
  }
}

function generatedCatalogUpdateAllowed() {
  return PLATFORM_SYNC_ENV.has(String(process.env.I18N_ALLOW_GENERATED_UPDATE ?? '').toLowerCase());
}

function validateGeneratedEditGuard({ root, errors }) {
  if (generatedCatalogUpdateAllowed()) {
    return;
  }

  const changedPaths = getGitStatusForPath(root, I18N_PATHS.generatedDir).map(toPosixPath);
  const changedGenerated = changedPaths.some((path) => path.endsWith('/'))
    ? listJsonFiles(root, I18N_PATHS.generatedDir)
    : changedPaths.filter((path) => path.endsWith('.json'));
  for (const file of changedGenerated) {
    errors.push(
      `${toPosixPath(file)} is reserved machine output under ${I18N_PATHS.generatedDir}; edit ${I18N_PATHS.fallbackDir} for human translations, or set I18N_ALLOW_GENERATED_UPDATE=1 when committing an automated export to generated catalogs.`,
    );
  }
}

function readFallbackManifest(root, errors) {
  const manifestPath = join(root, I18N_PATHS.fallbackManifest);
  if (!existsSync(manifestPath)) {
    errors.push(`Missing protected fallback manifest: ${I18N_PATHS.fallbackManifest}.`);
    return null;
  }

  return readJson(root, I18N_PATHS.fallbackManifest, errors);
}

function validateFallbackManifest({ root, model, errors }) {
  const manifest = readFallbackManifest(root, errors);
  if (!manifest) {
    return;
  }

  const fallbackFiles = listJsonFiles(root, I18N_PATHS.fallbackDir).filter((path) => !path.endsWith('/MANIFEST.json'));
  const knownLocales = new Set(model.allLocales);

  for (const path of fallbackFiles) {
    const locale = getCatalogLocale(path);
    if (!knownLocales.has(locale)) {
      errors.push(`${path} is not declared in ${I18N_PATHS.registry}.`);
      continue;
    }

    const entry = manifest.locales?.[locale];
    if (!entry) {
      errors.push(`${path} is missing from ${I18N_PATHS.fallbackManifest}.`);
      continue;
    }

    if (!entry.provenance) {
      errors.push(`${I18N_PATHS.fallbackManifest} entry for ${locale} must include provenance.`);
    }

    const hash = sha256(readText(root, path));
    if (entry.sha256 !== hash) {
      errors.push(
        `${path} changed from its protected fallback manifest hash; update requires explicit fallback provenance.`,
      );
    }
  }
}

function validateCatalogFiles({ root, model, canonical, errors }) {
  const canonicalValues = flattenMessageValues(canonical);
  const canonicalKeys = canonicalValues.map(({ key }) => key);
  const canonicalKeySet = new Set(canonicalKeys);
  const canonicalValueMap = new Map(canonicalValues.map(({ key, value }) => [key, value]));
  const allKnownLocales = new Set(model.allLocales);

  const sourceFiles = listJsonFiles(root, I18N_PATHS.sourceDir);
  for (const path of sourceFiles) {
    const locale = getCatalogLocale(path);
    if (locale !== CANONICAL_LOCALE) {
      errors.push(`${path} is not developer-authored source; only ${sourceCatalogPath()} is allowed.`);
    }
  }

  const catalogPaths = [
    ...sourceFiles,
    ...listJsonFiles(root, I18N_PATHS.generatedDir),
    ...listJsonFiles(root, I18N_PATHS.fallbackDir).filter((path) => !path.endsWith('/MANIFEST.json')),
  ];

  for (const path of catalogPaths) {
    const locale = getCatalogLocale(path);
    const isSource = path.startsWith(I18N_PATHS.sourceDir);
    if (!isSource && !allKnownLocales.has(locale)) {
      errors.push(`${path} is for unsupported locale "${locale}".`);
    }

    const catalog = readJson(root, path, errors);
    if (!catalog) {
      continue;
    }

    validateJsonFormatting({ root, path, catalog, errors });
    validateMessageValues({ catalogPath: path, catalog, canonicalValueMap, errors });

    if (isSource) {
      continue;
    }

    compareKeyInventory({
      catalogPath: path,
      catalog,
      canonicalKeys,
      canonicalKeySet,
      errors,
    });
  }
}

function validateRuntimeConfig({ root, model, errors }) {
  if (!model.hasRegistry) {
    errors.push(`Missing locale registry: ${I18N_PATHS.registry}.`);
    return;
  }

  const configuredLocales = readConfiguredLocales(root);
  if (configuredLocales.join(',') !== model.activeLocales.join(',')) {
    errors.push(
      `${I18N_PATHS.config} active locales must match activeLocales in ${I18N_PATHS.registry}: ${model.activeLocales.join(
        ', ',
      )}.`,
    );
  }

  for (const inactiveLocale of model.inactiveLocales) {
    if (configuredLocales.includes(inactiveLocale)) {
      errors.push(`Inactive locale ${inactiveLocale} is exposed at runtime in ${I18N_PATHS.config}.`);
    }
  }
}

export function validateI18nCatalogs({ root = process.cwd() } = {}) {
  const errors = [];
  const model = readLocaleModel({ root, requireRegistry: false });
  const canonical = loadCanonicalCatalog({ root, errors });

  if (!canonical) {
    errors.push(`Missing canonical source catalog: ${sourceCatalogPath()}.`);
    return { errors, model };
  }

  validateRuntimeConfig({ root, model, errors });
  validateCatalogFiles({ root, model, canonical, errors });
  validateFallbackManifest({ root, model, errors });
  validateGeneratedEditGuard({ root, errors });

  const compileResult = compileI18nCatalogs({ root, check: true });
  errors.push(...compileResult.errors);

  return { errors, model };
}

export function extractI18nSource({ root = process.cwd() } = {}) {
  const errors = [];
  const canonical = loadCanonicalCatalog({ root, errors });
  if (!canonical) {
    errors.push(`Missing canonical source catalog: ${sourceCatalogPath()}.`);
    return { errors, keyCount: 0 };
  }

  const keyCount = flattenMessageValues(canonical).length;
  const sourcePath = sourceCatalogPath();
  if (!existsSync(join(root, sourcePath))) {
    errors.push(`Canonical source catalog must live at ${sourcePath}.`);
  }

  return { errors, keyCount };
}

export function calculateI18nCoverage({ root = process.cwd() } = {}) {
  const errors = [];
  const model = readLocaleModel({ root, requireRegistry: false });
  const canonical = loadCanonicalCatalog({ root, errors });

  if (!canonical) {
    errors.push(`Missing canonical source catalog: ${sourceCatalogPath()}.`);
    return { errors, records: [] };
  }

  const canonicalValues = flattenMessageValues(canonical);
  const canonicalValueMap = new Map(canonicalValues.map(({ key, value }) => [key, value]));
  const records = [];

  for (const locale of model.allLocales) {
    if (locale === CANONICAL_LOCALE) {
      records.push({
        locale,
        status: model.localeRegistry[locale]?.status ?? 'active',
        source: 'source',
        translatedKeys: canonicalValues.length,
        totalKeys: canonicalValues.length,
        percent: 100,
      });
      continue;
    }

    const generated = readCatalogIfExists(root, generatedCatalogPath(locale), errors);
    const fallback = readCatalogIfExists(root, fallbackCatalogPath(locale), errors);
    const catalog = generated ?? fallback;
    const values = catalog ? flattenMessageValues(catalog) : [];
    const valueMap = new Map(values.map(({ key, value }) => [key, value]));
    let translatedKeys = 0;

    for (const { key } of canonicalValues) {
      const localeValue = valueMap.get(key);
      const sourceValue = canonicalValueMap.get(key);
      if (typeof localeValue === 'string' && localeValue.trim() !== '' && localeValue !== sourceValue) {
        translatedKeys += 1;
      }
    }

    records.push({
      locale,
      status: model.localeRegistry[locale]?.status ?? 'inactive',
      source: generated ? 'generated' : fallback ? 'fallback' : 'missing',
      translatedKeys,
      totalKeys: canonicalValues.length,
      percent: canonicalValues.length === 0 ? 0 : Math.round((translatedKeys / canonicalValues.length) * 1000) / 10,
    });
  }

  return { errors, records };
}

export function checkI18nFallbacks({ root = process.cwd() } = {}) {
  const errors = [];
  const model = readLocaleModel({ root, requireRegistry: false });
  validateRuntimeConfig({ root, model, errors });
  validateFallbackManifest({ root, model, errors });

  for (const locale of model.activeLocales) {
    const entry = model.localeRegistry[locale];
    const fallbackChain = entry?.fallbackChain ?? [];
    if (fallbackChain.at(-1) !== CANONICAL_LOCALE) {
      errors.push(`${I18N_PATHS.registry} fallback chain for ${locale} must terminate at ${CANONICAL_LOCALE}.`);
    }

    if (locale !== CANONICAL_LOCALE && !existsSync(join(root, fallbackCatalogPath(locale)))) {
      errors.push(`Active locale ${locale} must have a protected fallback catalog at ${fallbackCatalogPath(locale)}.`);
    }
  }

  for (const inactiveLocale of model.inactiveLocales) {
    if (model.activeLocales.includes(inactiveLocale)) {
      errors.push(`Inactive locale ${inactiveLocale} is also listed as active.`);
    }
    if (existsSync(join(root, runtimeMessagePath(inactiveLocale)))) {
      errors.push(
        `Inactive locale ${inactiveLocale} must not have compiled runtime output at ${runtimeMessagePath(inactiveLocale)}.`,
      );
    }
  }

  return { errors, model };
}

export function buildFallbackManifest({
  root = process.cwd(),
  provenance = 'migration from src/i18n/messages/*.json',
} = {}) {
  const locales = {};
  for (const path of listJsonFiles(root, I18N_PATHS.fallbackDir).filter((file) => !file.endsWith('/MANIFEST.json'))) {
    const locale = getCatalogLocale(path);
    locales[locale] = {
      path,
      sha256: sha256(readText(root, path)),
      provenance,
    };
  }

  return {
    version: 1,
    generated_by: 'pnpm i18n:fallback-check --write-manifest',
    locales,
  };
}

export function writeFallbackManifest(options = {}) {
  const root = options.root ?? process.cwd();
  const manifest = buildFallbackManifest(options);
  writeJson(root, I18N_PATHS.fallbackManifest, manifest);
  return manifest;
}

export function runI18nInventoryCheck({ root = process.cwd() } = {}) {
  const errors = [];
  const canonical = loadCanonicalCatalog({ root, errors });
  const model = readLocaleModel({ root, requireRegistry: false });
  const parsedByLocale = new Map();
  const locales = [];

  if (!canonical) {
    errors.push(`Missing canonical source catalog: ${sourceCatalogPath()}.`);
    return {
      errors,
      canonicalLocale: CANONICAL_LOCALE,
      locales,
      parsedByLocale,
      canonicalKeys: [],
      canonicalValueMap: new Map(),
    };
  }

  const canonicalValues = flattenMessageValues(canonical);
  const canonicalKeys = canonicalValues.map(({ key }) => key);
  const canonicalKeySet = new Set(canonicalKeys);
  const canonicalValueMap = new Map(canonicalValues.map(({ key, value }) => [key, value]));
  parsedByLocale.set(CANONICAL_LOCALE, canonical);
  locales.push(CANONICAL_LOCALE);

  for (const locale of model.allLocales.filter((locale) => locale !== CANONICAL_LOCALE)) {
    const catalogPath = existsSync(join(root, generatedCatalogPath(locale)))
      ? generatedCatalogPath(locale)
      : existsSync(join(root, fallbackCatalogPath(locale)))
        ? fallbackCatalogPath(locale)
        : runtimeMessagePath(locale);
    if (!existsSync(join(root, catalogPath))) {
      continue;
    }

    const catalog = readJson(root, catalogPath, errors);
    if (!catalog) {
      continue;
    }

    locales.push(locale);
    parsedByLocale.set(locale, catalog);
    validateJsonFormatting({ root, path: catalogPath, catalog, errors });
    compareKeyInventory({ catalogPath, catalog, canonicalKeys, canonicalKeySet, errors });
    validateMessageValues({ catalogPath, catalog, canonicalValueMap, errors });
  }

  return {
    errors,
    canonicalLocale: CANONICAL_LOCALE,
    locales,
    parsedByLocale,
    canonicalKeys,
    canonicalValueMap,
  };
}

export function hasFile(root, path) {
  return existsSync(join(root, path)) && statSync(join(root, path)).isFile();
}

export function formatCoverage(records) {
  return records
    .map(
      (record) =>
        `${record.locale.padEnd(6)} ${record.status.padEnd(8)} ${record.source.padEnd(9)} ${String(
          record.percent,
        ).padStart(5)}% (${record.translatedKeys}/${record.totalKeys})`,
    )
    .join('\n');
}
