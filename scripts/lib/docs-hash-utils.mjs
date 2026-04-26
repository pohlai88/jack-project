import { createHash } from 'node:crypto';

export function normalizeMarkdown(content) {
  const normalizedLines = content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''));

  return `${normalizedLines.join('\n').replace(/\n+$/g, '')}\n`;
}

export function hashMarkdown(content) {
  return createHash('sha256').update(normalizeMarkdown(content)).digest('hex');
}
