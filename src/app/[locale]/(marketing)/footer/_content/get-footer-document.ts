import { notFound } from 'next/navigation';

import { defaultFooterDocumentBySlug } from './footer-documents';

export function getFooterDocumentOrNotFound(slug: string) {
  const doc = defaultFooterDocumentBySlug[slug];
  if (!doc) notFound();
  return doc;
}
