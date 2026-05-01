import ts from 'typescript';

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
const afendaRawAssetAllowlist = new Set([
  'eslint.config.mjs',
  'src/shared/components/brand/Logo.tsx',
  'src/shared/components/brand/AfendaIcon.tsx',
  'src/docs/runtime/docs-layout.config.ts',
  'src/app/layout.tsx',
  'src/app/manifest.ts',
  'src/app/[locale]/docs/layout.tsx',
  'src/docs/runtime/docs-rss.generator.ts',
]);
const afendaIconComponentAllowlist = new Set([
  'src/shared/components/brand/Logo.tsx',
  'src/shared/components/brand/AfendaIcon.tsx',
  'src/shared/components/ui/brand-identity.stories.tsx',
  'src/shared/components/ui/design-tokens.stories.tsx',
]);
const afendaRawAssetPathPattern = /\/(?:brand\/afenda\/|icons\/afenda-icon-)/;

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

    const fullPath = join(context.root, file);
    if (!existsSync(fullPath)) {
      // `git ls-files --cached` can still list paths deleted on disk until the removal is staged.
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');
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

function lineForTsNode(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function getJsxTagName(node) {
  if (ts.isIdentifier(node)) {
    return node.text;
  }

  if (ts.isPropertyAccessExpression(node)) {
    return node.name.text;
  }

  return null;
}

function getImportLocalNames(importClause) {
  if (!importClause) {
    return [];
  }

  const names = [];
  if (importClause.name) {
    names.push(importClause.name.text);
  }

  const namedBindings = importClause.namedBindings;
  if (!namedBindings) {
    return names;
  }

  if (ts.isNamespaceImport(namedBindings)) {
    names.push(namedBindings.name.text);
    return names;
  }

  for (const element of namedBindings.elements) {
    names.push(element.name.text);
  }

  return names;
}

function isAfendaIconModuleSpecifier(specifier) {
  return /(?:^|\/|\.)AfendaIcon$/.test(specifier);
}

function isAppLogoModuleSpecifier(specifier) {
  return /(?:^|\/)(?:brand\/)?Logo$/.test(specifier);
}

function getJsxAttribute(node, attributeName) {
  for (const property of node.attributes.properties) {
    if (ts.isJsxAttribute(property) && property.name.text === attributeName) {
      return property;
    }
  }

  return null;
}

function getJsxAttributeStringValue(attribute) {
  if (!attribute?.initializer) {
    return null;
  }

  if (ts.isStringLiteral(attribute.initializer)) {
    return attribute.initializer.text;
  }

  if (ts.isJsxExpression(attribute.initializer)) {
    const expression = attribute.initializer.expression;
    if (expression && ts.isStringLiteralLike(expression)) {
      return expression.text;
    }
  }

  return null;
}

function jsxAttributeHasTruthyValue(attribute) {
  if (!attribute) {
    return false;
  }

  if (!attribute.initializer) {
    return true;
  }

  if (ts.isStringLiteral(attribute.initializer)) {
    return attribute.initializer.text.trim().length > 0;
  }

  if (ts.isJsxExpression(attribute.initializer)) {
    const expression = attribute.initializer.expression;
    if (!expression) {
      return false;
    }

    if (expression.kind === ts.SyntaxKind.FalseKeyword || expression.kind === ts.SyntaxKind.NullKeyword) {
      return false;
    }

    if (ts.isIdentifier(expression) && expression.text === 'undefined') {
      return false;
    }

    if (ts.isStringLiteralLike(expression)) {
      return expression.text.trim().length > 0;
    }
  }

  return true;
}

function jsxAttributeIsFalseLiteral(attribute) {
  if (!attribute?.initializer || !ts.isJsxExpression(attribute.initializer)) {
    return false;
  }

  const expression = attribute.initializer.expression;
  return Boolean(expression && expression.kind === ts.SyntaxKind.FalseKeyword);
}

function checkAppLogoCombinedLockupContract(context) {
  const file = 'src/shared/components/brand/Logo.tsx';
  const fullPath = join(context.root, file);
  if (!existsSync(fullPath)) {
    return;
  }

  const content = readFileSync(fullPath, 'utf8');
  const requiredPatterns = [
    /nav:\s*\{[\s\S]*?renderMode:\s*'combinedLockup'/,
    /footer:\s*\{[\s\S]*?renderMode:\s*'combinedLockup'/,
    /afenda-combined-lockup-transparent\.svg/,
    /afenda-combined-lockup-inline-dark\.svg/,
  ];

  for (const pattern of requiredPatterns) {
    if (!pattern.test(content)) {
      addFinding(context, 'RG-BRAND-002', 'AppLogo nav/footer must map to combined lockup assets', { file });
      return;
    }
  }
}

function checkAfendaBrandUsage(context) {
  for (const file of getCandidateFiles(context)) {
    if (!isSourceCodeFile(file)) {
      continue;
    }

    const fullPath = join(context.root, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');
    const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const afendaIconLocalNames = new Set(['AfendaIcon']);
    const appLogoLocalNames = new Set(['AppLogo']);
    const rawAssetAllowed = afendaRawAssetAllowlist.has(file);
    const afendaIconAllowed = afendaIconComponentAllowlist.has(file);
    const marketingPlacementFile = file.startsWith('src/app/[locale]/(marketing)/');

    const visit = (node) => {
      if (
        !rawAssetAllowed &&
        (ts.isStringLiteralLike(node) ||
          ts.isTemplateHead(node) ||
          ts.isTemplateMiddle(node) ||
          ts.isTemplateTail(node))
      ) {
        const text = 'text' in node ? node.text : node.rawText;
        if (typeof text === 'string' && afendaRawAssetPathPattern.test(text)) {
          addFinding(context, 'RG-BRAND-001', 'raw Afenda brand asset path found outside approved asset owner', {
            file,
            detail: `line ${lineForTsNode(sourceFile, node)}`,
          });
        }
      }

      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const specifier = node.moduleSpecifier.text;
        let restrictImport = false;

        if (isAfendaIconModuleSpecifier(specifier)) {
          getImportLocalNames(node.importClause).forEach((name) => afendaIconLocalNames.add(name));
          restrictImport = true;
        }

        const namedBindings = node.importClause?.namedBindings;
        if (namedBindings && ts.isNamedImports(namedBindings)) {
          for (const element of namedBindings.elements) {
            const importedName = element.propertyName?.text ?? element.name.text;
            if (importedName === 'AfendaIcon') {
              afendaIconLocalNames.add(element.name.text);
              restrictImport = true;
            }

            if (isAppLogoModuleSpecifier(specifier) && importedName === 'AppLogo') {
              appLogoLocalNames.add(element.name.text);
            }
          }
        }

        if (isAppLogoModuleSpecifier(specifier) && node.importClause?.name) {
          appLogoLocalNames.add(node.importClause.name.text);
        }

        if (isAppLogoModuleSpecifier(specifier)) {
          const namespaceImport = node.importClause?.namedBindings;
          if (namespaceImport && ts.isNamespaceImport(namespaceImport)) {
            appLogoLocalNames.add(namespaceImport.name.text);
          }
        }

        if (restrictImport && !afendaIconAllowed) {
          addFinding(context, 'RG-BRAND-001', 'AfendaIcon imports are restricted to the AppLogo component layer', {
            file,
            detail: `line ${lineForTsNode(sourceFile, node)}`,
          });
        }
      }

      if (!afendaIconAllowed && ts.isJsxOpeningLikeElement(node)) {
        const tagName = getJsxTagName(node.tagName);
        if (tagName && afendaIconLocalNames.has(tagName)) {
          addFinding(context, 'RG-BRAND-001', 'AfendaIcon JSX usage must go through AppLogo placement semantics', {
            file,
            detail: `line ${lineForTsNode(sourceFile, node)}`,
          });
        }
      }

      if (marketingPlacementFile && ts.isJsxOpeningLikeElement(node)) {
        const tagName = getJsxTagName(node.tagName);
        if (tagName && appLogoLocalNames.has(tagName)) {
          const placementAttribute = getJsxAttribute(node, 'placement');
          const placement = getJsxAttributeStringValue(placementAttribute);
          const isMarketingBrandPlacement = placement === 'nav' || placement === 'footer';

          if (isMarketingBrandPlacement) {
            const allowTenantLogoAttribute = getJsxAttribute(node, 'allowTenantLogo');
            if (!jsxAttributeIsFalseLiteral(allowTenantLogoAttribute)) {
              addFinding(context, 'RG-BRAND-002', 'marketing AppLogo nav/footer must disable tenant-logo overrides', {
                file,
                detail: `line ${lineForTsNode(sourceFile, node)}`,
              });
            }

            const taglineAttribute = getJsxAttribute(node, 'tagline');
            if (jsxAttributeHasTruthyValue(taglineAttribute)) {
              addFinding(context, 'RG-BRAND-002', 'marketing AppLogo nav/footer must not render tagline text', {
                file,
                detail: `line ${lineForTsNode(sourceFile, node)}`,
              });
            }

            const sizeAttribute = getJsxAttribute(node, 'size');
            const size = getJsxAttributeStringValue(sizeAttribute);
            if (placement === 'nav' && size && size !== 'xl') {
              addFinding(context, 'RG-BRAND-002', 'marketing nav AppLogo size must be xl (64px) when explicitly set', {
                file,
                detail: `line ${lineForTsNode(sourceFile, node)}`,
              });
            }

            if (placement === 'footer' && size && size !== 'xl') {
              addFinding(
                context,
                'RG-BRAND-002',
                'marketing footer AppLogo size must be xl (64px) when explicitly set',
                {
                  file,
                  detail: `line ${lineForTsNode(sourceFile, node)}`,
                },
              );
            }
          }
        }
      }

      if (!afendaIconAllowed && ts.isCallExpression(node)) {
        const firstArgument = node.arguments[0];
        if (firstArgument && ts.isIdentifier(firstArgument) && afendaIconLocalNames.has(firstArgument.text)) {
          addFinding(context, 'RG-BRAND-001', 'AfendaIcon factory usage must go through AppLogo placement semantics', {
            file,
            detail: `line ${lineForTsNode(sourceFile, firstArgument)}`,
          });
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
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
  checkAppLogoCombinedLockupContract(context);
  checkAfendaBrandUsage(context);

  return context.findings;
}
