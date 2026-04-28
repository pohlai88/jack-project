import { describe, expect, it } from 'vitest';

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const CORPUS_PATH = 'content/i18n/docs';
function posix(path: string) {
  return path.replace(/\\/g, '/');
}

function collectFiles(rootDir: string, includeExts = ['.ts', '.tsx', '.mjs', '.mts', '.cts', '.cjs']) {
  const out: string[] = [];
  const walk = (directory: string) => {
    if (!existsSync(directory)) {
      return;
    }

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '.next' || entry.name === 'node_modules' || entry.name === 'dist') continue;
      const full = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      const ext = full.slice(full.lastIndexOf('.'));
      if (includeExts.includes(ext)) {
        out.push(full);
      }
    }
  };
  walk(resolve(ROOT, rootDir));
  return out;
}

function readText(file: string) {
  return readFileSync(file, 'utf8');
}

function testFilesIn(rootDir: string, includeExts = ['.ts', '.tsx', '.mjs', '.mts', '.cts', '.cjs']) {
  return collectFiles(rootDir, includeExts).map((file) => posix(relative(ROOT, file)));
}

describe('docs boundary assertions', () => {
  it('does not keep old docs route-group paths in app routes', () => {
    const appFiles = testFilesIn('src/app');
    for (const file of appFiles) {
      const content = readText(resolve(ROOT, file));
      expect.soft(
        content,
        `${file} still contains legacy [docs] route-group path. Remove "(docs)/docs" structure.`,
      ).not.toMatch(/\(docs\)\/docs/);
    }
  });

  it('does not reference legacy docs/content in code path', () => {
    const testFile = 'scripts/__tests__/docs-boundary.test.ts';
    const targets = [
      ...testFilesIn('src'),
      ...testFilesIn('scripts'),
      ...testFilesIn('test'),
      ...testFilesIn('tests'),
      ...testFilesIn('architecture', ['.ts', '.tsx', '.mjs', '.mts', '.cts', '.cjs', '.js']),
    ];

    for (const file of targets) {
      if (file === testFile) {
        continue;
      }
      const content = readText(resolve(ROOT, file));
      expect.soft(
        content,
        `${file} still references legacy docs/content path.`,
      ).not.toContain('docs/content');
    }
  });

  it('keeps content/i18n/docs references in the approved boundary touchpoints', () => {
    const testFile = 'scripts/__tests__/docs-boundary.test.ts';
    const allowedReferences = new Set([
      'source.config.ts',
      'src/app/[locale]/docs/[[...slug]]/page.tsx',
      'scripts/docs-validate-links.ts',
      'scripts/docs-evidence-pipeline.ts',
      'scripts/lib/i18n-readiness-core.mjs',
      'scripts/__tests__/i18n-readiness-report.test.ts',
    ]);

    const targetFiles = [...testFilesIn('src'), ...testFilesIn('scripts')];
    for (const file of targetFiles) {
      if (file === testFile) {
        continue;
      }
      const content = readText(resolve(ROOT, file));
      if (!content.includes(CORPUS_PATH)) {
        continue;
      }
      expect(
        allowedReferences.has(file),
        `${file} references ${CORPUS_PATH} outside approved boundary files.`,
      ).toBe(true);
    }
  });

  it('keeps i18n runtime free from markdown corpus coupling', () => {
    const i18nFiles = testFilesIn('src/i18n');
    for (const file of i18nFiles) {
      const content = readText(resolve(ROOT, file));
      expect.soft(content, `${file} should not import markdown corpus artifacts.`).not.toMatch(/`?['"][^'"]+\.mdx['"]/);
      expect.soft(content, `${file} should not import the content corpus path directly.`).not.toContain(CORPUS_PATH);
    }
  });
});
