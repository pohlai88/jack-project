export const DOCS_CONTENT_TYPE_VALUES = ['index', 'curated', 'generated-evidence', 'api', 'llm'] as const;
export type DocsContentType = (typeof DOCS_CONTENT_TYPE_VALUES)[number];

export interface FrontmatterEnvelope {
  title: string;
  description?: string;
  docsType?: DocsContentType;
  docsTypeRaw?: string;
}

export interface DocsSectionRequirement {
  type: DocsContentType;
  requiredHeadings: string[];
  allowedAliasHeadings?: string[][];
}

export const DOCS_SECTION_REQUIREMENTS: Record<string, DocsSectionRequirement> = {
  curated: {
    type: 'curated',
    requiredHeadings: ['thesis', 'model', 'operational implication', 'next reading'],
    allowedAliasHeadings: [
      ['thesis'],
      ['model', 'model:'],
      ['operational implication', 'operational implications'],
      ['next reading', 'next'],
    ],
  },
  'generated-evidence': {
    type: 'generated-evidence',
    requiredHeadings: [
      'overview',
      'when to use',
      'source contract',
      'runtime surfaces',
      'failure modes',
      'source evidence',
    ],
    allowedAliasHeadings: [
      ['overview'],
      ['when to use', 'when to use this evidence'],
      ['source contract'],
      ['runtime surfaces', 'runtime surface', 'runtime interfaces'],
      ['failure modes'],
      ['source evidence', 'source evidence: traceability'],
    ],
  },
};

export const MDX_ALLOWED_IMPORT_PREFIXES = [
  'fumadocs-ui/',
  'fumadocs-openapi/',
  'fumadocs-openapi',
  'fumadocs-typescript',
  '@/shared/components/markdown/Mermaid',
  'react',
] as const;

const MDX_IMPORT_RE = /^\s*import\s+[^\\n]+?\s+from\s+["']([^"']+)["']/gm;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function normalizeHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/[`*_"'’]/g, '')
    .replace(/\s*:\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseFrontmatter(content: string): FrontmatterEnvelope {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    return { title: 'Untitled' };
  }

  const block = match[1] ?? '';
  const result: FrontmatterEnvelope = { title: 'Untitled' };

  for (const line of block.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const idx = trimmed.indexOf(':');
    if (idx < 0) continue;

    const key = trimmed.slice(0, idx).trim();
    const rawValue = trimmed.slice(idx + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, '');

    if (key === 'title') {
      result.title = value || 'Untitled';
    } else if (key === 'description') {
      result.description = value;
    } else if (key === 'docsType') {
      result.docsTypeRaw = value;
      if ((DOCS_CONTENT_TYPE_VALUES as readonly string[]).includes(value)) {
        result.docsType = value as DocsContentType;
      }
    }
  }

  return result;
}

export function getExpectedDocsType(relativePath: string): DocsContentType | null {
  const normalized = relativePath.replace(/\\/g, '/');

  if (normalized === 'index.mdx') return 'index';
  if (normalized.startsWith('openapi/')) return 'api';
  if (normalized.includes('/generated/')) return 'generated-evidence';
  if (normalized.startsWith('curated/')) return 'curated';
  if (normalized.startsWith('index')) return 'index';

  return null;
}

export function extractHeadings(content: string): string[] {
  const body = content.replace(FRONTMATTER_RE, '');
  const headingLines = body.match(/^##\s+(.+)$/gm) ?? [];
  return headingLines.map((line) => normalizeHeading(line.replace(/^##\s+/, '')));
}

export function hasOrderedHeadings(content: string, docsType: DocsContentType, required: string[]): boolean {
  const requirement = DOCS_SECTION_REQUIREMENTS[docsType];
  const headings = extractHeadings(content);
  let cursor = -1;

  for (const section of required) {
    const aliases = requirement.allowedAliasHeadings?.find((candidates) => candidates.includes(section)) ?? [section];

    const normalizedAliases = aliases.map((alias) => normalizeHeading(alias));
    const found = headings.findIndex(
      (heading, index) =>
        index > cursor &&
        normalizedAliases.some((alias) => heading.includes(alias) || alias.includes(heading) || alias === heading),
    );

    if (found < 0) return false;
    cursor = found;
  }

  return true;
}

export function extractMdxImports(content: string): string[] {
  const imports: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = MDX_IMPORT_RE.exec(content)) !== null) {
    const source = match[1];
    if (source) {
      imports.push(source);
    }
  }

  return imports;
}

function isAllowedImport(source: string, _docsType: DocsContentType): boolean {
  return (
    MDX_ALLOWED_IMPORT_PREFIXES.some((prefix) => source === prefix || source.startsWith(prefix)) ||
    source.startsWith('@/shared/components/markdown/Mermaid')
  );
}

export function validateMdxImportPolicy(content: string, file: string, docsType: DocsContentType): string[] {
  const errors: string[] = [];
  const imports = extractMdxImports(content);

  if (imports.length === 0) return errors;

  for (const source of imports) {
    if (!isAllowedImport(source, docsType)) {
      errors.push(
        `${file}: docs type "${docsType}" imports "${source}", which is outside policy (allowed imports: package Fumadocs UI/OpenAPI modules and approved shared Markdown helpers).`,
      );
    }

    if (source.startsWith('./') || source.startsWith('../')) {
      errors.push(`${file}: relative MDX import "${source}" is not allowed for docs portability.`);
    }
  }

  return errors;
}
