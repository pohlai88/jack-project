import { source } from './source';

export async function getLLMText(page: (typeof source)['$inferPage']): Promise<string> {
  const processed = await page.data.getText('processed');
  const description = page.data.description ? `\n\n> ${page.data.description}` : '';

  return `# ${page.data.title} (${page.url})${description}\n\n${processed}`.trimEnd() + '\n';
}
