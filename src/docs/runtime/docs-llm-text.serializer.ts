import { source } from './docs-source.registry';

type DocsPage = (typeof source)['$inferPage'];

const EXPORT_TRAILING_NEWLINE = '\n';

export async function getLLMText(page: DocsPage): Promise<string> {
  if (page.type === 'openapi') {
    return serializeOpenApiPage(page);
  }

  return serializeMarkdownPage(page);
}

function serializeOpenApiPage(page: DocsPage): string {
  if (!('getSchema' in page.data)) {
    return withTrailingNewline(JSON.stringify(page.data, null, 2));
  }

  return withTrailingNewline(JSON.stringify(page.data.getSchema().bundled, null, 2));
}

async function serializeMarkdownPage(page: DocsPage): Promise<string> {
  if (!('getText' in page.data)) {
    return withTrailingNewline(
      [formatPageHeading(page), formatPageDescription(page)].filter(isNonEmptyString).join('\n\n'),
    );
  }

  const processedText = await page.data.getText('processed');

  return withTrailingNewline(
    [formatPageHeading(page), formatPageDescription(page), processedText].filter(isNonEmptyString).join('\n\n'),
  );
}

function formatPageHeading(page: DocsPage): string {
  return `# ${page.data.title || 'Untitled'} (${page.url})`;
}

function formatPageDescription(page: DocsPage): string | null {
  const description = page.data.description?.trim();
  return description ? `> ${description}` : null;
}

function withTrailingNewline(value: string): string {
  return value.trimEnd().concat(EXPORT_TRAILING_NEWLINE);
}

function isNonEmptyString(value: string | null): value is string {
  return typeof value === 'string' && value.length > 0;
}
