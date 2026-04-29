import fg from 'fast-glob';
import { format as formatWithPrettier, resolveConfig as resolvePrettierConfig } from 'prettier';
import { Project, SyntaxKind } from 'ts-morph';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  DOCS_CONTENT_TYPE_VALUES,
  DOCS_SECTION_REQUIREMENTS,
  type DocsContentType,
  getExpectedDocsType as expectedDocsTypeFromPolicy,
  type FrontmatterEnvelope,
  hasOrderedHeadings,
  parseFrontmatter as parseFrontmatterFromPolicy,
  validateMdxImportPolicy,
} from './docs-content-policy';
import { docsReleaseStates } from '../src/docs/runtime/docs-contract-manifest';
import type { DocsManifest } from '../src/docs/runtime/docs-contract-manifest';

const ROOT = process.cwd();
const ENGLISH_DOCS_ROOT = join(ROOT, 'content/i18n/docs/en');
const GENERATED_ROOT = join(ENGLISH_DOCS_ROOT, 'generated');
const SEARCH_SITE_ROOT = join(ROOT, '.artifacts/docs-search-site');
const OAS_PATH = join(ROOT, 'src/docs/openapi/afenda-public.json');
const MANIFEST_PATTERNS = ['src/docs/docs.manifest.ts', 'src/features/*/docs.manifest.ts'];
const APP_SURFACE_PATTERNS = ['src/app/**/page.tsx', 'src/app/**/route.ts', 'src/app/**/route.tsx'];
const DOCS_SEARCH_MIN_PAGES = 60;
const DOCS_SEARCH_MIN_TEXT_CHARS = 5000;
const DOCS_DEFAULT_FIRST_FORBIDDEN_PATHS = [
  'src/docs/_ui-components',
  'src/docs/ui/layouts',
  'src/layouts',
  'src/docs/ui/docs-home.tsx',
  'src/docs/runtime/docs-assistant-hint.tsx',
  'src/docs/runtime/docs-page-llm-actions.tsx',
  'src/docs/runtime/docs-governance.contract.ts',
  'src/docs/runtime/docs-system.definition.ts',
  'src/docs/components/ai/page-actions.tsx',
] as const;
const DOCS_DEFAULT_FIRST_FORBIDDEN_TEXT = [
  '_ui-components',
  'docs-home',
  'docs-page-llm-actions',
  'docs-assistant-hint',
  'docs-governance.contract',
  'docs-system.definition',
] as const;
const DOCS_FORBIDDEN_CSS_SELECTORS = ['.docs-content', '.nd-content', '.docs-tree-icon'] as const;
const GENERATED_HEADER_MARKER = 'data-generated-docs-header="GENERATED FILE - DO NOT EDIT"';
const GENERATED_HEADER = [
  '<div',
  '  hidden',
  '  data-generated-docs-header="GENERATED FILE - DO NOT EDIT"',
  '  data-source="docs inventory graph"',
  '  data-generated-by="pnpm docs:generate"',
  '/>',
].join('\n');
const GENERATED_HEADER_PATTERN =
  /<div\s+hidden\s+data-generated-docs-header="GENERATED FILE - DO NOT EDIT"[\s\S]*?\/>/g;
const methodSchema = z.enum(['DELETE', 'GET', 'PATCH', 'POST', 'PUT']);
const manifestSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  title: z.string().min(1),
  module: z.string().min(1),
  owner: z.string().min(1),
  releaseState: z.enum(docsReleaseStates),
  summary: z.string().min(1),
  routes: z.array(z.string().min(1)).min(1),
  permissions: z.array(z.string().min(1)),
  workflows: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      summary: z.string().min(1),
    }),
  ),
  actions: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      summary: z.string().min(1),
    }),
  ),
  apis: z.array(
    z.object({
      id: z.string().min(1),
      method: methodSchema,
      route: z.string().min(1),
      summary: z.string().min(1),
      public: z.boolean().optional(),
    }),
  ),
  errors: z.array(
    z.object({
      code: z.string().regex(/^AFD-[A-Z0-9-]+$/),
      title: z.string().min(1),
      mitigation: z.string().min(1),
    }),
  ),
  troubleshooting: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      symptom: z.string().min(1),
      resolution: z.string().min(1),
    }),
  ),
});

export function validateManifestShape(input: unknown): string[] {
  const parsed = manifestSchema.safeParse(input);
  if (parsed.success) return [];
  return parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
}

export interface AppSurface {
  file: string;
  route: string;
  kind: 'api' | 'page';
}

export interface DocsInventoryGraph {
  generated: true;
  version: 1;
  doctrine: string;
  hash: string;
  generatedFrom: {
    manifests: string[];
    appSurfaces: string[];
    permissions: string[];
  };
  manifests: DocsManifest[];
  coverage: {
    routes: Record<string, string[]>;
    permissions: Record<string, string[]>;
  };
}

interface ValidationModel {
  manifests: DocsManifest[];
  manifestFiles: string[];
  appSurfaces: AppSurface[];
  discoveredPermissions: string[];
}

interface RenderedFile {
  path: string;
  content: string;
}

interface SearchIndexFile {
  route: string;
  title: string;
  body: string;
}

function toPosixPath(path: string): string {
  return path.split(sep).join('/');
}

function normalizeRoute(route: string): string {
  if (route === '') return '/';
  return route.startsWith('/') ? route : `/${route}`;
}

function routeFromAppFile(file: string): AppSurface {
  const normalized = toPosixPath(file);
  const kind = normalized.endsWith('/route.ts') ? 'api' : 'page';
  const withoutRoot = normalized.replace(/^src\/app\//, '').replace(/(?:^|\/)(?:page\.tsx|route\.tsx|route\.ts)$/, '');
  const segments = withoutRoot
    .split('/')
    .filter((segment) => segment.length > 0)
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')));
  return {
    file: normalized,
    route: normalizeRoute(segments.join('/')),
    kind,
  };
}

export function discoverAppSurfaces(root = ROOT): AppSurface[] {
  const surfaces = fg
    .sync(APP_SURFACE_PATTERNS, { cwd: root, onlyFiles: true })
    .map(routeFromAppFile)
    .sort((a, b) => a.route.localeCompare(b.route) || a.file.localeCompare(b.file));

  const expanded = [...surfaces];
  for (const surface of surfaces) {
    if (surface.kind === 'page' && surface.route.endsWith('/[[...slug]]')) {
      expanded.push({
        ...surface,
        route: surface.route.slice(0, -'/[[...slug]]'.length) || '/',
      });
    }
  }

  return expanded.sort((a, b) => a.route.localeCompare(b.route) || a.file.localeCompare(b.file));
}

export function discoverPermissions(root = ROOT): string[] {
  const project = new Project({
    tsConfigFilePath: join(root, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });
  const files = fg.sync(['src/**/*.{ts,tsx}'], {
    cwd: root,
    ignore: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
  });
  project.addSourceFilesAtPaths(files.map((file) => join(root, file)));

  const out = new Set<string>();
  for (const sourceFile of project.getSourceFiles()) {
    for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const expression = call.getExpression().getText();
      if (!expression.endsWith('requirePermission') && !expression.endsWith('hasPermission')) continue;
      const permissionArg = call.getArguments()[1];
      if (!permissionArg || !permissionArg.isKind(SyntaxKind.StringLiteral)) continue;
      out.add(permissionArg.getLiteralText());
    }
  }
  return [...out].sort();
}

export async function loadManifestModel(root = ROOT): Promise<ValidationModel> {
  const manifestFiles = fg.sync(MANIFEST_PATTERNS, { cwd: root, onlyFiles: true }).sort();
  const manifests: DocsManifest[] = [];
  const errors: string[] = [];

  for (const file of manifestFiles) {
    const fullPath = join(root, file);
    const cacheKey = statSync(fullPath).mtimeMs;
    const imported = await import(`${pathToFileURL(fullPath).href}?v=${cacheKey}`);
    const parsed = manifestSchema.safeParse(imported.default);
    if (!parsed.success) {
      errors.push(
        `${file}: ${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
      );
      continue;
    }
    manifests.push(parsed.data);
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  manifests.sort((a, b) => a.id.localeCompare(b.id));
  return {
    manifests,
    manifestFiles,
    appSurfaces: discoverAppSurfaces(root),
    discoveredPermissions: discoverPermissions(root),
  };
}

function addIndex(map: Map<string, string[]>, key: string, manifestId: string) {
  const existing = map.get(key) ?? [];
  existing.push(manifestId);
  map.set(key, existing);
}

export function validateModel(model: ValidationModel): string[] {
  const errors: string[] = [];
  const routes = new Set(model.appSurfaces.map((surface) => surface.route));
  const routeCoverage = new Map<string, string[]>();
  const permissionCoverage = new Map<string, string[]>();
  const duplicateIds = new Map<string, string[]>();

  for (const manifest of model.manifests) {
    for (const route of manifest.routes) {
      if (!routes.has(route)) {
        errors.push(`${manifest.id}: route "${route}" is not present in src/app.`);
      }
      addIndex(routeCoverage, route, manifest.id);
    }

    for (const permission of manifest.permissions) {
      if (!model.discoveredPermissions.includes(permission)) {
        errors.push(`${manifest.id}: permission "${permission}" is not used by requirePermission()/hasPermission().`);
      }
      addIndex(permissionCoverage, permission, manifest.id);
    }

    for (const api of manifest.apis) {
      if (!manifest.routes.includes(api.route)) {
        errors.push(`${manifest.id}: api "${api.id}" route "${api.route}" is not listed in manifest.routes.`);
      }
      if (!routes.has(api.route)) {
        errors.push(`${manifest.id}: api "${api.id}" route "${api.route}" is not present in src/app.`);
      }
    }

    for (const [kind, ids] of Object.entries({
      manifest: [manifest.id],
      workflow: manifest.workflows.map((item) => item.id),
      action: manifest.actions.map((item) => item.id),
      api: manifest.apis.map((item) => item.id),
      error: manifest.errors.map((item) => item.code),
      troubleshooting: manifest.troubleshooting.map((item) => item.id),
    })) {
      for (const id of ids) {
        const key = `${kind}:${id}`;
        duplicateIds.set(key, [...(duplicateIds.get(key) ?? []), manifest.id]);
      }
    }
  }

  for (const surface of model.appSurfaces) {
    if (!routeCoverage.has(surface.route)) {
      errors.push(`route "${surface.route}" (${surface.file}) has no docs manifest coverage.`);
    }
  }

  for (const permission of model.discoveredPermissions) {
    if (!permissionCoverage.has(permission)) {
      errors.push(`permission "${permission}" has no docs manifest coverage.`);
    }
  }

  for (const [key, owners] of duplicateIds) {
    if (owners.length > 1) {
      errors.push(`duplicate stable id "${key}" appears in manifests: ${owners.join(', ')}.`);
    }
  }

  return errors.sort();
}

function loadOpenApiSpec() {
  if (!existsSync(OAS_PATH)) return null;

  try {
    const raw = readFileSync(OAS_PATH, 'utf8');
    return JSON.parse(raw) as {
      paths?: Record<string, Record<string, { description?: string; summary?: string }>>;
    };
  } catch {
    return null;
  }
}

function isTrackedApiRoute(route: string): boolean {
  if (route === '/api/auth/{...nextauth}') return false;
  if (route.includes('/internal/')) return false;
  if (route.startsWith('/api/auth/')) return false;
  return route.startsWith('/api/');
}

function routeToOpenApiPath(route: string): string {
  return route.replace(/\[\.{3}([^\]]+)\]/g, '{...$1}').replace(/\[([^\]]+)\]/g, '{$1}');
}

function routeToManifestLookupKey(route: string, method: string): string {
  return `${method.toLowerCase()}:${routeToOpenApiPath(route)}`;
}

function toOpenApiOperations(spec: NonNullable<ReturnType<typeof loadOpenApiSpec>>) {
  const operations: Array<{ route: string; method: string }> = [];
  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    for (const method of Object.keys(methods)) {
      const normalized = method.toLowerCase();
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(normalized)) continue;
      operations.push({ route: path, method: normalized });
    }
  }
  return operations;
}

function validateOpenApiAlignment(model: ValidationModel): string[] {
  const errors: string[] = [];
  const spec = loadOpenApiSpec();
  if (!spec) return ['Cannot load OAS from src/docs/openapi/afenda-public.json.'];
  const openApiRoutes = spec.paths ?? {};
  const generatedApiEvidence = join(ENGLISH_DOCS_ROOT, 'generated', 'api');

  const manifestApiByOperation = new Map<string, { manifestId: string; apiId: string; route: string }>();
  const missingManifest: string[] = [];
  const missingDescription: string[] = [];
  const missingEvidence: string[] = [];

  for (const manifest of model.manifests) {
    for (const api of manifest.apis) {
      if (api.public === false) continue;
      const key = routeToManifestLookupKey(api.route, api.method);
      manifestApiByOperation.set(key, { manifestId: manifest.id, apiId: api.id, route: api.route });
    }
  }

  for (const manifest of model.manifests) {
    for (const api of manifest.apis) {
      if (api.public === false) continue;
      const method = api.method.toLowerCase();
      const openApiPath = routeToOpenApiPath(api.route);
      const operation = openApiRoutes[openApiPath]?.[method];

      if (!operation) {
        if (isTrackedApiRoute(api.route)) {
          missingManifest.push(`${manifest.id}: ${api.id} (${api.method} ${api.route}) missing in OpenAPI spec.`);
        }
        continue;
      }

      const expectedEvidenceHref = `/docs/generated/api/${api.id}`;
      const operationText = `${operation.summary ?? ''} ${operation.description ?? ''}`;
      if (!operationText.includes(expectedEvidenceHref)) {
        missingDescription.push(
          `${manifest.id}: OpenAPI operation for ${api.id} (${api.method} ${api.route}) must include "${expectedEvidenceHref}" in description or summary.`,
        );
      }

      const evidenceFile = join(generatedApiEvidence, `${api.id}.mdx`);
      if (!existsSync(evidenceFile)) {
        missingEvidence.push(
          `${manifest.id}: API evidence page content/i18n/docs/en/generated/api/${api.id}.mdx missing for public manifest API "${api.id}".`,
        );
      } else if (!readFileSync(evidenceFile, 'utf8').includes('/docs/openapi')) {
        missingEvidence.push(
          `${manifest.id}: API evidence page for ${api.id} (${api.method} ${api.route}) must include a link back to /docs/openapi.`,
        );
      }
    }
  }

  for (const operation of toOpenApiOperations(spec)) {
    if (!isTrackedApiRoute(operation.route)) continue;
    const key = `${operation.method}:${operation.route}`;
    const ref = manifestApiByOperation.get(key);
    if (!ref) {
      errors.push(
        `OpenAPI public operation ${operation.method.toUpperCase()} ${operation.route} has no manifest coverage.`,
      );
      continue;
    }

    const expectedEvidenceHref = `/docs/generated/api/${ref.apiId}`;
    const operationSpec = openApiRoutes[operation.route]?.[operation.method];
    const operationText = `${operationSpec?.summary ?? ''} ${operationSpec?.description ?? ''}`;
    if (!operationText.includes(expectedEvidenceHref)) {
      missingDescription.push(
        `${ref.manifestId}: OpenAPI operation ${operation.method.toUpperCase()} ${operation.route} must include "${expectedEvidenceHref}" in description or summary.`,
      );
    }
  }

  return [...missingManifest, ...missingDescription, ...missingEvidence, ...errors];
}

export function buildInventoryGraph(model: ValidationModel): DocsInventoryGraph {
  const routeCoverage: Record<string, string[]> = {};
  const permissionCoverage: Record<string, string[]> = {};

  for (const manifest of model.manifests) {
    for (const route of manifest.routes) {
      routeCoverage[route] = [...(routeCoverage[route] ?? []), manifest.id].sort();
    }
    for (const permission of manifest.permissions) {
      permissionCoverage[permission] = [...(permissionCoverage[permission] ?? []), manifest.id].sort();
    }
  }

  const hashInput = JSON.stringify({
    manifests: model.manifests,
    appSurfaces: model.appSurfaces,
    permissions: model.discoveredPermissions,
  });

  return {
    generated: true,
    version: 1,
    doctrine: 'Docs render what product truth declares. Manual prose may explain truth, but it may not define truth.',
    hash: createHash('sha256').update(hashInput).digest('hex'),
    generatedFrom: {
      manifests: model.manifestFiles,
      appSurfaces: model.appSurfaces.map((surface) => surface.file),
      permissions: model.discoveredPermissions,
    },
    manifests: model.manifests,
    coverage: {
      routes: routeCoverage,
      permissions: permissionCoverage,
    },
  };
}

function titleCase(value: string): string {
  return value
    .split(/[-:_/.]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function frontmatter(title: string, description: string): string {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\ndocsType: "generated-evidence"\n---\n\n`;
}

function parseFrontmatter(content: string): FrontmatterEnvelope {
  return parseFrontmatterFromPolicy(content);
}

const getExpectedDocsType = (relativePath: string): DocsContentType | null =>
  expectedDocsTypeFromPolicy(toPosixPath(relativePath));

function validateDocsSectionContract(content: string, docsType: DocsContentType): boolean {
  const normalizedType = DOCS_SECTION_REQUIREMENTS[docsType];
  if (!normalizedType) return true;
  return hasOrderedHeadings(content, normalizedType.type, normalizedType.requiredHeadings);
}

function getDocsPageRoute(relativePath: string): string {
  const normalized = toPosixPath(relativePath);
  const underRoot = normalized.replace(/^content\/i18n\/docs\/en\//, '');
  if (underRoot === 'index.mdx') return '/en/docs';

  const noIndex = underRoot.endsWith('/index.mdx')
    ? underRoot.slice(0, -'/index.mdx'.length)
    : underRoot.replace(/\.mdx$/, '');
  return `/en/docs${noIndex ? `/${noIndex}` : ''}`;
}

function getGeneratedRoute(relativePath: string): string {
  const normalized = toPosixPath(relativePath);
  const withoutPrefix = normalized.replace(/^generated\//, '').replace(/\.mdx$/, '');
  return `/en/docs/generated${withoutPrefix ? `/${withoutPrefix}` : ''}`;
}

const COMPONENT_IMPORTS = `import { Banner } from 'fumadocs-ui/components/banner';
import { Callout } from 'fumadocs-ui/components/callout';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
`;

function bulletList(items: string[]): string {
  if (items.length === 0) return '- None declared.\n';
  return items.map((item) => `- \`${item}\``).join('\n') + '\n';
}

function textList(items: string[]): string {
  return items.length > 0 ? items.join(', ') : 'None declared';
}

function jsxString(value: string): string {
  return JSON.stringify(value);
}

function jsxValue(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function typeTable(rows: Record<string, { type: string; description: string; required?: boolean }>): string {
  const table = Object.fromEntries(
    Object.entries(rows).map(([name, row]) => [
      name,
      {
        type: row.type,
        description: row.description,
        required: row.required ?? true,
      },
    ]),
  );

  return `<TypeTable type={${jsxValue(table)}} />`;
}

function filesTree(items: string[], folder: string): string {
  if (items.length === 0) {
    return `<Files>
  <Folder name=${jsxString(folder)} defaultOpen>
    <File name="None declared" />
  </Folder>
</Files>`;
  }

  return `<Files>
  <Folder name=${jsxString(folder)} defaultOpen>
${items.map((item) => `    <File name=${jsxString(item)} />`).join('\n')}
  </Folder>
</Files>`;
}

function generatedBanner(id: string, releaseState?: string): string {
  const suffix = releaseState ? ` Release state: ${releaseState}.` : '';
  return `<Banner id=${jsxString(id)} changeLayout={false}>
  GENERATED EVIDENCE - This page is rendered from validated product truth.${suffix}
</Banner>`;
}

function truthSurfaceCallout(title: string, lines: string[]): string {
  return `<Callout title=${jsxString(`Truth Surface: ${title}`)} type="info">
${lines.map((line) => `- ${line}`).join('\n')}
</Callout>`;
}

function evidenceRoute(path: string): string {
  return `/docs/generated/${path}`;
}

function apiEvidenceRoute(id: string): string {
  return evidenceRoute(`api/${id}`);
}

function manifestSourcePath(featureId: string): string {
  return featureId === 'docs' ? 'src/docs/docs.manifest.ts' : `src/features/${featureId}/docs.manifest.ts`;
}

function generatedMdx(title: string, description: string, body: string): string {
  return `${frontmatter(title, description)}${COMPONENT_IMPORTS}\n${GENERATED_HEADER}\n${body.trim()}\n`;
}

function renderFeature(manifest: DocsManifest): RenderedFile {
  const body = `
${generatedBanner(`feature-${manifest.id}`, manifest.releaseState)}

${truthSurfaceCallout(manifest.title, [
  `Feature ID: \`${manifest.id}\``,
  `Module: \`${manifest.module}\``,
  `Owner: \`${manifest.owner}\``,
  `Release state: \`${manifest.releaseState}\``,
])}

## Overview: what this feature actually does

${manifest.summary}

## When to use this evidence

Use this page when you need the governed feature boundary for ${manifest.title}: owner, release state, routes,
permissions, workflows, APIs, and failure surfaces. Curated pages may explain intent, but this generated page
is the route and contract evidence.

## Source contract

${typeTable({
  Module: { type: manifest.module, description: 'Product module covered by this evidence page.' },
  Owner: { type: manifest.owner, description: 'Accountable owner for the feature manifest.' },
  'Release state': { type: manifest.releaseState, description: 'Release lifecycle state declared by product truth.' },
  Routes: { type: `${manifest.routes.length} routes`, description: 'See Route coverage below.' },
  Permissions: { type: `${manifest.permissions.length} permissions`, description: 'See Permission coverage below.' },
})}

## Runtime surfaces: routes and permissions

<Tabs items={["Routes", "Permissions"]}>
<Tab>

${filesTree(manifest.routes, 'Routes')}

</Tab>
<Tab>

${filesTree(manifest.permissions, 'Permissions')}

</Tab>
</Tabs>

## Workflows and actions

<Tabs items={["Workflows", "Actions"]}>
<Tab>

${manifest.workflows.map((item) => `### ${item.title}\n\n- ID: \`${item.id}\`\n- Summary: ${item.summary}`).join('\n\n') || '- None declared.'}

</Tab>
<Tab>

${manifest.actions.map((item) => `### ${item.title}\n\n- ID: \`${item.id}\`\n- Summary: ${item.summary}`).join('\n\n') || '- None declared.'}

</Tab>
</Tabs>

## APIs: interface truth

${manifest.apis.map((item) => `- [\`${item.id}\`](${apiEvidenceRoute(item.id)}) - \`${item.method} ${item.route}\` - ${item.summary}`).join('\n') || '- None declared.'}

See [OpenAPI Reference](/docs/openapi) for documented request and response interface truth.

## Failure modes: operator risk

${manifest.errors.map((item) => `- \`${item.code}\` - ${item.title}: ${item.mitigation}`).join('\n') || '- None declared.'}

## Source evidence: traceability

<Steps>
  <Step>Manifest: \`${manifestSourcePath(manifest.id)}\`.</Step>
  <Step>Confirm route, permission, and API references still exist in the product runtime.</Step>
  <Step>Run \`pnpm docs:generate\` and \`pnpm docs:ci\` after manifest or route changes.</Step>
</Steps>
`;

  return {
    path: join(GENERATED_ROOT, 'features', `${manifest.id}.mdx`),
    content: generatedMdx(manifest.title, manifest.summary, body),
  };
}

function renderGroupedPages(graph: DocsInventoryGraph): RenderedFile[] {
  const files: RenderedFile[] = [];
  const permissions = new Map<string, string[]>();
  const workflows = new Map<string, { title: string; summary: string; feature: string }>();
  const apis = new Map<string, { method: string; route: string; summary: string; feature: string }>();
  const errors = new Map<string, { title: string; mitigation: string; feature: string }>();
  const troubleshooting = new Map<string, { title: string; symptom: string; resolution: string; feature: string }>();

  for (const manifest of graph.manifests) {
    for (const permission of manifest.permissions) {
      permissions.set(permission, [...(permissions.get(permission) ?? []), manifest.id]);
    }
    for (const workflow of manifest.workflows) {
      workflows.set(workflow.id, { title: workflow.title, summary: workflow.summary, feature: manifest.id });
    }
    for (const api of manifest.apis) {
      apis.set(api.id, { method: api.method, route: api.route, summary: api.summary, feature: manifest.id });
    }
    for (const error of manifest.errors) {
      errors.set(error.code, { title: error.title, mitigation: error.mitigation, feature: manifest.id });
    }
    for (const item of manifest.troubleshooting) {
      troubleshooting.set(item.id, {
        title: item.title,
        symptom: item.symptom,
        resolution: item.resolution,
        feature: manifest.id,
      });
    }
  }

  for (const [permission, features] of [...permissions].sort()) {
    files.push({
      path: join(GENERATED_ROOT, 'permissions', `${permission.replace(/[^a-zA-Z0-9-]/g, '-')}.mdx`),
      content: generatedMdx(
        titleCase(permission),
        `Permission evidence for ${permission}.`,
        `${generatedBanner(`permission-${permission.replace(/[^a-zA-Z0-9-]/g, '-')}`)}

## Overview: what this permission controls

Use this page to confirm which feature manifests claim \`${permission}\` and where permission coverage must remain
aligned.

## When to use this evidence

Use this page when auditing authorization boundaries, role drift, and feature-to-permission coupling.

## Source contract

${typeTable({
  Permission: { type: permission, description: 'Stable permission key discovered from guarded runtime code.' },
  FeatureCount: { type: `${features.length}`, description: 'Feature manifests that claim this permission.' },
  Coverage: { type: textList(features), description: 'Exact claiming feature list.' },
})}

## Runtime surfaces: guarded operations

${bulletList(features)}

## Failure modes

- Missing permissions can cause unauthorized access errors or permission leaks.
- Stale permissions can leave protected routes without explicit coverage.
- Regressions can appear when feature manifests move permissions without operator notice.

## Source evidence: traceability

<Steps>
  <Step>Keep this permission declared in the owning feature manifests.</Step>
  <Step>Confirm guarded runtime code still uses the permission key.</Step>
  <Step>Regenerate evidence after permission or route changes.</Step>
</Steps>`,
      ),
    });
  }

  for (const [id, workflow] of [...workflows].sort()) {
    files.push({
      path: join(GENERATED_ROOT, 'workflows', `${id}.mdx`),
      content: generatedMdx(
        workflow.title,
        workflow.summary,
        `${generatedBanner(`workflow-${id}`)}

${truthSurfaceCallout(workflow.title, [
  `Workflow ID: \`${id}\``,
  `Owning feature: \`${workflow.feature}\``,
  `Manifest: \`${manifestSourcePath(workflow.feature)}\``,
])}

## Overview: what this workflow actually does

${workflow.summary}

## When to use this evidence

Use this page when validating operator execution paths or reviewing manifest-to-runtime workflow alignment.

## Source contract

${typeTable({
  Workflow: { type: id, description: 'Stable workflow ID declared by product truth.' },
  Feature: { type: workflow.feature, description: 'Feature manifest that owns this workflow.' },
})}

## Runtime surfaces: routes and actions

This workflow is owned by [${workflow.feature}](${evidenceRoute(`features/${workflow.feature}`)}) and inherits that feature's route, permission, API, and error evidence.

## Failure modes

- The workflow can silently fail if required manifest routes or permissions are removed.
- Incomplete coverage can hide partial feature regressions.

## Source evidence: traceability

<Steps>
  <Step>Workflow ID: \`${id}\`.</Step>
  <Step>Confirm route and permission coverage before release-visible changes.</Step>
  <Step>Regenerate evidence with \`pnpm docs:generate\`.</Step>
</Steps>`,
      ),
    });
  }

  for (const [id, api] of [...apis].sort()) {
    files.push({
      path: join(GENERATED_ROOT, 'api', `${id}.mdx`),
      content: generatedMdx(
        titleCase(id),
        api.summary,
        `${generatedBanner(`api-${id}`)}

${truthSurfaceCallout(id, [
  `API ID: \`${id}\``,
  `Route: \`${api.method} ${api.route}\``,
  `Owning feature: \`${api.feature}\``,
  `OpenAPI reference: \`/docs/openapi\``,
])}

## Overview: what this API actually does

${api.summary}

## When to use this evidence

Use this page before changing public contracts, route guards, or payload semantics.

## Source contract

${typeTable({
  API: { type: id, description: 'Stable API evidence ID.' },
  Method: { type: api.method, description: 'HTTP method declared in the feature manifest.' },
  Route: { type: api.route, description: 'Next.js route covered by this API evidence.' },
  Feature: { type: api.feature, description: 'Owning feature manifest.' },
})}

## Runtime surfaces: route and OpenAPI

This generated API page is manifest evidence. Where the route is part of the public HTTP surface, keep the
OpenAPI schema aligned so Fumadocs can render request and response details from the machine-readable contract.

See [OpenAPI Reference](/docs/openapi) for documented request and response interface truth.

${filesTree([`${api.method} ${api.route}`], 'API Route')}

## Failure modes

Failure behavior is owned by the feature manifest and the runtime route. Confirm status codes and response semantics in the OpenAPI reference before exposing the route externally.

## Source evidence: traceability

<Steps>
  <Step>Manifest: \`${manifestSourcePath(api.feature)}\`.</Step>
  <Step>Confirm the Next.js route \`${api.route}\` exists.</Step>
  <Step>Update OpenAPI coverage for public or operator-facing APIs.</Step>
</Steps>`,
      ),
    });
  }

  for (const [code, error] of [...errors].sort()) {
    files.push({
      path: join(GENERATED_ROOT, 'errors', `${code.toLowerCase()}.mdx`),
      content: generatedMdx(
        error.title,
        `Error evidence for ${code}.`,
        `${generatedBanner(`error-${code.toLowerCase()}`)}

## Overview: what this error means

This page records the generated evidence for \`${code}\`.

## When to use this evidence

Use this page when operators encounter this canonical error during authentication, authorization, or workflow execution.

## Source contract

${typeTable({
  Code: { type: code, description: 'Registered error code.' },
  Feature: { type: error.feature, description: 'Feature manifest that owns the error.' },
})}

## Runtime surfaces: operator response

${error.mitigation}

## Failure modes

- Regressions can alter response codes without documentation updates.
- Unhandled upstream dependencies can change operator-visible messages.

## Source evidence: traceability

<Steps>
  <Step>Keep the mitigation actionable for operators or developers.</Step>
  <Step>Keep the error code stable once external docs reference it.</Step>
  <Step>Regenerate evidence after changing the owning feature manifest.</Step>
</Steps>`,
      ),
    });
  }

  for (const [id, item] of [...troubleshooting].sort()) {
    files.push({
      path: join(GENERATED_ROOT, 'troubleshooting', `${id}.mdx`),
      content: generatedMdx(
        item.title,
        item.symptom,
        `${generatedBanner(`troubleshooting-${id}`)}

## Symptom: what operators observe
${item.symptom}

## Overview

Use this page to trace a recurring operator symptom back to stable evidence surfaces.

## When to use this evidence

When users report this symptom or when support routing requires deterministic guidance.

## Source contract

${typeTable({
  Case: { type: id, description: 'Stable troubleshooting case ID.' },
  Feature: { type: item.feature, description: 'Feature manifest that owns the case.' },
})}

## Runtime surfaces: diagnosis route

${bulletList([item.symptom])}

## Failure modes

- Manual fixes without manifest updates can create recurring incidents.
- Missing evidence linkage can make support and escalation slower.

## Source evidence: traceability

<Steps>
  <Step>Symptom: ${item.symptom}</Step>
  <Step>Resolution: ${item.resolution}</Step>
  <Step>Update the owning feature manifest if product behavior changes.</Step>
</Steps>`,
      ),
    });
  }

  return files;
}

function metaFile(path: string, title: string, pages?: string[]): RenderedFile {
  const payload: Record<string, unknown> = {
    generated: true,
    title,
    source: 'docs inventory graph',
    generatedBy: 'pnpm docs:generate',
  };
  if (pages) {
    payload.pages = pages;
    for (const page of pages) payload[page] = titleCase(page);
  }
  return { path, content: `${JSON.stringify(payload, null, 2)}\n` };
}

export function renderGeneratedFiles(graph: DocsInventoryGraph): RenderedFile[] {
  const groupedPages = renderGroupedPages(graph);
  const sectionPages = (section: string) =>
    groupedPages
      .filter((file) => toPosixPath(relative(GENERATED_ROOT, file.path)).startsWith(`${section}/`))
      .map((file) => toPosixPath(relative(join(GENERATED_ROOT, section), file.path)).replace(/\.mdx$/, ''))
      .sort();
  const featurePages = graph.manifests.map((manifest) => manifest.id).sort();

  const files: RenderedFile[] = [
    {
      path: join(GENERATED_ROOT, 'docs-inventory.generated.json'),
      content: `${JSON.stringify(graph, null, 2)}\n`,
    },
    metaFile(join(GENERATED_ROOT, 'meta.json'), 'Generated Evidence', [
      'features',
      'workflows',
      'permissions',
      'api',
      'errors',
      'troubleshooting',
    ]),
    metaFile(join(GENERATED_ROOT, 'features', 'meta.json'), 'Features', featurePages),
    metaFile(join(GENERATED_ROOT, 'workflows', 'meta.json'), 'Workflows', sectionPages('workflows')),
    metaFile(join(GENERATED_ROOT, 'permissions', 'meta.json'), 'Permissions', sectionPages('permissions')),
    metaFile(join(GENERATED_ROOT, 'api', 'meta.json'), 'API', sectionPages('api')),
    metaFile(join(GENERATED_ROOT, 'errors', 'meta.json'), 'Errors', sectionPages('errors')),
    metaFile(join(GENERATED_ROOT, 'troubleshooting', 'meta.json'), 'Troubleshooting', sectionPages('troubleshooting')),
    ...graph.manifests.map(renderFeature),
    ...groupedPages,
  ];
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function assertGeneratedHeaders(files: RenderedFile[]): string[] {
  const errors: string[] = [];
  for (const file of files) {
    if (file.path.endsWith('.mdx') && !file.content.includes(GENERATED_HEADER_MARKER)) {
      errors.push(`${relative(ROOT, file.path)} is missing the generated MDX header.`);
    }
    if (file.path.endsWith('.json')) {
      const parsed = JSON.parse(file.content) as { generated?: unknown; generatedBy?: unknown };
      if (parsed.generated !== true) {
        errors.push(`${relative(ROOT, file.path)} must declare generated=true.`);
      }
    }
  }
  return errors;
}

async function formatRenderedFiles(files: RenderedFile[]): Promise<RenderedFile[]> {
  return Promise.all(
    files.map(async (file) => {
      if (!file.path.endsWith('.mdx') && !file.path.endsWith('.json')) return file;
      const prettierConfig = (await resolvePrettierConfig(file.path)) ?? {};

      return {
        ...file,
        content: await formatWithPrettier(file.content, { ...prettierConfig, filepath: file.path }),
      };
    }),
  );
}

function writeOrCheck(files: RenderedFile[], check: boolean): string[] {
  const errors: string[] = [];
  const expectedPaths = new Set(files.map((file) => file.path));

  if (existsSync(GENERATED_ROOT)) {
    for (const existing of fg.sync('**/*.{mdx,json}', { cwd: GENERATED_ROOT, onlyFiles: true })) {
      const fullPath = join(GENERATED_ROOT, existing);
      if (!expectedPaths.has(fullPath)) {
        if (check) errors.push(`${relative(ROOT, fullPath)} is stale and should be removed by pnpm docs:generate.`);
      }
    }
  }

  if (!check) {
    rmSync(GENERATED_ROOT, { force: true, recursive: true });
  }

  for (const file of files) {
    if (check) {
      const current = existsSync(file.path) ? readFileSync(file.path, 'utf8') : null;
      if (current !== file.content) {
        errors.push(`${relative(ROOT, file.path)} is stale. Run pnpm docs:generate.`);
      }
      continue;
    }
    mkdirSync(dirname(file.path), { recursive: true });
    writeFileSync(file.path, file.content, 'utf8');
  }

  return errors;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function mdxToSearchText(content: string): string {
  return content
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(GENERATED_HEADER_PATTERN, '')
    .replace(/[`*_#[\](){}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function routeToSearchMirrorPath(route: string): string {
  const normalized = route.startsWith('/') ? route : `/${route}`;
  const docsRoot = normalized.startsWith('/en/docs') ? normalized.slice(3) : normalized;
  const local = docsRoot.replace(/^\/+/, '').replace(/\/+$/, '');
  if (local === 'docs' || local === '') return 'index.html';
  return `${local}.html`;
}

function collectContentSearchEntries(): SearchIndexFile[] {
  const sourceFiles = fg.sync('content/i18n/docs/en/**/*.mdx', { cwd: ROOT, onlyFiles: true }).sort();
  const entries: SearchIndexFile[] = [];

  for (const file of sourceFiles) {
    const abs = join(ROOT, file);
    const route = getDocsPageRoute(file);
    const routeNormalized = route.startsWith('/') ? route : `/${route}`;
    if (!routeNormalized.startsWith('/en/docs')) continue;

    const content = readFileSync(abs, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const title = frontmatter.title;
    entries.push({
      route,
      title: title ?? file,
      body: mdxToSearchText(content),
    });
    if (route === '/en/docs') {
      entries.push({
        route: '/docs',
        title: `${frontmatter.title ?? 'Docs'} Home`,
        body: mdxToSearchText(content),
      });
    }
  }

  const seenRoutes = new Set<string>();
  return entries.filter((entry) => {
    if (seenRoutes.has(entry.route)) return false;
    seenRoutes.add(entry.route);
    return true;
  });
}

function writeSearchSite(files: RenderedFile[]) {
  rmSync(SEARCH_SITE_ROOT, { force: true, recursive: true });
  const searchEntries = collectContentSearchEntries();

  for (const file of files.filter((item) => item.path.endsWith('.mdx'))) {
    searchEntries.push({
      route: getGeneratedRoute(toPosixPath(relative(GENERATED_ROOT, file.path))),
      title: parseFrontmatter(file.content).title ?? file.path,
      body: mdxToSearchText(file.content),
    });
  }

  for (const entry of searchEntries) {
    const outPath = join(SEARCH_SITE_ROOT, routeToSearchMirrorPath(entry.route));
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(entry.title)}</title>
    <meta name="pagefind:route" content="${escapeHtml(entry.route)}">
  </head>
  <body data-pagefind-body>
    <h1>${escapeHtml(entry.title)}</h1>
    <main>${escapeHtml(entry.body)}</main>
  </body>
</html>
`;
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
  }
}

function checkSearchOutput(): string[] {
  const required = [join(ROOT, 'public/_pagefind/pagefind.js'), join(ROOT, 'public/_pagefind/pagefind-entry.json')];
  const errors = required
    .filter((file) => !existsSync(file))
    .map((file) => `${relative(ROOT, file)} is missing. Run pnpm docs:search.`);

  if (!existsSync(SEARCH_SITE_ROOT)) {
    errors.push(`Missing search mirror at ${relative(ROOT, SEARCH_SITE_ROOT)}. Run pnpm docs:search.`);
    return errors;
  }

  const expectedMirrors = [
    '/en/docs',
    '/en/docs/curated/what-is-afenda',
    '/en/docs/curated/doctrine',
    '/en/docs/openapi',
    '/en/docs/generated/features/docs',
    '/en/docs/generated/api/platform.health',
  ];
  for (const route of expectedMirrors) {
    const expectedPath = join(SEARCH_SITE_ROOT, routeToSearchMirrorPath(route));
    if (!existsSync(expectedPath)) {
      errors.push(`${relative(ROOT, expectedPath)} is missing from the docs search site mirror.`);
    }
  }

  const indexedPages = fg.sync('**/*.html', { cwd: SEARCH_SITE_ROOT, onlyFiles: true });
  if (indexedPages.length < DOCS_SEARCH_MIN_PAGES) {
    errors.push(
      `Search mirror too small: ${indexedPages.length} pages, expected at least ${DOCS_SEARCH_MIN_PAGES}. Run pnpm docs:generate and ensure search source coverage.`,
    );
  }

  let totalSearchText = 0;
  for (const page of indexedPages) {
    const content = readFileSync(join(SEARCH_SITE_ROOT, page), 'utf8');
    const body = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    totalSearchText += body.length;
  }
  if (totalSearchText < DOCS_SEARCH_MIN_TEXT_CHARS) {
    errors.push(
      `Search mirror text volume too low: ${totalSearchText} chars, expected at least ${DOCS_SEARCH_MIN_TEXT_CHARS}.`,
    );
  }

  return errors;
}

function validateDocsContentContracts(): { errors: string[] } {
  const docsFiles = fg.sync('content/i18n/docs/en/**/*.mdx', { cwd: ROOT, onlyFiles: true });
  const errors: string[] = [];
  const validRoutes = new Set<string>();

  for (const file of docsFiles) {
    const route = getDocsPageRoute(file);
    validRoutes.add(route);

    const normalized = route.startsWith('/') ? route : `/${route}`;
    if (normalized.startsWith('/en/docs/')) {
      validRoutes.add(normalized.replace(/^\/en(?=\/)/, ''));
    }
  }

  for (const file of docsFiles) {
    const abs = join(ROOT, file);
    const rel = toPosixPath(relative(ROOT, abs));
    const content = readFileSync(abs, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const expectedType = getExpectedDocsType(toPosixPath(rel).replace(/^content\/i18n\/docs\/en\//, ''));

    if (!frontmatter.docsType) {
      if (frontmatter.docsTypeRaw) {
        const message = `${rel}: invalid docsType "${frontmatter.docsTypeRaw}". Allowed values: ${DOCS_CONTENT_TYPE_VALUES.join(', ')}.`;
        errors.push(message);
      } else {
        const message = `${rel}: missing docsType frontmatter; expected "${expectedType ?? 'explicit docsType'}".`;
        errors.push(message);
      }
      continue;
    }

    const docsType = frontmatter.docsType;
    if (expectedType && docsType !== expectedType) {
      const message = `${rel}: docsType "${docsType}" does not match route expectation "${expectedType}".`;
      errors.push(message);
    }

    errors.push(...validateMdxImportPolicy(content, rel, docsType));

    if (!DOCS_SECTION_REQUIREMENTS[docsType]) continue;

    if (!validateDocsSectionContract(content, docsType)) {
      const required = DOCS_SECTION_REQUIREMENTS[docsType].requiredHeadings.join(', ');
      const message = `${rel}: ${docsType} docs must include headings in order: ${required}.`;
      errors.push(message);
    }
  }

  const indexPath = toPosixPath(join(ROOT, 'content/i18n/docs/en/index.mdx'));
  const homeContent = readFileSync(indexPath, 'utf8');
  const hrefs = homeContent.match(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/g) ?? [];
  for (const hrefRaw of hrefs) {
    const value = hrefRaw.match(/["']([^"']+)["']/)?.[1];
    if (!value) continue;
    if (!value.startsWith('/docs') && !value.startsWith('/llms') && !value.startsWith('/rss.xml')) continue;
    if (!validRoutes.has(value) && value !== '/llms.txt' && value !== '/llms-full.txt' && value !== '/rss.xml') {
      errors.push(`content/i18n/docs/en/index.mdx: stale home href "${value}" does not map to a documented route.`);
    }
  }

  return { errors };
}

function checkDocsDefaultFirstBoundary(): string[] {
  const errors: string[] = [];

  for (const path of DOCS_DEFAULT_FIRST_FORBIDDEN_PATHS) {
    if (existsSync(join(ROOT, path))) {
      errors.push(`${path} must not exist in Wave 1; use upstream Fumadocs defaults instead.`);
    }
  }

  const searchableFiles = fg.sync(['src/**/*.{ts,tsx,css,md,mdx,json}', 'content/i18n/docs/en/**/*.mdx', 'cli.json'], {
    cwd: ROOT,
    onlyFiles: true,
    ignore: ['src/docs/runtime/README.md'],
  });

  for (const file of searchableFiles) {
    const content = readFileSync(join(ROOT, file), 'utf8');

    for (const token of DOCS_DEFAULT_FIRST_FORBIDDEN_TEXT) {
      if (content.includes(token)) {
        errors.push(`${file} references stale docs customization token "${token}".`);
      }
    }

    if (file.endsWith('.mdx') && /^icon:/m.test(content)) {
      errors.push(`${file} contains icon frontmatter; avoid non-serializable page-tree icon data.`);
    }
  }

  const docsCssPath = join(ROOT, 'src/app/[locale]/docs/docs.css');
  if (existsSync(docsCssPath)) {
    const docsCss = readFileSync(docsCssPath, 'utf8');
    const beforePrint = docsCss.split('@media print')[0] ?? docsCss;

    for (const selector of DOCS_FORBIDDEN_CSS_SELECTORS) {
      if (docsCss.includes(selector)) {
        errors.push(`src/app/[locale]/docs/docs.css must not override Fumadocs selector "${selector}".`);
      }
    }

    for (const selector of ['#nd-sidebar', '#nd-toc']) {
      if (beforePrint.includes(selector)) {
        errors.push(`src/app/[locale]/docs/docs.css may only target "${selector}" inside print rules.`);
      }
    }
  }

  return errors;
}

async function checkLLMExports(): Promise<string[]> {
  const errors: string[] = [];
  const requiredRoutes = [
    'src/app/(docs-meta)/llms.txt/route.ts',
    'src/app/(docs-meta)/llms-full.txt/route.ts',
    'src/app/(docs-meta)/llms.mdx/[locale]/docs/[[...slug]]/route.ts',
    'src/docs/runtime/docs-llm-text.serializer.ts',
  ];

  for (const route of requiredRoutes) {
    if (!existsSync(join(ROOT, route))) {
      errors.push(`${route} is missing.`);
    }
  }

  const sourceConfig = readFileSync(join(ROOT, 'source.config.ts'), 'utf8');
  if (!sourceConfig.includes('includeProcessedMarkdown: true')) {
    errors.push('source.config.ts must enable includeProcessedMarkdown for LLM exports.');
  }
  if (!sourceConfig.includes('extractLinkReferences: true')) {
    errors.push('source.config.ts must enable extractLinkReferences for link-aware docs quality.');
  }

  const nextConfig = readFileSync(join(ROOT, 'next.config.mjs'), 'utf8');
  if (
    !nextConfig.includes("source: '/:locale/docs/:path*.mdx'") ||
    !nextConfig.includes("destination: '/llms.mdx/:locale/docs/:path*'")
  ) {
    errors.push('next.config.mjs must rewrite /docs/<slug>.mdx to the LLM Markdown route.');
  }

  const proxyPath = join(ROOT, 'src/proxy.ts');
  if (existsSync(proxyPath)) {
    const proxy = readFileSync(proxyPath, 'utf8');
    if (!proxy.includes('isMarkdownPreferred') || !proxy.includes('rewritePath')) {
      errors.push(
        'src/proxy.ts must implement Fumadocs LLM Accept negotiation (isMarkdownPreferred + rewritePath). See https://www.fumadocs.dev/docs/integrations/llms',
      );
    }
  } else {
    errors.push('src/proxy.ts is missing; required for LLM-friendly docs (Accept: text/markdown rewrites).');
  }

  const llmText = readFileSync(join(ROOT, 'src/docs/runtime/docs-llm-text.serializer.ts'), 'utf8');
  if (!llmText.includes("getText('processed')")) {
    errors.push('getLLMText must read processed Markdown from Fumadocs.');
  }

  const representative = join(ROOT, 'content/i18n/docs/en/generated/features/admin.mdx');
  if (!existsSync(representative)) {
    errors.push('content/i18n/docs/en/generated/features/admin.mdx is missing; run pnpm docs:generate.');
  } else {
    const content = readFileSync(representative, 'utf8');
    if (
      (!content.includes('title: "Administration"') && !content.includes("title: 'Administration'")) ||
      !content.includes(GENERATED_HEADER_MARKER)
    ) {
      errors.push('representative generated docs page is not ready for LLM export.');
    }
  }

  if (!existsSync(join(ROOT, '.source/server.ts'))) {
    errors.push('.source/server.ts is missing; run pnpm docs:source before docs:llms.');
  }

  return errors;
}

async function run(command: string, check: boolean) {
  if (command === 'contract') {
    const model = await loadManifestModel();
    const errors = validateModel(model);
    if (errors.length > 0) throw new Error(errors.join('\n'));
    console.log(`docs contract passed (${model.manifests.length} manifests, ${model.appSurfaces.length} app surfaces)`);
    return;
  }

  const model = await loadManifestModel();
  const validationErrors = validateModel(model);
  if (validationErrors.length > 0) throw new Error(validationErrors.join('\n'));
  const graph = buildInventoryGraph(model);
  const unformattedFiles = renderGeneratedFiles(graph);
  const headerErrors = assertGeneratedHeaders(unformattedFiles);
  if (headerErrors.length > 0) throw new Error(headerErrors.join('\n'));
  const files = await formatRenderedFiles(unformattedFiles);

  if (command === 'inventory') {
    const inventory = files.find((file) => file.path.endsWith('docs-inventory.generated.json'));
    if (!inventory) throw new Error('docs inventory graph was not rendered.');
    if (check) {
      const current = existsSync(inventory.path) ? readFileSync(inventory.path, 'utf8') : null;
      if (current !== inventory.content)
        throw new Error(`${relative(ROOT, inventory.path)} is stale. Run pnpm docs:generate.`);
      console.log('docs inventory graph is current');
    } else {
      mkdirSync(dirname(inventory.path), { recursive: true });
      writeFileSync(inventory.path, inventory.content, 'utf8');
      console.log('docs inventory graph written');
    }
    return;
  }

  if (command === 'generate') {
    const errors = writeOrCheck(files, check);
    if (errors.length > 0) throw new Error(errors.join('\n'));
    console.log(check ? 'generated docs are current' : `generated ${files.length} docs evidence files`);
    return;
  }

  if (command === 'check') {
    const contractValidation = validateDocsContentContracts();
    const openApiErrors = validateOpenApiAlignment(model);

    const errors = [
      ...writeOrCheck(files, true),
      ...checkDocsDefaultFirstBoundary(),
      ...contractValidation.errors,
      ...openApiErrors,
    ];

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    console.log('docs evidence check passed');
    return;
  }

  if (command === 'search-site') {
    writeSearchSite(files);
    console.log(`docs search site written to ${relative(ROOT, SEARCH_SITE_ROOT)}`);
    return;
  }

  if (command === 'search-check') {
    const errors = checkSearchOutput();
    if (errors.length > 0) throw new Error(errors.join('\n'));
    console.log('docs search output exists');
    return;
  }

  if (command === 'links') {
    const { runDocsLinkValidation } = await import('./docs-validate-links');
    await runDocsLinkValidation();
    console.log('docs links are valid');
    return;
  }

  if (command === 'llms') {
    const errors = await checkLLMExports();
    if (errors.length > 0) throw new Error(errors.join('\n'));
    console.log('docs LLM exports are valid');
    return;
  }

  throw new Error(`Unknown docs evidence command "${command}".`);
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (import.meta.url === entry) {
  const command = process.argv[2] ?? 'check';
  const check = process.argv.includes('--check');
  run(command, check).catch((error: unknown) => {
    console.error('docs evidence pipeline failed:\n');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
