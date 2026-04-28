import { afterEach, describe, expect, it } from 'vitest';

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

// @ts-expect-error script core is ESM without generated declarations.
import { evaluateI18nReadiness, writeI18nReadinessArtifacts } from '../lib/i18n-readiness-core.mjs';

type ReadinessRecord = {
  locale: string;
  activationVerdict: string;
  runtimeActive: boolean;
  messagesComplete: boolean;
  docsEvidenceGenerated: boolean;
  ownersComplete: boolean;
  approvalDate: string | null;
  coverage: {
    translatedKeys: number;
    totalKeys: number;
    percent: number;
  };
};

const tempRoots: string[] = [];

function toJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeFixtureFile(root: string, file: string, content: string) {
  const fullPath = join(root, file);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
}

function createFixture(snapshotFrontmatter: string) {
  const root = mkdtempSync(join(tmpdir(), 'afenda-i18n-readiness-'));
  tempRoots.push(root);

  const baseFiles: Record<string, string> = {
    'src/i18n/config.ts': `export const locales = ['en', 'es', 'vi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  vi: 'Tiếng Việt',
};
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
`,
    'src/i18n/messages/en.json': toJson({
      common: {
        save: 'Save',
        welcome: 'Welcome, {name}',
        mention: 'Connected as @{username}',
      },
    }),
    'src/i18n/messages/es.json': toJson({
      common: {
        save: 'Guardar',
        welcome: 'Bienvenido, {name}',
        mention: 'Conectado como @{username}',
      },
    }),
    'src/i18n/messages/vi.json': toJson({
      common: {
        save: 'Lưu',
        welcome: 'Welcome, {name}',
        mention: 'Connected as @{username}',
      },
    }),
    'src/i18n/messages/id.json': toJson({
      common: {
        save: 'Save',
        welcome: 'Welcome, {name}',
        mention: 'Connected as @{username}',
      },
    }),
    'content/i18n/docs/en/generated/docs-inventory.generated.json': toJson({
      generated: true,
      manifests: [{ id: 'docs' }],
    }),
    'architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md': snapshotFrontmatter,
  };

  for (const [file, content] of Object.entries(baseFiles)) {
    writeFixtureFile(root, file, content);
  }

  return root;
}

function runGit(root: string, args: string[]) {
  execFileSync('git', args, { cwd: root, stdio: 'pipe' });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('i18n readiness report', () => {
  it('derives canonical, active_ready, active_fallback, and inactive_draft algorithmically', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  en:
    language_name: English
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: canonical
  es:
    language_name: Español
    runtime_active: true
    messages_complete: true
    docs_evidence_generated: true
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: active_ready
  vi:
    language_name: Tiếng Việt
    runtime_active: true
    messages_complete: true
    docs_evidence_generated: false
    ui_qa_done: false
    business_owner: pending
    translation_reviewer: pending
    technical_owner: pending
    approval_date: pending
    activation_verdict: active_fallback
  id:
    language_name: Bahasa Indonesia
    runtime_active: false
    messages_complete: true
    docs_evidence_generated: false
    ui_qa_done: false
    business_owner: pending
    translation_reviewer: pending
    technical_owner: pending
    approval_date: pending
    activation_verdict: inactive_draft
---

# Snapshot
`);

    const evaluation = evaluateI18nReadiness({ root });
    const verdicts = new Map(
      evaluation.records.map((record: ReadinessRecord) => [record.locale, record.activationVerdict]),
    );

    expect(verdicts.get('en')).toBe('canonical');
    expect(verdicts.get('es')).toBe('active_ready');
    expect(verdicts.get('vi')).toBe('active_fallback');
    expect(verdicts.get('id')).toBe('inactive_draft');
  });

  it('keeps system truth authoritative when snapshot disagrees', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  vi:
    language_name: Tiếng Việt
    runtime_active: false
    messages_complete: false
    docs_evidence_generated: false
    ui_qa_done: false
    business_owner: pending
    translation_reviewer: pending
    technical_owner: pending
    approval_date: pending
    activation_verdict: inactive_draft
---

# Snapshot
`);

    const evaluation = evaluateI18nReadiness({ root });
    const vi = evaluation.records.find((record: ReadinessRecord) => record.locale === 'vi');

    expect(vi?.runtimeActive).toBe(true);
    expect(vi?.messagesComplete).toBe(true);
    expect(vi?.docsEvidenceGenerated).toBe(true);
    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'RG-I18N-001-SNAPSHOT-MISMATCH', locale: 'vi', field: 'runtime_active' }),
        expect.objectContaining({ code: 'RG-I18N-001-SNAPSHOT-MISMATCH', locale: 'vi', field: 'messages_complete' }),
        expect.objectContaining({
          code: 'RG-I18N-001-SNAPSHOT-MISMATCH',
          locale: 'vi',
          field: 'docs_evidence_generated',
        }),
      ]),
    );
  });

  it('supports warn and enforce modes deterministically', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  en:
    language_name: English
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: canonical
---

# Snapshot
`);

    const warnEvaluation = evaluateI18nReadiness({ root, mode: 'warn' });
    const enforceEvaluation = evaluateI18nReadiness({ root, mode: 'enforce' });

    expect(warnEvaluation.exitCode).toBe(0);
    expect(enforceEvaluation.exitCode).toBe(1);
    expect(enforceEvaluation.enforcementFindings.length).toBeGreaterThan(0);
  });

  it('writes artifacts and computes a markdown hash', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  en:
    language_name: English
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: canonical
---

# Snapshot
`);

    const evaluation = writeI18nReadinessArtifacts({ root });

    expect(evaluation.markdownHash).toMatch(/^[a-f0-9]{64}$/);
    expect(evaluation.json.markdown_hash).toBe(evaluation.markdownHash);
  });

  it('keeps the markdown hash stable across repeated warn-mode generation', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  en:
    language_name: English
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: canonical
---

# Snapshot
`);

    const first = evaluateI18nReadiness({ root });
    const second = evaluateI18nReadiness({ root });

    expect(first.markdownHash).toBe(second.markdownHash);
    expect(first.markdown).toBe(second.markdown);
  });

  it('reports non-blocking translation coverage estimates per locale', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  en:
    language_name: English
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: canonical
  vi:
    language_name: Tiếng Việt
    runtime_active: true
    messages_complete: true
    docs_evidence_generated: false
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
---

# Snapshot
`);

    const evaluation = evaluateI18nReadiness({ root });
    const vi = evaluation.records.find((record: ReadinessRecord) => record.locale === 'vi');

    expect(vi?.coverage).toEqual({
      translatedKeys: 1,
      totalKeys: 3,
      percent: 33.3,
    });
    expect(evaluation.markdown).toContain('Coverage (estimate)');
    expect(evaluation.json.locales).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          locale: 'vi',
          coverage_estimate: {
            translated_keys: 1,
            total_keys: 3,
            percent: 33.3,
          },
        }),
      ]),
    );
  });

  it('treats TBD governance fields as unresolved', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  vi:
    language_name: Tiếng Việt
    runtime_active: true
    messages_complete: true
    docs_evidence_generated: false
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
---

# Snapshot
`);

    const evaluation = evaluateI18nReadiness({ root });
    const vi = evaluation.records.find((record: ReadinessRecord) => record.locale === 'vi');

    expect(vi?.ownersComplete).toBe(false);
    expect(vi?.approvalDate).toBeNull();
    expect(vi?.activationVerdict).toBe('active_fallback');
    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'RG-I18N-001-OWNERS-PENDING', locale: 'vi' }),
        expect.objectContaining({ code: 'RG-I18N-001-APPROVAL-PENDING', locale: 'vi' }),
      ]),
    );
  });

  it('warns when locale PRs delete keys or add keys without matching source changes', () => {
    const root = createFixture(`---
reviewed_by: Reviewer
last_reviewed_date: '2026-04-27'
source_artifact_hash: pending
locales:
  en:
    language_name: English
    ui_qa_done: true
    business_owner: Docs
    translation_reviewer: Docs
    technical_owner: Platform
    approval_date: '2026-04-27'
    activation_verdict: canonical
  vi:
    language_name: Tiếng Việt
    runtime_active: true
    messages_complete: true
    docs_evidence_generated: false
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
---

# Snapshot
`);

    runGit(root, ['init', '--initial-branch=main']);
    runGit(root, ['config', 'user.email', 'tests@example.com']);
    runGit(root, ['config', 'user.name', 'Test Runner']);
    runGit(root, ['add', '.']);
    runGit(root, ['commit', '-m', 'baseline']);
    runGit(root, ['checkout', '-b', 'feat/i18n-platform']);

    writeFixtureFile(
      root,
      'src/i18n/messages/vi.json',
      JSON.stringify(
        {
          common: {
            save: 'Lưu',
            localeOnly: 'Chỉ trong locale',
          },
        },
        null,
        2,
      ),
    );

    runGit(root, ['add', 'src/i18n/messages/vi.json']);
    runGit(root, ['commit', '-m', 'translate vi']);

    const evaluation = evaluateI18nReadiness({ root, gitBaseRef: 'main' });

    expect(evaluation.translationKeyLifecycle.status).toBe('analyzed');
    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'RG-I18N-001-TRANSLATION-KEY-DELETED', locale: 'vi' }),
        expect.objectContaining({
          code: 'RG-I18N-001-TRANSLATION-KEY-ADDED-WITHOUT-SOURCE',
          locale: 'vi',
        }),
      ]),
    );
  });
});
