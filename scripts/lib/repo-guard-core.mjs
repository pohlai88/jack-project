import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const legacyTestAlias = '@/' + '__tests__';
const testSupportAlias = '@tests/';

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

const sourceCodeExtensions = new Set(['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx']);
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
  '.artifacts/reports/coverage/',
  'megalinter-reports/',
  'test-results/',
  'playwright-report/',
  '.vitest/',
  '.vite/',
];
const forbiddenTrackedFiles = new Set(['mega-linter.log']);
const forbiddenTrackedSuffixes = ['.tsbuildinfo'];
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
const docsAuthorityFiles = ['README.md', 'CONTRIBUTING.md', 'AGENTS.md'];
const documentedScriptFiles = docsAuthorityFiles;
const pnpmBuiltIns = new Set(['install', 'add', 'remove', 'dlx', 'exec']);
const legacyJestPackages = new Set([
  'jest',
  'ts-jest',
  'babel-jest',
  '@types/jest',
  'eslint-plugin-jest',
  'jest-environment-jsdom',
  'jest-transform-stub',
]);

function addFinding(context, id, message, options = {}) {
  context.findings.push({
    id,
    severity: options.severity ?? 'error',
    message,
    file: options.file,
    detail: options.detail,
  });
}

function normalizePath(path) {
  return path.replaceAll('\\', '/');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readJsonFile(context, file) {
  return JSON.parse(readFileSync(join(context.root, file), 'utf8'));
}

function listFilesRecursive(context, dir) {
  const fullDir = join(context.root, dir);
  if (!existsSync(fullDir)) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(fullDir, { withFileTypes: true })) {
    const relativePath = normalizePath(`${dir}/${entry.name}`);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(context, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

function getCandidateFiles(context) {
  const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd: context.root,
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
        file.startsWith('test-results/') ||
        file.startsWith('.vitest/') ||
        file.startsWith('.vite/')
      ) {
        return false;
      }

      return textFileExtensions.has(extname(file));
    });
}

function getTrackedFiles(context) {
  const output = execFileSync('git', ['ls-files'], {
    cwd: context.root,
    encoding: 'utf8',
  });

  return output.split(/\r?\n/).filter(Boolean).map(normalizePath);
}

function isTestFile(file) {
  return /\.(test|spec)\.(ts|tsx)$/.test(file);
}

function isSourceCodeFile(file) {
  return sourceCodeExtensions.has(extname(file));
}

function isAllowedTestSupportConsumer(file) {
  return file.startsWith('tests/') || isTestFile(file);
}

function isRepoOwnedCodeScanFile(file) {
  if (!isSourceCodeFile(file)) {
    return false;
  }

  if (file === 'scripts/repo-guard.mjs' || file === 'scripts/lib/repo-guard-core.mjs') {
    return false;
  }

  return (
    file.startsWith('src/') ||
    file.startsWith('tests/') ||
    file.startsWith('scripts/') ||
    file === 'vitest.config.ts' ||
    file === 'vitest.setup.tsx'
  );
}

function getFeatureDirectories(context) {
  const featuresRoot = join(context.root, 'src', 'features');
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

function checkRequiredIgnore(context, file, requiredValues, label) {
  const path = join(context.root, file);
  const content = existsSync(path) ? readFileSync(path, 'utf8') : '';

  for (const value of requiredValues) {
    if (!content.includes(value)) {
      addFinding(context, 'RG-ART-001', `${label} must include ${value}`, { file });
    }
  }
}

function checkTrackedGeneratedFiles(context) {
  for (const file of getTrackedFiles(context)) {
    const isForbiddenRoot = forbiddenTrackedRoots.some((rootPath) => file.startsWith(rootPath));
    const isForbiddenFile = forbiddenTrackedFiles.has(file);
    const isForbiddenSuffix = forbiddenTrackedSuffixes.some((suffix) => file.endsWith(suffix));

    if (isForbiddenRoot || isForbiddenFile || isForbiddenSuffix) {
      addFinding(context, 'RG-ART-001', 'generated artifact/report is tracked', { file });
    }
  }
}

function checkDocumentedPackageScripts(context) {
  const packageJson = readJsonFile(context, 'package.json');
  const scripts = new Set(Object.keys(packageJson.scripts ?? {}));
  const commandPattern = /\bpnpm(?:\s+run)?\s+([A-Za-z0-9:_-]+)/g;

  for (const file of documentedScriptFiles) {
    const fullPath = join(context.root, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');
    const commandRegions = [
      ...[...content.matchAll(/```[\w-]*\r?\n([\s\S]*?)```/g)].map((match) => match[1]),
      ...[...content.matchAll(/`([^`\r\n]*pnpm[^`\r\n]*)`/g)].map((match) => match[1]),
    ];

    for (const region of commandRegions) {
      for (const match of region.matchAll(commandPattern)) {
        const command = match[1];
        if (pnpmBuiltIns.has(command)) {
          continue;
        }

        if (!scripts.has(command)) {
          addFinding(context, 'RG-SCRIPT-001', `documented pnpm script does not exist: ${command}`, { file });
        }
      }
    }
  }
}

function checkDatabaseSafety(context) {
  const packageJson = readJsonFile(context, 'package.json');
  const scripts = packageJson.scripts ?? {};

  if (/\bdrizzle-kit\s+push\b/.test(scripts['db:push'] ?? '')) {
    addFinding(context, 'RG-DB-001', 'db:push must not directly invoke drizzle-kit push', { file: 'package.json' });
  }

  if (!scripts['db:push:unsafe']) {
    addFinding(context, 'RG-DB-001', 'db:push:unsafe script is required for forced schema push behavior', {
      file: 'package.json',
    });
  }

  const unsafePushScript = scripts['db:push:unsafe'] ?? '';
  if (unsafePushScript && !/\bdrizzle-kit\s+push\b/.test(unsafePushScript)) {
    addFinding(context, 'RG-DB-001', 'db:push:unsafe must contain the explicit unsafe Drizzle push command', {
      file: 'package.json',
    });
  }

  for (const file of docsAuthorityFiles) {
    const fullPath = join(context.root, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const lines = readFileSync(fullPath, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      const mentionsDbPush = /`?pnpm\s+db:push`?/.test(line) || /`?db:push`?/.test(line);
      const describesDirectPush = /\b(push schema|direct schema|schema push|dev only)\b/i.test(line);
      const describesGuardedAlias = /\b(alias|db:migrate|gated|unsafe)\b/i.test(line);

      if (mentionsDbPush && describesDirectPush && !describesGuardedAlias) {
        addFinding(context, 'RG-DB-001', 'plain db:push must not be documented as normal direct schema push', {
          file,
          detail: `line ${index + 1}`,
        });
      }
    });
  }
}

function checkMigrationTargets(context) {
  const migrationFiles = listFilesRecursive(context, 'src/shared/db/migrations').filter((file) =>
    ['.sql', '.json'].includes(extname(file)),
  );

  for (const file of migrationFiles) {
    const content = readFileSync(join(context.root, file), 'utf8');
    if (content.includes('saas_template')) {
      addFinding(context, 'RG-DB-002', 'migration files must not target deprecated schema saas_template', { file });
    }
  }
}

function checkDocsAuthorityClaims(context) {
  const forbiddenDocsAuthorityPatterns = [
    /architecture\/docs[^\n]*(source of truth|authoritative|authority)/i,
    /(source of truth|authoritative|authority)[^\n]*architecture\/docs/i,
    /docs\/[^\n]*(source of truth|authoritative|authority)/i,
  ];

  for (const file of docsAuthorityFiles) {
    const fullPath = join(context.root, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const lines = readFileSync(fullPath, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      const isDeprecatedReference = /deprecated|reference|not authoritative|must not be treated as authoritative/i.test(
        line,
      );
      if (isDeprecatedReference) {
        return;
      }

      if (forbiddenDocsAuthorityPatterns.some((pattern) => pattern.test(line))) {
        addFinding(context, 'RG-DOCS-001', 'architecture/docs must not be described as authoritative', {
          file,
          detail: `line ${index + 1}`,
        });
      }
    });
  }
}

function checkLegacyJestUsage(context) {
  for (const file of readdirSync(context.root)) {
    if (/^jest\.config\.(cjs|cts|js|jsx|mjs|mts|ts|tsx)$/.test(file) && statSync(join(context.root, file)).isFile()) {
      addFinding(context, 'RG-TEST-001', 'legacy Jest config file is forbidden', { file });
    }
  }

  const packageJson = readJsonFile(context, 'package.json');
  for (const dependencyGroup of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    const dependencies = packageJson[dependencyGroup] ?? {};
    for (const dependency of Object.keys(dependencies)) {
      if (legacyJestPackages.has(dependency)) {
        addFinding(context, 'RG-TEST-001', `legacy Jest dependency is forbidden: ${dependency}`, {
          file: 'package.json',
          detail: dependencyGroup,
        });
      }
    }
  }

  const legacyJestApi =
    /\bjest\.(fn|mock|spyOn|clearAllMocks|resetAllMocks|restoreAllMocks|useFakeTimers|useRealTimers|requireActual|requireMock)\b/;
  const legacyJestImport = /\bfrom\s+['"](?:jest|@jest\/[^'"]+)['"]|require\(\s*['"](?:jest|@jest\/[^'"]+)['"]\s*\)/;

  for (const file of getCandidateFiles(context)) {
    if (!isRepoOwnedCodeScanFile(file)) {
      continue;
    }

    const content = readFileSync(join(context.root, file), 'utf8');
    if (legacyJestApi.test(content)) {
      addFinding(context, 'RG-TEST-001', 'legacy Jest API usage is forbidden', { file });
    }

    if (legacyJestImport.test(content)) {
      addFinding(context, 'RG-TEST-001', 'legacy Jest imports are forbidden', { file });
    }
  }
}

function checkSourceBoundaries(context) {
  for (const file of getCandidateFiles(context)) {
    const fullPath = join(context.root, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');

    if (content.includes(legacyTestAlias)) {
      addFinding(context, 'RG-TEST-001', 'legacy test helper alias found', { file });
    }

    if (file.startsWith('src/') && !isAllowedTestSupportConsumer(file) && content.includes(testSupportAlias)) {
      addFinding(context, 'RG-TEST-001', 'production source imports test support', { file });
    }
  }
}

function checkFeatureRootBarrels(context) {
  for (const feature of getFeatureDirectories(context)) {
    const indexFile = `src/features/${feature}/index.ts`;
    const fullPath = join(context.root, indexFile);

    if (!existsSync(fullPath)) {
      addFinding(context, 'RG-FEAT-001', 'missing feature root barrel', { file: indexFile });
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');

    for (const specifier of forbiddenFeatureRootWildcardExports) {
      const pattern = new RegExp(
        String.raw`^\s*export\s+\*\s+from\s+['"]${escapeRegExp(specifier)}(?:\/index)?['"];?`,
        'm',
      );
      if (pattern.test(content)) {
        addFinding(context, 'RG-FEAT-004', 'forbidden wildcard root export in feature barrel', {
          file: indexFile,
          detail: `export * from "${specifier}"`,
        });
      }
    }
  }
}

function checkFeatureImportBoundaries(context) {
  for (const file of getCandidateFiles(context)) {
    if (!isSourceCodeFile(file)) {
      continue;
    }

    const fullPath = join(context.root, file);
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
          addFinding(context, 'RG-FEAT-003', 'same-feature deep alias import found', {
            file,
            detail: fullSpecifier,
          });
        } else {
          addFinding(context, 'RG-FEAT-002', 'deep feature import found', {
            file,
            detail: fullSpecifier,
          });
        }
        continue;
      }

      if (ownerFeature === targetFeature) {
        addFinding(context, 'RG-FEAT-003', 'same-feature root barrel import found', {
          file,
          detail: fullSpecifier,
        });
      }
    }
  }
}

export function runRepoGuard({ root = process.cwd() } = {}) {
  const context = {
    root,
    findings: [],
  };

  checkRequiredIgnore(context, '.gitignore', requiredGitIgnores, '.gitignore');
  checkRequiredIgnore(context, 'eslint.config.mjs', requiredEslintIgnores, 'ESLint ignores');
  checkTrackedGeneratedFiles(context);
  checkDocumentedPackageScripts(context);
  checkDatabaseSafety(context);
  checkMigrationTargets(context);
  checkDocsAuthorityClaims(context);
  checkLegacyJestUsage(context);
  checkSourceBoundaries(context);
  checkFeatureRootBarrels(context);
  checkFeatureImportBoundaries(context);

  return context.findings;
}
