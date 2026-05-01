import postcss, { type AtRule, type Declaration, type Root, type Rule } from 'postcss';
import ts from 'typescript';

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

type Verdict = 'PASS' | 'WARN' | 'FAIL';
type Layer =
  | 'Foundation Truth'
  | 'Selector Truth'
  | 'Token Usage Truth'
  | 'Component Adoption Truth'
  | 'Surface Ownership Truth';

type Finding = {
  layer: Layer;
  verdict: Exclude<Verdict, 'PASS'>;
  file: string;
  line: number;
  rule: string;
  message: string;
};

type ReportFormat = 'text' | 'json' | 'markdown';

type VerifyOptions = {
  rootDir?: string;
  format?: ReportFormat;
  output?: string;
};

type VerifyReport = {
  status: Verdict;
  findings: Finding[];
  layers: Record<Layer, Verdict>;
};

type TsxClassInventory = {
  tokens: Set<string>;
  findings: Finding[];
};

const root = process.cwd();

const layerOrder: Layer[] = [
  'Foundation Truth',
  'Selector Truth',
  'Token Usage Truth',
  'Component Adoption Truth',
  'Surface Ownership Truth',
];

const classFunctionNames = new Set(['cn', 'clsx', 'cva', 'joinClasses']);
const allowedDynamicClassIdentifiers = new Set(['className', 'containerClassName']);
const structuralClassPrefixes = ['landing-', 'marketing-'];

const landingDesignContract = {
  requiredTokens: [
    '--landing-container-max',
    '--landing-page-x',
    '--landing-edge-x',
    '--landing-outer-gutter',
    '--landing-container-width',
    '--landing-nav-content-height',
    '--landing-truth-ledger-hit-height',
    '--landing-truth-ledger-rail-height',
    '--landing-truth-ladder-width',
    '--landing-truth-ladder-top',
    '--landing-header-height',
    '--landing-under-header-gap',
    '--landing-section-y',
    '--landing-section-y-compact',
    '--landing-act-y',
    '--landing-hero-padding-block-start',
    '--landing-hero-padding-block-end',
    '--landing-hero-gap',
    '--landing-hero-stage-min',
    '--landing-panel-radius',
    '--landing-inner-radius',
    '--landing-panel-border',
    '--landing-panel-background',
    '--landing-panel-shadow',
    '--landing-divider',
    '--landing-label-tracking',
    '--landing-status-tracking',
  ],
  requiredSelectors: [
    '.marketing-root',
    '.marketing-nav',
    '.marketing-nav__inner',
    '.marketing-scanline-ledger',
    '.marketing-scanline-ledger__track',
    '.marketing-section',
    '.marketing-section__inner',
    '.marketing-section__header',
    '.marketing-section__title',
    '.marketing-section__copy',
    '.marketing-panel',
    '.marketing-panel__header',
    '.marketing-status-pill',
    '.marketing-meta-label',
    '.marketing-footer',
    '.marketing-footer__inner',
    '.marketing-hero',
    '.marketing-hero__composition',
    '.marketing-intro__stage',
    '.marketing-intro__truth-card',
    '.marketing-pre-landing',
    '.marketing-truth-ladder',
    '.marketing-truth-ladder__module',
  ],
  componentUsage: [
    {
      fileName: '_components/MarketingNav.tsx',
      displayName: 'MarketingNav',
      mustUse: ['marketing-nav', 'marketing-nav__inner'],
    },
    {
      fileName: '_components/MarketingScanlineLedger.tsx',
      displayName: 'MarketingScanlineLedger',
      mustUse: ['marketing-scanline-ledger', 'marketing-scanline-ledger__track'],
    },
    {
      fileName: '_components/MarketingTruthInstrumentProvider.tsx',
      displayName: 'MarketingTruthInstrumentProvider',
      mustUse: [],
    },
    {
      fileName: '_components/MarketingTruthLadder.tsx',
      displayName: 'MarketingTruthLadder',
      mustUse: ['marketing-truth-ladder', 'marketing-truth-ladder__module'],
    },
    {
      fileName: '_sections/MarketingFooter.tsx',
      displayName: 'MarketingFooter',
      mustUse: ['marketing-footer', 'marketing-footer__inner'],
    },
    {
      fileName: '_components/landing-primitives.tsx',
      displayName: 'landing-primitives',
      mustUse: [
        'marketing-section',
        'marketing-section__inner',
        'marketing-section__header',
        'marketing-section__title',
        'marketing-section__copy',
        'marketing-panel',
        'marketing-panel__header',
        'marketing-status-pill',
        'marketing-meta-label',
      ],
    },
    {
      fileName: '_sections/HeroSection.tsx',
      displayName: 'HeroSection',
      mustUse: ['marketing-hero', 'marketing-hero__composition'],
    },
    {
      fileName: '_components/MarketingIntroDiagram.tsx',
      displayName: 'MarketingIntroDiagram',
      mustUse: ['marketing-intro__stage', 'marketing-intro__truth-card'],
    },
    {
      fileName: '_components/MarketingPreLanding.tsx',
      displayName: 'MarketingPreLanding',
      mustUse: ['marketing-pre-landing'],
    },
  ],
  requiredFiles: [
    'layout.tsx',
    'page.tsx',
    '_components/MarketingExplorerDialog.tsx',
    '_components/MarketingExplorerProvider.tsx',
    '_components/MarketingNav.tsx',
    '_components/MarketingScanlineLedger.tsx',
    '_components/MarketingTruthInstrumentProvider.tsx',
    '_components/MarketingTruthLadder.tsx',
    '_components/landing-primitives.tsx',
    '_components/MarketingIntroDiagram.tsx',
    '_components/MarketingPreLanding.tsx',
    '_content/truth-instrument.ts',
    '_sections/HeroSection.tsx',
    '_sections/MarketingFooter.tsx',
  ],
} as const;

function pathsFor(rootDir: string) {
  return {
    marketingDir: path.join(rootDir, 'src/app/[locale]/(marketing)'),
    landingCss: path.join(rootDir, 'src/shared/styles/landing.css'),
  };
}

function toRelative(file: string, rootDir = root) {
  return path.relative(rootDir, file) || file;
}

function readRequiredFile(file: string, layer: Layer, findings: Finding[], rootDir: string) {
  if (!existsSync(file)) {
    findings.push({
      layer,
      verdict: 'FAIL',
      file: toRelative(file, rootDir),
      line: 1,
      rule: 'missing-required-file',
      message: `Required file does not exist: ${toRelative(file, rootDir)}`,
    });
    return undefined;
  }

  return readFileSync(file, 'utf8');
}

function listFiles(dir: string, extensions: string[]): string[] {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) return listFiles(fullPath, extensions);
    return extensions.some((extension) => fullPath.endsWith(extension)) ? [fullPath] : [];
  });
}

function parseCss(text: string, file: string, findings: Finding[], rootDir: string) {
  try {
    return postcss.parse(text, { from: file });
  } catch (error) {
    const line = typeof error === 'object' && error && 'line' in error ? Number(error.line) : 1;

    findings.push({
      layer: 'Foundation Truth',
      verdict: 'FAIL',
      file: toRelative(file, rootDir),
      line: Number.isFinite(line) ? line : 1,
      rule: 'invalid-css',
      message: error instanceof Error ? error.message : 'CSS could not be parsed.',
    });
    return undefined;
  }
}

function selectorsFor(rule: Rule) {
  return rule.selectors.map((selector) => selector.trim()).filter(Boolean);
}

function selectorMatches(rule: Rule, selector: string) {
  return selectorsFor(rule).includes(selector);
}

function findRulesBySelector(cssRoot: Root, selector: string) {
  const rules: Rule[] = [];

  cssRoot.walkRules((rule) => {
    if (selectorMatches(rule, selector)) rules.push(rule);
  });

  return rules;
}

function lineForCssNode(node: Rule | Declaration | AtRule) {
  return node.source?.start?.line ?? 1;
}

function lineForTextIndex(text: string, index: number) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function normalizeCssValue(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function firstSelectorSegment(selector: string) {
  return (
    selector
      .trim()
      .split(/\s+|>|\+|~/)[0]
      ?.trim() ?? ''
  );
}

function leaksGlobalSelector(selector: string) {
  const firstSegment = firstSelectorSegment(selector);

  if (!firstSegment) return false;
  if (firstSegment === '*') return true;
  if (/^:root(?:$|[.#:[(])/.test(firstSegment)) return true;

  return /^(?:html|body|a|button|h[1-6])(?:$|[.#:[(])/.test(firstSegment);
}

function verifyCssContract(cssText: string, cssRoot: Root, file: string, findings: Finding[], rootDir: string) {
  for (const token of landingDesignContract.requiredTokens) {
    let found = false;

    cssRoot.walkDecls(token, () => {
      found = true;
    });

    if (!found) {
      findings.push({
        layer: 'Foundation Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: 1,
        rule: 'missing-required-token',
        message: `landing.css must define required token: ${token}`,
      });
    }
  }

  for (const selector of landingDesignContract.requiredSelectors) {
    if (findRulesBySelector(cssRoot, selector).length > 0) continue;

    findings.push({
      layer: 'Selector Truth',
      verdict: 'FAIL',
      file: toRelative(file, rootDir),
      line: 1,
      rule: 'missing-required-selector',
      message: `landing.css must define required selector: ${selector}`,
    });
  }

  if (/src\/app\/\[locale\]\/\(marketing\)\/marketing\.css/.test(cssText)) {
    findings.push({
      layer: 'Surface Ownership Truth',
      verdict: 'FAIL',
      file: toRelative(file, rootDir),
      line: 1,
      rule: 'stale-route-css-reference',
      message: 'Marketing route styles must live in src/shared/styles/landing.css.',
    });
  }
}

function verifyCssSurfaceOwnership(cssRoot: Root, file: string, findings: Finding[], rootDir: string) {
  cssRoot.walkAtRules('import', (rule) => {
    findings.push({
      layer: 'Surface Ownership Truth',
      verdict: 'FAIL',
      file: toRelative(file, rootDir),
      line: lineForCssNode(rule),
      rule: 'no-css-imports-in-landing-css',
      message: 'landing.css must not import fonts, Tailwind, or other stylesheets.',
    });
  });

  cssRoot.walkRules((rule) => {
    for (const selector of selectorsFor(rule)) {
      if (!leaksGlobalSelector(selector)) continue;

      findings.push({
        layer: 'Surface Ownership Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: lineForCssNode(rule),
        rule: 'no-global-selector-in-landing-css',
        message: `landing.css must scope selectors under .marketing-root; found ${selector}.`,
      });
    }
  });

  cssRoot.walkDecls((decl) => {
    if (decl.important) {
      findings.push({
        layer: 'Surface Ownership Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: lineForCssNode(decl),
        rule: 'no-important-in-landing-css',
        message: 'landing.css must not rely on !important overrides.',
      });
    }

    if (decl.prop === 'letter-spacing' && normalizeCssValue(decl.value).startsWith('-')) {
      findings.push({
        layer: 'Surface Ownership Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: lineForCssNode(decl),
        rule: 'no-negative-letter-spacing-css',
        message: 'Landing typography must not use negative letter-spacing.',
      });
    }

    if (decl.prop === 'font-size' && decl.value.includes('vw')) {
      findings.push({
        layer: 'Surface Ownership Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: lineForCssNode(decl),
        rule: 'no-vw-font-size',
        message: 'Do not scale font size with viewport width.',
      });
    }
  });
}

function literalText(node: ts.Node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function looksLikeClassText(value: string) {
  return /(^|\s)(landing-|marketing-|[a-z0-9]+:|[a-z]+-|sr-only|hidden|grid|flex|block|inline-flex|relative|absolute)(\S*)/i.test(
    value,
  );
}

function addClassText(text: string, tokens: Set<string>) {
  text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .forEach((token) => tokens.add(token));
}

function buildConstantClassMap(sourceFile: ts.SourceFile) {
  const constants = new Map<string, string[]>();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;

      const value = literalText(declaration.initializer);
      if (!value || !looksLikeClassText(value)) continue;

      constants.set(declaration.name.text, [value]);
    }
  }

  return constants;
}

function lineForTsNode(sourceFile: ts.SourceFile, node: ts.Node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function expressionName(node: ts.Expression) {
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  return undefined;
}

function isClassFunctionCall(node: ts.CallExpression) {
  const name = expressionName(node.expression);
  return Boolean(name && classFunctionNames.has(name));
}

function isJsxClassNameAttribute(node: ts.Node): node is ts.JsxAttribute {
  return ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && node.name.text === 'className';
}

function staticPartsContainStructuralTemplate(node: ts.TemplateExpression) {
  const staticText = [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('');
  return structuralClassPrefixes.some((prefix) => staticText.includes(prefix));
}

function inspectClassExpression(params: {
  node: ts.Node;
  sourceFile: ts.SourceFile;
  constants: Map<string, string[]>;
  tokens: Set<string>;
  findings: Finding[];
  file: string;
  rootDir: string;
}) {
  const { node, sourceFile, constants, tokens, findings, file, rootDir } = params;
  const value = literalText(node);

  if (value) {
    addClassText(value, tokens);
    return;
  }

  if (ts.isIdentifier(node)) {
    const constantValues = constants.get(node.text);
    if (constantValues) {
      constantValues.forEach((constantValue) => addClassText(constantValue, tokens));
      return;
    }

    if (allowedDynamicClassIdentifiers.has(node.text)) return;

    findings.push({
      layer: 'Component Adoption Truth',
      verdict: 'WARN',
      file: toRelative(file, rootDir),
      line: lineForTsNode(sourceFile, node),
      rule: 'dynamic-cosmetic-class',
      message: `Class expression "${node.text}" is dynamic and cannot be fully verified.`,
    });
    return;
  }

  if (ts.isTemplateExpression(node)) {
    const verdict = staticPartsContainStructuralTemplate(node) ? 'FAIL' : 'WARN';

    findings.push({
      layer: 'Component Adoption Truth',
      verdict,
      file: toRelative(file, rootDir),
      line: lineForTsNode(sourceFile, node),
      rule: verdict === 'FAIL' ? 'dynamic-structural-class' : 'dynamic-cosmetic-class',
      message:
        verdict === 'FAIL'
          ? 'Structural landing classes must be statically provable; do not interpolate landing/marketing class names.'
          : 'Dynamic cosmetic class expression cannot be fully verified.',
    });
    return;
  }

  if (ts.isConditionalExpression(node)) {
    inspectClassExpression({ node: node.whenTrue, sourceFile, constants, tokens, findings, file, rootDir });
    inspectClassExpression({ node: node.whenFalse, sourceFile, constants, tokens, findings, file, rootDir });
    return;
  }

  if (ts.isBinaryExpression(node)) {
    if (
      node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
      node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
      node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
    ) {
      inspectClassExpression({ node: node.right, sourceFile, constants, tokens, findings, file, rootDir });
      return;
    }

    const leftText = literalText(node.left);
    const rightText = literalText(node.right);
    const staticText = `${leftText ?? ''}${rightText ?? ''}`;

    if (
      node.operatorToken.kind === ts.SyntaxKind.PlusToken &&
      structuralClassPrefixes.some((prefix) => staticText.includes(prefix))
    ) {
      findings.push({
        layer: 'Component Adoption Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: lineForTsNode(sourceFile, node),
        rule: 'dynamic-structural-class',
        message: 'Structural landing classes must be statically provable; do not concatenate class names.',
      });
      return;
    }

    inspectClassExpression({ node: node.left, sourceFile, constants, tokens, findings, file, rootDir });
    inspectClassExpression({ node: node.right, sourceFile, constants, tokens, findings, file, rootDir });
    return;
  }

  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    inspectClassExpression({ node: node.expression, sourceFile, constants, tokens, findings, file, rootDir });
    return;
  }

  if (ts.isArrayLiteralExpression(node)) {
    for (const element of node.elements) {
      inspectClassExpression({ node: element, sourceFile, constants, tokens, findings, file, rootDir });
    }
    return;
  }

  if (ts.isObjectLiteralExpression(node)) {
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      if (ts.isStringLiteral(property.name)) addClassText(property.name.text, tokens);
      inspectClassExpression({ node: property.initializer, sourceFile, constants, tokens, findings, file, rootDir });
    }
  }
}

export function analyzeTsxClassInventory(
  sourceText: string,
  file: string,
  rootDir = root,
  externalConstants = new Map<string, string[]>(),
): TsxClassInventory {
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = new Map([...externalConstants, ...buildConstantClassMap(sourceFile)]);
  const tokens = new Set<string>();
  const findings: Finding[] = [];

  constants.forEach((values) => values.forEach((value) => addClassText(value, tokens)));

  const visit = (node: ts.Node) => {
    if (isJsxClassNameAttribute(node) && node.initializer) {
      if (ts.isStringLiteral(node.initializer)) {
        addClassText(node.initializer.text, tokens);
      } else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
        inspectClassExpression({
          node: node.initializer.expression,
          sourceFile,
          constants,
          tokens,
          findings,
          file,
          rootDir,
        });
      }
    }

    if (ts.isCallExpression(node) && isClassFunctionCall(node)) {
      for (const argument of node.arguments) {
        inspectClassExpression({ node: argument, sourceFile, constants, tokens, findings, file, rootDir });
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return { tokens, findings };
}

function verifyComponentAdoption(marketingDir: string, findings: Finding[], rootDir: string) {
  for (const requiredFile of landingDesignContract.requiredFiles) {
    readRequiredFile(path.join(marketingDir, requiredFile), 'Component Adoption Truth', findings, rootDir);
  }

  for (const rule of landingDesignContract.componentUsage) {
    const file = path.join(marketingDir, rule.fileName);
    const sourceText = readRequiredFile(file, 'Component Adoption Truth', findings, rootDir);
    if (!sourceText) continue;

    const inventory = analyzeTsxClassInventory(sourceText, file, rootDir);
    for (const className of rule.mustUse) {
      if (inventory.tokens.has(className)) continue;

      findings.push({
        layer: 'Component Adoption Truth',
        verdict: 'FAIL',
        file: toRelative(file, rootDir),
        line: 1,
        rule: 'missing-required-component-class',
        message: `${rule.displayName} must use ${className}.`,
      });
    }
  }
}

function verifyRawSurfaceOwnership(marketingDir: string, findings: Finding[], rootDir: string) {
  const htmlFiles = listFiles(marketingDir, ['.html']);
  for (const file of htmlFiles) {
    findings.push({
      layer: 'Surface Ownership Truth',
      verdict: 'FAIL',
      file: toRelative(file, rootDir),
      line: 1,
      rule: 'no-runtime-html-artifacts',
      message: 'Marketing route must not commit runtime .html artifacts.',
    });
  }

  const bannedSourcePatterns = [
    { name: 'no-dangerous-html-injection', pattern: /dangerouslySetInnerHTML/g },
    { name: 'no-runtime-fs-html-loader', pattern: /\breadFileSync\b|\bexistsSync\b|\bprocess\.cwd\b/g },
    { name: 'no-inline-reload-handler', pattern: /location\.reload|onclick=/g },
    { name: 'no-v2-or-hero-artifact-symbols', pattern: /\bV2[A-Za-z]*\b|HeroV11|hero-afenda-v11/g },
  ];

  for (const file of listFiles(marketingDir, ['.ts', '.tsx'])) {
    const text = readFileSync(file, 'utf8');

    for (const rule of bannedSourcePatterns) {
      for (const match of text.matchAll(rule.pattern)) {
        findings.push({
          layer: 'Surface Ownership Truth',
          verdict: 'FAIL',
          file: toRelative(file, rootDir),
          line: lineForTextIndex(text, match.index ?? 0),
          rule: rule.name,
          message: 'Marketing runtime code must not depend on raw artifact or legacy V2 symbols.',
        });
      }
    }
  }
}

function buildLayerStatuses(findings: Finding[]) {
  return Object.fromEntries(
    layerOrder.map((layer) => {
      const layerFindings = findings.filter((finding) => finding.layer === layer);
      const status: Verdict = layerFindings.some((finding) => finding.verdict === 'FAIL')
        ? 'FAIL'
        : layerFindings.some((finding) => finding.verdict === 'WARN')
          ? 'WARN'
          : 'PASS';

      return [layer, status];
    }),
  ) as Record<Layer, Verdict>;
}

function buildReport(findings: Finding[]): VerifyReport {
  const layers = buildLayerStatuses(findings);
  const status: Verdict = findings.some((finding) => finding.verdict === 'FAIL')
    ? 'FAIL'
    : findings.some((finding) => finding.verdict === 'WARN')
      ? 'WARN'
      : 'PASS';

  return {
    status,
    findings: findings.sort((a, b) => {
      const layerDelta = layerOrder.indexOf(a.layer) - layerOrder.indexOf(b.layer);
      if (layerDelta !== 0) return layerDelta;
      if (a.file !== b.file) return a.file.localeCompare(b.file);
      return a.line - b.line;
    }),
    layers,
  };
}

export function verifyLandingDesignSystem(options: VerifyOptions = {}): VerifyReport {
  const rootDir = options.rootDir ?? root;
  const paths = pathsFor(rootDir);
  const findings: Finding[] = [];

  const landingCssText = readRequiredFile(paths.landingCss, 'Foundation Truth', findings, rootDir);
  if (landingCssText) {
    const landingCssRoot = parseCss(landingCssText, paths.landingCss, findings, rootDir);
    if (landingCssRoot) {
      verifyCssContract(landingCssText, landingCssRoot, paths.landingCss, findings, rootDir);
      verifyCssSurfaceOwnership(landingCssRoot, paths.landingCss, findings, rootDir);
    }
  }

  verifyComponentAdoption(paths.marketingDir, findings, rootDir);
  verifyRawSurfaceOwnership(paths.marketingDir, findings, rootDir);

  return buildReport(findings);
}

function renderText(report: VerifyReport) {
  const lines = [`Landing design system verdict: ${report.status}`, ''];

  lines.push('Verified layers:');
  for (const layer of layerOrder) {
    lines.push(`- ${report.layers[layer]} ${layer}`);
  }

  if (report.findings.length > 0) {
    lines.push('', 'Findings:');

    for (const finding of report.findings) {
      lines.push(
        `[${finding.verdict}] [${finding.layer}] ${finding.file}:${finding.line} ${finding.rule} - ${finding.message}`,
      );
    }
  }

  return `${lines.join('\n')}\n`;
}

function renderMarkdown(report: VerifyReport) {
  const lines = [`# Landing Design-System Verification`, '', `**Verdict:** ${report.status}`, '', '## Layers'];

  for (const layer of layerOrder) {
    lines.push(`- **${report.layers[layer]}** ${layer}`);
  }

  if (report.findings.length > 0) {
    lines.push('', '## Findings');

    for (const finding of report.findings) {
      lines.push(
        `- **${finding.verdict}** \`${finding.file}:${finding.line}\` \`${finding.rule}\` - ${finding.message}`,
      );
    }
  }

  return `${lines.join('\n')}\n`;
}

function renderReport(report: VerifyReport, format: ReportFormat) {
  if (format === 'json') return `${JSON.stringify(report, null, 2)}\n`;
  if (format === 'markdown') return renderMarkdown(report);
  return renderText(report);
}

function parseCliArgs(argv: string[]) {
  const options: VerifyOptions = { format: 'text' };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--format') {
      options.format = parseFormat(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith('--format=')) {
      options.format = parseFormat(arg.slice('--format='.length));
      continue;
    }

    if (arg === '--output') {
      options.output = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith('--output=')) {
      options.output = arg.slice('--output='.length);
    }
  }

  return options;
}

function parseFormat(value: string | undefined): ReportFormat {
  if (value === 'json' || value === 'markdown' || value === 'text') return value;
  throw new Error(`Unsupported report format: ${value ?? '(missing)'}`);
}

async function runCli() {
  const options = parseCliArgs(process.argv.slice(2));
  const report = verifyLandingDesignSystem(options);
  const output = renderReport(report, options.format ?? 'text');

  if (options.output) {
    const outputPath = path.resolve(options.output);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, output);
  }

  if (report.status === 'FAIL') {
    console.error(output);
    process.exit(1);
  }

  console.log(output);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : undefined;

if (import.meta.url === invokedPath) {
  runCli().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
