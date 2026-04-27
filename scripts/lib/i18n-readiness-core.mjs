import matter from 'gray-matter';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { hashMarkdown } from './docs-hash-utils.mjs';
import { readConfiguredLocales } from './i18n-catalog-core.mjs';
import { runI18nInventoryCheck } from './i18n-inventory-check-core.mjs';

const CANONICAL_LOCALE = 'en';
const SNAPSHOT_PATH = 'architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md';
const MARKDOWN_ARTIFACT_PATH = '.artifacts/i18n/I18N_LOCALE_ACTIVATION_REPORT.md';
const JSON_ARTIFACT_PATH = '.artifacts/i18n/I18N_LOCALE_ACTIVATION_REPORT.json';

function readConfiguredLocalesStrict(root) {
  const locales = readConfiguredLocales(root);
  if (locales.length === 0) {
    throw new Error('Unable to parse locales from src/i18n/config.ts');
  }
  return locales;
}

function readLocaleNames(root) {
  const config = readFileSync(join(root, 'src/i18n/config.ts'), 'utf8');
  const match = config.match(/export const localeNames: Record<Locale, string> = \{([\s\S]*?)\n\};/);
  if (!match) {
    throw new Error('Unable to parse localeNames from src/i18n/config.ts');
  }

  const localeNames = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim().replace(/,$/, '');
    if (!trimmed) {
      continue;
    }

    const entryMatch = trimmed.match(/^(?:'([^']+)'|([A-Za-z0-9_-]+)):\s*'([^']+)'$/);
    if (!entryMatch) {
      continue;
    }

    const key = entryMatch[1] ?? entryMatch[2];
    localeNames[key] = entryMatch[3];
  }

  return localeNames;
}

function flattenMessageKeys(value, prefix = '', keys = [], values = []) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, nested] of Object.entries(value)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenMessageKeys(nested, nextPrefix, keys, values);
    }
    return { keys, values };
  }

  keys.push(prefix);
  values.push({ key: prefix, value });
  return { keys, values };
}

function calculateCoverageEstimate({ locale, parsedByLocale, canonicalKeys, canonicalValueMap }) {
  const totalKeys = canonicalKeys.length;
  if (totalKeys === 0) {
    return { translatedKeys: 0, totalKeys: 0, percent: 0 };
  }

  if (locale === CANONICAL_LOCALE) {
    return { translatedKeys: totalKeys, totalKeys, percent: 100 };
  }

  const parsed = parsedByLocale.get(locale);
  if (!parsed) {
    return { translatedKeys: 0, totalKeys, percent: 0 };
  }

  const { values } = flattenMessageKeys(parsed);
  const localeValueMap = new Map(values.map(({ key, value }) => [key, value]));

  let translatedKeys = 0;
  for (const key of canonicalKeys) {
    const localeValue = localeValueMap.get(key);
    const canonicalValue = canonicalValueMap.get(key);

    if (typeof localeValue !== 'string' || localeValue.trim() === '') {
      continue;
    }

    if (localeValue !== canonicalValue) {
      translatedKeys += 1;
    }
  }

  return {
    translatedKeys,
    totalKeys,
    percent: Math.round((translatedKeys / totalKeys) * 1000) / 10,
  };
}

function buildMessageStatus(root) {
  const inventory = runI18nInventoryCheck({ root });
  const locales = inventory.locales;
  const fileErrorMap = new Map(locales.map((locale) => [locale, []]));

  for (const error of inventory.errors) {
    const fileMatch = error.match(/^src\/i18n\/(?:messages|catalogs\/(?:source|fallback|generated))\/([^/]+)\.json/);
    if (fileMatch) {
      const locale = fileMatch[1];
      if (!fileErrorMap.has(locale)) {
        fileErrorMap.set(locale, []);
      }
      fileErrorMap.get(locale).push(error);
      continue;
    }

    if (!fileErrorMap.has(CANONICAL_LOCALE)) {
      fileErrorMap.set(CANONICAL_LOCALE, []);
    }
    fileErrorMap.get(CANONICAL_LOCALE).push(error);
  }

  const statusByLocale = new Map();
  for (const locale of locales) {
    statusByLocale.set(locale, {
      fileExists: inventory.parsedByLocale.has(locale),
      errors: fileErrorMap.get(locale) ?? [],
      coverage: calculateCoverageEstimate({
        locale,
        parsedByLocale: inventory.parsedByLocale,
        canonicalKeys: inventory.canonicalKeys,
        canonicalValueMap: inventory.canonicalValueMap,
      }),
    });
  }

  return {
    inventoryErrors: inventory.errors,
    locales,
    statusByLocale,
    parsedByLocale: inventory.parsedByLocale,
    canonicalKeys: inventory.canonicalKeys,
    canonicalValueMap: inventory.canonicalValueMap,
  };
}

function runGit(root, args) {
  return spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function resolveLifecycleBaseRef(root, explicitBaseRef) {
  const candidates = [
    explicitBaseRef,
    process.env.I18N_LIFECYCLE_BASE_REF,
    process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : null,
    'origin/main',
  ].filter(Boolean);

  for (const candidate of candidates) {
    const verification = runGit(root, ['rev-parse', '--verify', candidate]);
    if (verification.status === 0) {
      return candidate;
    }
  }

  return null;
}

function readGitFile(root, ref, filePath) {
  const result = runGit(root, ['show', `${ref}:${filePath}`]);
  if (result.status !== 0) {
    return null;
  }

  return result.stdout;
}

function diffKeys(nextKeys, previousKeys) {
  const previousKeySet = new Set(previousKeys);
  const nextKeySet = new Set(nextKeys);

  return {
    added: nextKeys.filter((key) => !previousKeySet.has(key)),
    deleted: previousKeys.filter((key) => !nextKeySet.has(key)),
  };
}

function analyzeTranslationKeyLifecycle({ root, parsedByLocale, canonicalKeys, gitBaseRef }) {
  const defaultResult = {
    status: 'skipped',
    baseRef: null,
    mergeBase: null,
    changedFiles: [],
    warnings: [],
  };

  if (!existsSync(join(root, '.git'))) {
    return defaultResult;
  }

  const baseRef = resolveLifecycleBaseRef(root, gitBaseRef);
  if (!baseRef) {
    return defaultResult;
  }

  const mergeBaseResult = runGit(root, ['merge-base', baseRef, 'HEAD']);
  if (mergeBaseResult.status !== 0) {
    return defaultResult;
  }

  const mergeBase = mergeBaseResult.stdout.trim();
  if (!mergeBase) {
    return defaultResult;
  }

  const changedFilesResult = runGit(root, ['diff', '--name-only', `${mergeBase}..HEAD`, '--', 'src/i18n/messages']);
  if (changedFilesResult.status !== 0) {
    return defaultResult;
  }

  const changedFiles = changedFilesResult.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.json'))
    .sort();

  const warnings = [];
  const currentCanonicalKeys = canonicalKeys;
  const baseCanonicalContent = readGitFile(root, mergeBase, 'src/i18n/messages/en.json');
  let sourceAddedKeys = new Set();

  if (baseCanonicalContent) {
    const parsed = JSON.parse(baseCanonicalContent);
    const { keys } = flattenMessageKeys(parsed);
    sourceAddedKeys = new Set(diffKeys(currentCanonicalKeys, keys).added);
  } else {
    sourceAddedKeys = new Set(currentCanonicalKeys);
  }

  for (const changedFile of changedFiles) {
    if (changedFile === 'src/i18n/messages/en.json') {
      continue;
    }

    const locale = changedFile.replace(/^src\/i18n\/messages\//, '').replace(/\.json$/, '');
    const currentParsed = parsedByLocale.get(locale);
    if (!currentParsed) {
      continue;
    }

    const baseContent = readGitFile(root, mergeBase, changedFile);
    const currentKeys = flattenMessageKeys(currentParsed).keys;
    const previousKeys = baseContent ? flattenMessageKeys(JSON.parse(baseContent)).keys : [];
    const { added, deleted } = diffKeys(currentKeys, previousKeys);

    if (deleted.length > 0) {
      warnings.push({
        code: 'RG-I18N-001-TRANSLATION-KEY-DELETED',
        locale,
        field: 'translation_keys',
        message: `Translation PR deleted locale keys in ${locale}: ${deleted.join(', ')}.`,
      });
    }

    const unexpectedAdded = added.filter((key) => !sourceAddedKeys.has(key));
    if (unexpectedAdded.length > 0) {
      warnings.push({
        code: 'RG-I18N-001-TRANSLATION-KEY-ADDED-WITHOUT-SOURCE',
        locale,
        field: 'translation_keys',
        message: `Translation PR added locale-only keys in ${locale} without matching en.json source changes: ${unexpectedAdded.join(', ')}.`,
      });
    }
  }

  return {
    status: changedFiles.length > 0 ? 'analyzed' : 'no_changes',
    baseRef,
    mergeBase,
    changedFiles,
    warnings,
  };
}

function normalizeOptionalString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === 'pending' || normalized.toLowerCase() === 'tbd') {
    return null;
  }

  return normalized;
}

function normalizeOptionalBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'pending' || normalized === 'tbd') {
    return null;
  }

  if (normalized === 'true' || normalized === 'yes' || normalized === 'approved' || normalized === 'complete') {
    return true;
  }

  if (normalized === 'false' || normalized === 'no' || normalized === 'blocked' || normalized === 'incomplete') {
    return false;
  }

  return null;
}

function loadSnapshot(root) {
  const fullPath = join(root, SNAPSHOT_PATH);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing locale activation snapshot: ${SNAPSHOT_PATH}`);
  }

  const raw = readFileSync(fullPath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data ?? {};
  const rawLocales = data.locales ?? {};
  const locales = {};

  for (const [locale, entry] of Object.entries(rawLocales)) {
    const value = entry && typeof entry === 'object' && !Array.isArray(entry) ? entry : {};
    locales[locale] = {
      language_name: normalizeOptionalString(value.language_name),
      runtime_active: normalizeOptionalBoolean(value.runtime_active),
      messages_complete: normalizeOptionalBoolean(value.messages_complete),
      docs_evidence_generated: normalizeOptionalBoolean(value.docs_evidence_generated),
      ui_qa_done: normalizeOptionalBoolean(value.ui_qa_done),
      business_owner: normalizeOptionalString(value.business_owner),
      translation_reviewer: normalizeOptionalString(value.translation_reviewer),
      technical_owner: normalizeOptionalString(value.technical_owner),
      approval_date: normalizeOptionalString(value.approval_date),
      activation_verdict: normalizeOptionalString(value.activation_verdict),
      notes: normalizeOptionalString(value.notes),
    };
  }

  return {
    path: SNAPSHOT_PATH,
    reviewedBy: normalizeOptionalString(data.reviewed_by),
    lastReviewedDate: normalizeOptionalString(data.last_reviewed_date),
    sourceArtifactHash: normalizeOptionalString(data.source_artifact_hash),
    locales,
  };
}

function getDocsEvidenceStatus(root) {
  const inventoryPath = join(root, 'docs/content/en/generated/docs-inventory.generated.json');
  if (!existsSync(inventoryPath)) {
    return false;
  }

  try {
    const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));
    return inventory?.generated === true && Array.isArray(inventory?.manifests);
  } catch {
    return false;
  }
}

function compareSnapshotField(warnings, locale, field, systemValue, snapshotValue) {
  if (snapshotValue === null || snapshotValue === undefined) {
    return;
  }

  if (snapshotValue !== systemValue) {
    warnings.push({
      code: 'RG-I18N-001-SNAPSHOT-MISMATCH',
      locale,
      field,
      message: `Snapshot ${field} does not match derived system truth for ${locale}.`,
    });
  }
}

function compareSnapshotVerdict(warnings, locale, snapshotVerdict, derivedVerdict) {
  if (!snapshotVerdict) {
    return;
  }

  if (snapshotVerdict !== derivedVerdict) {
    warnings.push({
      code: 'RG-I18N-001-SNAPSHOT-VERDICT',
      locale,
      field: 'activation_verdict',
      message: `Snapshot activation_verdict does not match derived verdict for ${locale}.`,
    });
  }
}

function deriveVerdict({
  locale,
  runtimeActive,
  messagesComplete,
  docsEvidenceGenerated,
  uiQaDone,
  ownersComplete,
  approvalDateFilled,
}) {
  if (locale === CANONICAL_LOCALE) {
    return 'canonical';
  }

  if (!runtimeActive) {
    return 'inactive_draft';
  }

  if (messagesComplete && docsEvidenceGenerated && uiQaDone && ownersComplete && approvalDateFilled) {
    return 'active_ready';
  }

  return 'active_fallback';
}

function sortLocaleRecords(records, configuredLocales) {
  const order = new Map(configuredLocales.map((locale, index) => [locale, index]));
  return [...records].sort((left, right) => {
    const leftOrder = order.has(left.locale) ? order.get(left.locale) : configuredLocales.length + 1;
    const rightOrder = order.has(right.locale) ? order.get(right.locale) : configuredLocales.length + 1;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.locale.localeCompare(right.locale);
  });
}

function buildMarkdownReport({ mode, records, warnings, snapshot, translationKeyLifecycle }) {
  const lines = [
    '# I18N Locale Activation Report',
    '',
    `Mode: ${mode}`,
    `Snapshot reviewed by: ${snapshot.reviewedBy ?? 'pending'}`,
    `Snapshot last reviewed date: ${snapshot.lastReviewedDate ?? 'pending'}`,
    `Coverage basis: estimate of keys whose values differ from en.json; identical carryovers still count as untranslated.`,
    `Translation key lifecycle analysis: ${translationKeyLifecycle.status}${translationKeyLifecycle.baseRef ? ` (base ref: ${translationKeyLifecycle.baseRef})` : ''}`,
    '',
    '## Locale Summary',
    '',
    '| Locale | Language | Runtime Active | Messages Complete | Coverage (estimate) | Docs Evidence Generated | UI QA Done | Owners Complete | Approval Date | Verdict |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const record of records) {
    lines.push(
      `| ${record.locale} | ${record.languageName} | ${record.runtimeActive ? 'yes' : 'no'} | ${record.messagesComplete ? 'yes' : 'no'} | ${record.coverage.percent}% (${record.coverage.translatedKeys}/${record.coverage.totalKeys}) | ${record.docsEvidenceGenerated ? 'yes' : 'no'} | ${record.uiQaDone ? 'yes' : 'no'} | ${record.ownersComplete ? 'yes' : 'no'} | ${record.approvalDate ?? 'pending'} | ${record.activationVerdict} |`,
    );
  }

  lines.push('', '## Warnings', '');
  if (warnings.length === 0) {
    lines.push('None.');
  } else {
    for (const warning of warnings) {
      lines.push(`- [${warning.code}] ${warning.message}`);
    }
  }

  lines.push('', '## Locale Details', '');
  for (const record of records) {
    lines.push(`### ${record.locale} — ${record.languageName}`, '');
    lines.push(`- Verdict: \`${record.activationVerdict}\``);
    lines.push(`- Runtime active: ${record.runtimeActive ? 'yes' : 'no'}`);
    lines.push(`- Messages complete: ${record.messagesComplete ? 'yes' : 'no'}`);
    lines.push(
      `- Coverage estimate: ${record.coverage.percent}% (${record.coverage.translatedKeys}/${record.coverage.totalKeys})`,
    );
    lines.push(`- Docs evidence generated: ${record.docsEvidenceGenerated ? 'yes' : 'no'}`);
    lines.push(`- UI QA done: ${record.uiQaDone ? 'yes' : 'no'}`);
    lines.push(`- Business owner: ${record.businessOwner ?? 'pending'}`);
    lines.push(`- Translation reviewer: ${record.translationReviewer ?? 'pending'}`);
    lines.push(`- Technical owner: ${record.technicalOwner ?? 'pending'}`);
    lines.push(`- Approval date: ${record.approvalDate ?? 'pending'}`);
    if (record.notes) {
      lines.push(`- Notes: ${record.notes}`);
    }

    const localeWarnings = warnings.filter((warning) => warning.locale === record.locale);
    lines.push('- Locale warnings:');
    if (localeWarnings.length === 0) {
      lines.push('  - none');
    } else {
      for (const warning of localeWarnings) {
        lines.push(`  - [${warning.code}] ${warning.message}`);
      }
    }
    lines.push('');
  }

  return `${lines.join('\n').replace(/\n+$/g, '')}\n`;
}

function buildJsonArtifact({
  generatedAt,
  mode,
  markdownHash,
  records,
  warnings,
  snapshotHashMatches,
  translationKeyLifecycle,
}) {
  return {
    generated_at: generatedAt,
    mode,
    markdown_artifact_path: MARKDOWN_ARTIFACT_PATH,
    markdown_hash: markdownHash,
    snapshot_hash_matches: snapshotHashMatches,
    coverage_basis: 'estimate_of_values_different_from_en_json',
    translation_key_lifecycle: translationKeyLifecycle,
    warnings,
    locales: records.map((record) => ({
      locale: record.locale,
      language_name: record.languageName,
      runtime_active: record.runtimeActive,
      messages_complete: record.messagesComplete,
      coverage_estimate: {
        translated_keys: record.coverage.translatedKeys,
        total_keys: record.coverage.totalKeys,
        percent: record.coverage.percent,
      },
      docs_evidence_generated: record.docsEvidenceGenerated,
      ui_qa_done: record.uiQaDone,
      business_owner: record.businessOwner,
      translation_reviewer: record.translationReviewer,
      technical_owner: record.technicalOwner,
      approval_date: record.approvalDate,
      activation_verdict: record.activationVerdict,
      notes: record.notes,
    })),
  };
}

export function evaluateI18nReadiness({ root = process.cwd(), mode = 'warn', gitBaseRef = null } = {}) {
  const configuredLocales = readConfiguredLocalesStrict(root);
  const localeNames = readLocaleNames(root);
  const messageState = buildMessageStatus(root);
  const docsEvidenceGenerated = getDocsEvidenceStatus(root);
  const snapshot = loadSnapshot(root);
  const warnings = [];
  const translationKeyLifecycle = analyzeTranslationKeyLifecycle({
    root,
    parsedByLocale: messageState.parsedByLocale,
    canonicalKeys: messageState.canonicalKeys,
    gitBaseRef,
  });

  warnings.push(...translationKeyLifecycle.warnings);

  const localeUniverse = new Set([...configuredLocales, ...messageState.locales, ...Object.keys(snapshot.locales)]);
  const records = [];

  for (const locale of localeUniverse) {
    const runtimeActive = configuredLocales.includes(locale);
    const messageStatus = messageState.statusByLocale.get(locale) ?? {
      fileExists: false,
      errors: ['missing message file'],
      coverage: { translatedKeys: 0, totalKeys: messageState.canonicalKeys.length, percent: 0 },
    };
    const messagesComplete = messageStatus.fileExists && messageStatus.errors.length === 0;
    const snapshotEntry = snapshot.locales[locale] ?? {};
    const businessOwner = snapshotEntry.business_owner ?? null;
    const translationReviewer = snapshotEntry.translation_reviewer ?? null;
    const technicalOwner = snapshotEntry.technical_owner ?? null;
    const approvalDate = snapshotEntry.approval_date ?? null;
    const uiQaDone = snapshotEntry.ui_qa_done ?? false;
    const ownersComplete = Boolean(businessOwner && translationReviewer && technicalOwner);
    const approvalDateFilled = Boolean(approvalDate);
    const languageName = localeNames[locale] ?? snapshotEntry.language_name ?? locale;
    const activationVerdict = deriveVerdict({
      locale,
      runtimeActive,
      messagesComplete,
      docsEvidenceGenerated,
      uiQaDone,
      ownersComplete,
      approvalDateFilled,
    });

    compareSnapshotField(warnings, locale, 'runtime_active', runtimeActive, snapshotEntry.runtime_active);
    compareSnapshotField(warnings, locale, 'messages_complete', messagesComplete, snapshotEntry.messages_complete);
    compareSnapshotField(
      warnings,
      locale,
      'docs_evidence_generated',
      docsEvidenceGenerated,
      snapshotEntry.docs_evidence_generated,
    );
    compareSnapshotVerdict(warnings, locale, snapshotEntry.activation_verdict, activationVerdict);

    const isActivationCandidate = runtimeActive && locale !== CANONICAL_LOCALE;

    if (isActivationCandidate && !messagesComplete) {
      warnings.push({
        code: 'RG-I18N-001-MESSAGES-INCOMPLETE',
        locale,
        message: `Runtime-active locale ${locale} does not have a complete message inventory.`,
      });
    }

    if (isActivationCandidate && !docsEvidenceGenerated) {
      warnings.push({
        code: 'RG-I18N-001-DOCS-EVIDENCE-MISSING',
        locale,
        message: `Runtime-active locale ${locale} does not have generated documentation evidence.`,
      });
    }

    if (isActivationCandidate && !uiQaDone) {
      warnings.push({
        code: 'RG-I18N-001-UI-QA-PENDING',
        locale,
        message: `Runtime-active locale ${locale} does not have recorded UI QA completion.`,
      });
    }

    if (isActivationCandidate && !ownersComplete) {
      warnings.push({
        code: 'RG-I18N-001-OWNERS-PENDING',
        locale,
        message: `Runtime-active locale ${locale} is missing one or more governance owner assignments.`,
      });
    }

    if (isActivationCandidate && !approvalDateFilled) {
      warnings.push({
        code: 'RG-I18N-001-APPROVAL-PENDING',
        locale,
        message: `Runtime-active locale ${locale} is missing an approval date.`,
      });
    }

    if (!snapshot.locales[locale]) {
      warnings.push({
        code: 'RG-I18N-001-SNAPSHOT-MISSING',
        locale,
        message: `Locale ${locale} is missing from the committed readiness snapshot.`,
      });
    }

    records.push({
      locale,
      languageName,
      runtimeActive,
      messagesComplete,
      docsEvidenceGenerated,
      uiQaDone,
      businessOwner,
      translationReviewer,
      technicalOwner,
      approvalDate,
      ownersComplete,
      coverage: messageStatus.coverage,
      activationVerdict,
      notes: snapshotEntry.notes ?? null,
    });
  }

  const sortedRecords = sortLocaleRecords(records, configuredLocales);
  const generatedAt = new Date().toISOString();
  const markdown = buildMarkdownReport({
    mode,
    records: sortedRecords,
    warnings,
    snapshot,
    translationKeyLifecycle,
  });
  const markdownHash = hashMarkdown(markdown);
  const snapshotHashMatches = snapshot.sourceArtifactHash === markdownHash;
  const json = buildJsonArtifact({
    generatedAt,
    mode,
    markdownHash,
    records: sortedRecords,
    warnings,
    snapshotHashMatches,
    translationKeyLifecycle,
  });

  const enforcementFindings = [];
  for (const record of sortedRecords) {
    if (
      record.runtimeActive &&
      record.activationVerdict !== 'canonical' &&
      record.activationVerdict !== 'active_ready'
    ) {
      enforcementFindings.push(
        `Runtime-active locale ${record.locale} is not activation-ready; derived verdict is ${record.activationVerdict}.`,
      );
    }
  }

  for (const warning of warnings) {
    if (
      warning.code === 'RG-I18N-001-SNAPSHOT-MISMATCH' ||
      warning.code === 'RG-I18N-001-SNAPSHOT-VERDICT' ||
      warning.code === 'RG-I18N-001-FALLBACK-UNAPPROVED' ||
      warning.code === 'RG-I18N-001-MESSAGES-INCOMPLETE'
    ) {
      enforcementFindings.push(warning.message);
    }
  }

  if (!snapshotHashMatches) {
    enforcementFindings.push(
      'Committed snapshot source_artifact_hash does not match the generated markdown readiness report.',
    );
  }

  return {
    generatedAt,
    mode,
    markdown,
    markdownHash,
    json,
    records: sortedRecords,
    warnings,
    translationKeyLifecycle,
    snapshot,
    snapshotHashMatches,
    artifactPaths: {
      markdown: MARKDOWN_ARTIFACT_PATH,
      json: JSON_ARTIFACT_PATH,
    },
    exitCode: mode === 'enforce' && enforcementFindings.length > 0 ? 1 : 0,
    enforcementFindings,
  };
}

export function writeI18nReadinessArtifacts({ root = process.cwd(), mode = 'warn' } = {}) {
  const evaluation = evaluateI18nReadiness({ root, mode });
  const markdownPath = join(root, evaluation.artifactPaths.markdown);
  const jsonPath = join(root, evaluation.artifactPaths.json);

  mkdirSync(dirname(markdownPath), { recursive: true });
  writeFileSync(markdownPath, evaluation.markdown, 'utf8');
  writeFileSync(jsonPath, `${JSON.stringify(evaluation.json, null, 2)}\n`, 'utf8');

  return evaluation;
}
