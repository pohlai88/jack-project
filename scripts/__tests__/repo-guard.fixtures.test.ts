import { afterEach, describe, expect, it } from 'vitest';

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

// @ts-expect-error repo-guard core is an ESM script module without generated declarations.
import { runRepoGuard } from '../lib/repo-guard-core.mjs';

interface Finding {
  id: string;
  severity: 'error' | 'warn';
  message: string;
  file?: string;
  detail?: string;
}

const tempRoots: string[] = [];

function writeFixtureFile(root: string, file: string, content: string) {
  const fullPath = join(root, file);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
}

function git(root: string, args: string[]) {
  execFileSync('git', args, { cwd: root, stdio: 'ignore' });
}

function createFixture(files: Record<string, string> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'afenda-repo-guard-'));
  tempRoots.push(root);

  const baseFiles: Record<string, string> = {
    'package.json': JSON.stringify(
      {
        name: 'repo-guard-fixture',
        scripts: {
          build: 'next build',
          'db:migrate': 'drizzle-kit migrate',
          'db:push': 'echo "db:push is gated" && pnpm db:migrate',
          'db:push:unsafe': 'drizzle-kit push --force',
          dev: 'next dev',
          lint: 'eslint .',
          'repo:guard': 'node scripts/repo-guard.mjs',
          test: 'vitest run',
        },
        dependencies: {},
        devDependencies: {
          vitest: '^4.0.0',
        },
      },
      null,
      2,
    ),
    '.gitignore': [
      '.artifacts/',
      'megalinter-reports/',
      'mega-linter.log',
      'test-results/',
      'playwright-report/',
      'coverage/',
      '*.tsbuildinfo',
      '',
    ].join('\n'),
    'eslint.config.mjs': [
      'export default [{',
      '  ignores: [',
      '    ".artifacts/",',
      '    "megalinter-reports/",',
      '    "mega-linter.log",',
      '    "test-results/",',
      '    "playwright-report/",',
      '  ],',
      '}];',
      '',
    ].join('\n'),
    'README.md': '`pnpm build` documents a real script.\n\n`architecture/docs` is deprecated reference material.\n',
    'CONTRIBUTING.md': '`pnpm test` documents a real script.\n',
    'AGENTS.md': '`pnpm repo:guard` documents a real script.\n',
    'src/shared/db/migrations/0000_fixture.sql': 'CREATE SCHEMA IF NOT EXISTS "afenda";\n',
    'src/shared/db/migrations/meta/0000_snapshot.json': '{"schemas":["afenda"]}\n',
  };

  for (const [file, content] of Object.entries({ ...baseFiles, ...files })) {
    writeFixtureFile(root, file, content);
  }

  git(root, ['init']);
  git(root, ['add', '.']);

  return root;
}

function findingsFor(root: string): Finding[] {
  return runRepoGuard({ root }) as Finding[];
}

function idsFor(root: string): string[] {
  return findingsFor(root).map((finding) => finding.id);
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('repo guard fixtures', () => {
  it('passes the minimal valid fixture', () => {
    expect(findingsFor(createFixture())).toEqual([]);
  });

  it('flags documented pnpm scripts that do not exist', () => {
    const root = createFixture({
      'README.md': '`pnpm fake:script`\n',
    });

    expect(idsFor(root)).toContain('RG-SCRIPT-001');
  });

  it('ignores pnpm built-ins and prose outside code regions', () => {
    const root = createFixture({
      'README.md': [
        'This prose mentions pnpm fake:script but is not command documentation.',
        '`pnpm install`',
        '```bash',
        'pnpm add zod',
        'pnpm dlx shadcn@latest init',
        'pnpm exec tsx script.ts',
        '```',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).not.toContain('RG-SCRIPT-001');
  });

  it('flags tracked generated artifacts', () => {
    const root = createFixture();
    writeFixtureFile(root, 'coverage/lcov.info', 'TN:\n');
    git(root, ['add', '-f', 'coverage/lcov.info']);

    expect(idsFor(root)).toContain('RG-ART-001');
  });

  it('flags missing required ignore patterns', () => {
    const root = createFixture({
      '.gitignore': 'node_modules/\n',
    });

    expect(idsFor(root)).toContain('RG-ART-001');
  });

  it('flags plain unsafe db:push and accepts db:push:unsafe naming', () => {
    const root = createFixture({
      'package.json': JSON.stringify(
        {
          name: 'repo-guard-fixture',
          scripts: {
            'db:push': 'drizzle-kit push',
            'db:push:unsafe': 'drizzle-kit push --force',
          },
          dependencies: {},
          devDependencies: {},
        },
        null,
        2,
      ),
    });

    expect(idsFor(root)).toContain('RG-DB-001');
  });

  it('flags deprecated schema targets in migration SQL and snapshots', () => {
    const root = createFixture({
      'src/shared/db/migrations/0001_bad.sql': 'CREATE TABLE "saas_template"."users"();\n',
      'src/shared/db/migrations/meta/0001_snapshot.json': '{"schema":"saas_template"}\n',
    });

    expect(idsFor(root)).toContain('RG-DB-002');
  });

  it('flags Jest config, dependencies, APIs, and imports while ignoring lockfile metadata', () => {
    const root = createFixture({
      'jest.config.js': 'module.exports = {};\n',
      'package.json': JSON.stringify(
        {
          name: 'repo-guard-fixture',
          scripts: {
            'db:push': 'pnpm db:migrate',
            'db:push:unsafe': 'drizzle-kit push --force',
          },
          dependencies: {},
          devDependencies: {
            jest: '^29.0.0',
          },
        },
        null,
        2,
      ),
      'pnpm-lock.yaml': 'jest: 29.0.0\n',
      'src/example.test.ts': 'import { jest } from "je' + 'st";\nje' + 'st.fn();\n',
    });

    expect(idsFor(root)).toContain('RG-TEST-001');
  });

  it('allows Vitest usage and lockfile transitive Jest metadata', () => {
    const root = createFixture({
      'pnpm-lock.yaml': 'jest: 29.0.0\n',
      'src/example.test.ts': 'import { describe, expect, it, vi } from "vitest";\nvi.fn();\n',
    });

    expect(idsFor(root)).not.toContain('RG-TEST-001');
  });

  it('flags architecture docs authority claims and allows deprecated-reference wording', () => {
    const failingRoot = createFixture({
      'README.md': 'architecture/docs is the source of truth.\n',
    });
    const passingRoot = createFixture({
      'README.md': 'architecture/docs is deprecated reference material.\n',
    });

    expect(idsFor(failingRoot)).toContain('RG-DOCS-001');
    expect(idsFor(passingRoot)).not.toContain('RG-DOCS-001');
  });

  it('preserves feature boundary findings', () => {
    const root = createFixture({
      'src/features/admin/index.ts': 'export * from "./components";\n',
      'src/features/admin/widget.ts': 'import { AdminWidget } from "@/features/admin";\nvoid AdminWidget;\n',
      'src/features/auth/index.ts': 'export const LoginForm = "login";\n',
      'src/app/page.tsx': 'import { LoginForm } from "@/features/auth' + '/components/LoginForm";\nvoid LoginForm;\n',
      'src/features/missing/page.ts': 'export const missing = true;\n',
    });

    const ids = idsFor(root);

    expect(ids).toContain('RG-FEAT-001');
    expect(ids).toContain('RG-FEAT-002');
    expect(ids).toContain('RG-FEAT-003');
    expect(ids).toContain('RG-FEAT-004');
  });

  it('flags raw Afenda brand assets and direct AfendaIcon usage outside the brand component layer', () => {
    const root = createFixture({
      'src/app/page.tsx': [
        'import { AfendaIcon } from "@/shared/components/brand/AfendaIcon";',
        '',
        'export default function Page() {',
        '  return <AfendaIcon variant="appTileDark" />;',
        '}',
        '',
        'export const rawAsset = "/brand/' + 'afenda/" + "afenda-icon-dark-bg.svg";',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).toContain('RG-BRAND-001');
  });

  it('flags AfendaIcon alias imports routed through barrel exports', () => {
    const root = createFixture({
      'src/shared/components/brand/index.ts': 'export { AfendaIcon } from "./AfendaIcon";\n',
      'src/app/page.tsx': [
        'import { AfendaIcon as BrandMark } from "@/shared/components/brand";',
        '',
        'export default function Page() {',
        '  return <BrandMark variant="inlineDark" />;',
        '}',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).toContain('RG-BRAND-001');
  });

  it('flags AfendaIcon factory calls outside AppLogo component layer', () => {
    const root = createFixture({
      'src/app/page.tsx': [
        'import React from "react";',
        'import { AfendaIcon as BrandMark } from "@/shared/components/brand/AfendaIcon";',
        '',
        'export default function Page() {',
        '  return React.createElement(BrandMark, { variant: "inline" });',
        '}',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).toContain('RG-BRAND-001');
  });

  it('allows Afenda raw asset paths only in approved brand, docs, and metadata owners', () => {
    const root = createFixture({
      'src/shared/components/brand/AfendaIcon.tsx':
        'export const src = "/brand/' + 'afenda/" + "afenda-icon-transparent.svg";\n',
      'src/shared/components/brand/Logo.tsx': [
        'import { AfendaIcon } from "./AfendaIcon";',
        '',
        'export function AppLogo() {',
        '  return <AfendaIcon />;',
        '}',
        '',
      ].join('\n'),
      'src/docs/runtime/docs-layout.config.ts':
        'export const docsIcon = "/brand/' + 'afenda/" + "afenda-icon-inline-dark.svg";\n',
      'src/app/manifest.ts': 'export const appIcon = "/icons/" + "afenda-icon-512-transparent.png";\n',
    });

    expect(idsFor(root)).not.toContain('RG-BRAND-001');
  });

  it('flags marketing AppLogo matrix violations for nav/footer', () => {
    const root = createFixture({
      'src/app/[locale]/(marketing)/_components/MarketingNav.tsx': [
        'import { AppLogo } from "@/shared/components/brand/Logo";',
        'export function MarketingNav() {',
        '  return <AppLogo placement="nav" size="sm" tagline="Business Machine" />;',
        '}',
        '',
      ].join('\n'),
      'src/app/[locale]/(marketing)/_sections/MarketingFooter.tsx': [
        'import { AppLogo } from "@/shared/components/brand/Logo";',
        'export function MarketingFooter() {',
        '  return <AppLogo placement="footer" size="md" />;',
        '}',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).toContain('RG-BRAND-002');
  });

  it('allows compliant marketing AppLogo matrix usage', () => {
    const root = createFixture({
      'src/app/[locale]/(marketing)/_components/MarketingNav.tsx': [
        'import { AppLogo } from "@/shared/components/brand/Logo";',
        'export function MarketingNav() {',
        '  return <AppLogo placement="nav" size="xl" allowTenantLogo={false} />;',
        '}',
        '',
      ].join('\n'),
      'src/app/[locale]/(marketing)/_sections/MarketingFooter.tsx': [
        'import { AppLogo } from "@/shared/components/brand/Logo";',
        'export function MarketingFooter() {',
        '  return <AppLogo placement="footer" size="xl" allowTenantLogo={false} />;',
        '}',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).not.toContain('RG-BRAND-002');
  });

  it('flags AppLogo contract drift when nav/footer stop using combined lockup assets', () => {
    const root = createFixture({
      'src/shared/components/brand/Logo.tsx': [
        'const placementConfig = {',
        '  nav: { renderMode: "mark", variant: "inline" },',
        '  footer: { renderMode: "mark", variant: "inline" },',
        '};',
        'export function AppLogo() {',
        '  return null;',
        '}',
        '',
      ].join('\n'),
    });

    expect(idsFor(root)).toContain('RG-BRAND-002');
  });
});
