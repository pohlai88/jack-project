import fg from 'fast-glob';

import fs from 'node:fs/promises';
import path from 'node:path';

const host = process.env.PDF_HOST ?? 'http://localhost:3000';
const outDir = process.env.PDF_OUT_DIR ?? path.join('.artifacts', 'docs-pdf');
const docsDir = process.env.PDF_DOCS_DIR ?? path.join('content', 'i18n', 'docs');
process.env.PUPPETEER_CACHE_DIR ??= path.resolve('.artifacts', 'puppeteer');

function pdfNameForPage(page: { slugs: string[] }) {
  return `${page.slugs.length > 0 ? page.slugs.join('-') : 'index'}.pdf`;
}

async function getDocPages() {
  const files = await fg('**/*.mdx', {
    cwd: docsDir,
    onlyFiles: true,
  });

  return files
    .map((file) => {
      const pathSegments = file.split('/');
      const fileName = pathSegments.at(-1);
      if (!fileName) {
        throw new Error(`Unable to read docs page path: ${file}`);
      }

      const slugs =
        fileName === 'index.mdx'
          ? pathSegments.slice(0, -1)
          : [...pathSegments.slice(0, -1), fileName.replace(/\.mdx$/, '')];

      return {
        slugs,
        url: `/docs${slugs.length > 0 ? `/${slugs.map(encodeURIComponent).join('/')}` : ''}`,
      };
    })
    .sort((left, right) => left.url.localeCompare(right.url));
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const { default: puppeteer } = await import('puppeteer');
  const browser = await puppeteer.launch();
  const docPages = await getDocPages();

  try {
    for (const docPage of docPages) {
      const page = await browser.newPage();
      const url = new URL(docPage.url, host).toString();
      const outputPath = path.join(outDir, pdfNameForPage(docPage));

      try {
        await page.emulateMediaType('print');
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        if (!response?.ok()) {
          throw new Error(`Failed to load ${url}: ${response?.status() ?? 'no response'}`);
        }
        await page.pdf({
          path: outputPath,
          width: 950,
          printBackground: true,
        });
        console.log(`PDF generated successfully for ${docPage.url}: ${outputPath}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

void main();
