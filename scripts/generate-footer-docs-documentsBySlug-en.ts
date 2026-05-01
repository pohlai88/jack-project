/**
 * One-shot helper: emit `documentsBySlug` JSON matching `defaultFooterDocuments`
 * for merging into `src/i18n/catalogs/source/en.json` under `landing.footerDocs`.
 *
 * Usage (repo root): `pnpm exec tsx scripts/generate-footer-docs-documentsBySlug-en.ts`
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { defaultFooterDocuments } from '../src/app/[locale]/(marketing)/footer/_content/footer-documents';

const documentsBySlug = Object.fromEntries(
  defaultFooterDocuments.map((doc) => [
    doc.slug,
    {
      title: doc.title,
      subtitle: doc.subtitle,
      purpose: doc.purpose,
      contact: doc.contact,
      responseStandard: doc.responseStandard,
      sections: doc.sections.map((s) => ({
        heading: s.heading,
        paragraphs: [...s.paragraphs],
        ...('bullets' in s && s.bullets ? { bullets: [...s.bullets] } : {}),
      })),
      ...('citations' in doc && doc.citations ? { citations: [...doc.citations] } : {}),
    },
  ]),
);

const outDir = path.join(process.cwd(), '.artifacts/i18n');
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'footer-docs-documentsBySlug-en.json');
writeFileSync(outPath, `${JSON.stringify({ documentsBySlug }, null, 2)}\n`, 'utf8');
process.stdout.write(`${outPath}\n`);
