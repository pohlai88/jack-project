import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const legacyTestAlias = '@/' + '__tests__';
const testSupportAlias = '@tests/';

const errors = [];

const textFileExtensions = new Set([
  '.cjs',
  '.cts',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
  '.yml',
  '.yaml',
]);

const requiredGitIgnores = [
  '.artifacts/',
  'megalinter-reports/',
  'mega-linter.log',
  'test-results/',
  'playwright-report/',
];
const requiredEslintIgnores = [
  '.artifacts/',
  'megalinter-reports/',
  'mega-linter.log',
  'test-results/',
  'playwright-report/',
];
const forbiddenTrackedRoots = [
  'coverage/',
  '.artifacts/',
  'megalinter-reports/',
  'test-results/',
  'playwright-report/',
];
const forbiddenTrackedFiles = new Set(['mega-linter.log']);
const sourceCodeExtensions = new Set(['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx']);
const featureImportPattern = /(?:from\s+|import\s*\()\s*['"](@\/features\/([^/'"]+)(\/[^'"]+)?)['"]/g;
const forbiddenFeatureRootWildcardExports = [
  './components',
  './hooks',
  './lib',
  './utils',
  './actions',
  './services',
  './__tests__',
  './test-utils',
];

function normalizePath(path) {
  return path.replaceAll('\\', '/');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCandidateFiles() {
  const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd: root,
    encoding: 'utf8',
  });

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map(normalizePath)
    .filter((file) => {
      if (
        file.startsWith('.git/') ||
        file.startsWith('.next/') ||
        file.startsWith('.artifacts/') ||
        file.startsWith('coverage/') ||
        file.startsWith('node_modules/') ||
        file.startsWith('megalinter-reports/') ||
        file.startsWith('playwright-report/') ||
        file.startsWith('test-results/')
      ) {
        return false;
      }

      const extension = file.slice(file.lastIndexOf('.'));
      return textFileExtensions.has(extension);
    });
}

function getTrackedFiles() {
  const output = execFileSync('git', ['ls-files'], {
    cwd: root,
    encoding: 'utf8',
  });

  return output.split(/\r?\n/).filter(Boolean).map(normalizePath);
}

function isTestFile(file) {
  return /\.(test|spec)\.(ts|tsx)$/.test(file);
}

function isSourceCodeFile(file) {
  const extension = file.slice(file.lastIndexOf('.'));
  return sourceCodeExtensions.has(extension);
}

function isAllowedTestSupportConsumer(file) {
  return file.startsWith('tests/') || isTestFile(file);
}

function getFeatureDirectories() {
  const featuresRoot = join(root, 'src', 'features');
  if (!existsSync(featuresRoot)) {
    return [];
  }

  return readdirSync(featuresRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function getOwningFeature(file) {
  const match = /^src\/features\/([^/]+)\//.exec(file);
  return match?.[1] ?? null;
}

function checkRequiredIgnore(file, requiredValues, label) {
  const path = join(root, file);
  const content = existsSync(path) ? readFileSync(path, 'utf8') : '';

  for (const value of requiredValues) {
    if (!content.includes(value)) {
      errors.push(`${label} must include ${value}`);
    }
  }
}

function checkTrackedGeneratedFiles() {
  for (const file of getTrackedFiles()) {
    if (forbiddenTrackedFiles.has(file) || forbiddenTrackedRoots.some((rootPath) => file.startsWith(rootPath))) {
      errors.push(`RG-ART-001: generated artifact/report is tracked: ${file}`);
    }
  }
}

function checkSourceBoundaries() {
  const legacyDependencyMarkers = [
    '@types/jest',
    'eslint-plugin-jest',
    'jest-environment-jsdom',
    'jest-transform-stub',
    'ts-jest',
  ];
  const legacyJestApi =
    /\bjest\.(fn|mock|spyOn|clearAllMocks|resetAllMocks|restoreAllMocks|useFakeTimers|useRealTimers|requireActual|requireMock)\b/;

  for (const file of getCandidateFiles()) {
    if (file === 'scripts/repo-guard.mjs' || file === 'pnpm-lock.yaml') {
      continue;
    }

    const path = join(root, file);
    if (!existsSync(path)) {
      continue;
    }

    const content = readFileSync(path, 'utf8');

    if (content.includes(legacyTestAlias)) {
      errors.push(`RG-TEST-001: legacy test helper alias found in ${file}`);
    }

    if (file.startsWith('src/') && !isAllowedTestSupportConsumer(file) && content.includes(testSupportAlias)) {
      errors.push(`RG-TEST-001: production source imports test support in ${file}`);
    }

    if (legacyJestApi.test(content)) {
      errors.push(`RG-TEST-001: legacy Jest API found in ${file}`);
    }

    for (const marker of legacyDependencyMarkers) {
      if (content.includes(marker)) {
        errors.push(`RG-TEST-001: legacy Jest dependency/config marker "${marker}" found in ${file}`);
      }
    }
  }
}

function checkFeatureRootBarrels() {
  for (const feature of getFeatureDirectories()) {
    const indexFile = `src/features/${feature}/index.ts`;
    const fullPath = join(root, indexFile);

    if (!existsSync(fullPath)) {
      errors.push(`RG-FEAT-001: missing feature root barrel ${indexFile}`);
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');

    for (const specifier of forbiddenFeatureRootWildcardExports) {
      const pattern = new RegExp(
        String.raw`^\s*export\s+\*\s+from\s+['"]${escapeRegExp(specifier)}(?:\/index)?['"];?`,
        'm',
      );
      if (pattern.test(content)) {
        errors.push(`RG-FEAT-004: forbidden wildcard root export in ${indexFile}: export * from "${specifier}"`);
      }
    }
  }
}

function checkFeatureImportBoundaries() {
  for (const file of getCandidateFiles()) {
    if (!isSourceCodeFile(file)) {
      continue;
    }

    const fullPath = join(root, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');
    const ownerFeature = getOwningFeature(file);

    for (const match of content.matchAll(featureImportPattern)) {
      const fullSpecifier = match[1];
      const targetFeature = match[2];
      const deepPath = match[3];

      if (deepPath) {
        if (ownerFeature === targetFeature) {
          errors.push(`RG-FEAT-003: same-feature deep alias import found in ${file}: ${fullSpecifier}`);
        } else {
          errors.push(`RG-FEAT-002: deep feature import found in ${file}: ${fullSpecifier}`);
        }
        continue;
      }

      if (ownerFeature === targetFeature) {
        errors.push(`RG-FEAT-003: same-feature root barrel import found in ${file}: ${fullSpecifier}`);
      }
    }
  }
}

checkRequiredIgnore('.gitignore', requiredGitIgnores, 'RG-ART-001: .gitignore');
checkRequiredIgnore('eslint.config.mjs', requiredEslintIgnores, 'RG-ART-001: ESLint ignores');
checkTrackedGeneratedFiles();
checkSourceBoundaries();
checkFeatureRootBarrels();
checkFeatureImportBoundaries();

if (errors.length > 0) {
  console.error('Repo guard failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Repo guard passed.');
