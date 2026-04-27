import docNavPagesJson from './docs-nav-pages.generated.json';

import { sectionNavConfig } from './docs-nav-sections.config';
import type { DocNavItem, DocSection } from '../types';

interface GeneratedNavPage {
  section: string;
  slug: string;
  order: number;
  titleKey: string;
}

function buildDocSections(): DocSection[] {
  const pages = (docNavPagesJson as { pages: GeneratedNavPage[] }).pages;
  const bySection = new Map<string, GeneratedNavPage[]>();
  for (const page of pages) {
    const list = bySection.get(page.section);
    if (list) {
      list.push(page);
    } else {
      bySection.set(page.section, [page]);
    }
  }

  const sectionIds = (Object.keys(sectionNavConfig) as (keyof typeof sectionNavConfig)[]).sort(
    (a, b) => sectionNavConfig[a].sectionOrder - sectionNavConfig[b].sectionOrder,
  );

  return sectionIds
    .map((id) => {
      const config = sectionNavConfig[id];
      const sectionPages = (bySection.get(id) ?? [])
        .sort((a, b) => a.order - b.order)
        .map((p) => ({ slug: p.slug, titleKey: p.titleKey, order: p.order }));
      return {
        id,
        titleKey: config.titleKey,
        icon: config.icon,
        pages: sectionPages,
      };
    })
    .filter((section) => section.pages.length > 0);
}

/**
 * In-app documentation navigation. Page lists are generated from English Markdown
 * (`docs-nav-pages.generated.json` via `pnpm docs:generate-nav`); section labels and
 * icons live in `docs-nav-sections.config.ts`.
 */
export const docSections: DocSection[] = buildDocSections();

/** Flat ordered list of all doc pages for prev/next navigation */
export function getAllDocPages(): DocNavItem[] {
  const out: DocNavItem[] = [];
  for (const section of docSections) {
    for (const page of section.pages) {
      out.push({ slug: page.slug, titleKey: page.titleKey, section: section.id });
    }
  }
  return out;
}

/** Get prev and next pages for a given slug */
export function getPrevNextPages(slug: string): { prev: DocNavItem | null; next: DocNavItem | null } {
  const pages = getAllDocPages();
  const idx = pages.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? pages[idx - 1]! : null,
    next: idx < pages.length - 1 ? pages[idx + 1]! : null,
  };
}

/** Find which section a slug belongs to */
export function findSectionForSlug(slug: string): DocSection | undefined {
  return docSections.find((s) => s.pages.some((p) => p.slug === slug));
}

/** Get breadcrumb items for a slug */
export function getBreadcrumbs(slug: string): { titleKey: string; slug?: string }[] {
  const section = findSectionForSlug(slug);
  if (!section) return [];

  const page = section.pages.find((p) => p.slug === slug);
  const crumbs: { titleKey: string; slug?: string }[] = [{ titleKey: 'docs.title', slug: undefined }];

  if (slug.includes('/')) {
    crumbs.push({ titleKey: section.titleKey, slug: section.pages[0]?.slug });
  }

  if (page) {
    crumbs.push({ titleKey: page.titleKey });
  }

  return crumbs;
}
