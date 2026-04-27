import type { LucideIcon } from 'lucide-react';

export interface DocPage {
  slug: string;
  titleKey: string;
  descriptionKey?: string;
  order: number;
}

export interface DocSection {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  pages: DocPage[];
}

export interface DocFrontmatter {
  title: string;
  description?: string;
  section?: string;
  order?: number;
  /** i18n message key for in-app docs sidebar; required on canonical `en` pages (see `pnpm docs:generate-nav`). */
  navTitleKey?: string;
  hidden?: boolean;
  fallbackAllowedLocales?: string[];
  translation?: {
    sourceLocale: 'en';
    sourcePath: string;
    sourceHash: string;
    status: 'generated' | 'reviewed' | 'needs-review';
  };
}

export interface DocContent {
  frontmatter: DocFrontmatter;
  content: string;
  slug: string;
  requestedLocale: string;
  resolvedLocale: string;
  isFallback: boolean;
}

export interface DocSearchItem {
  slug: string;
  url: string;
  title: string;
  description: string;
  section: string;
  sectionId: string;
  requestedLocale: string;
  resolvedLocale: string;
  isFallback: boolean;
  content: string;
}

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocNavItem {
  slug: string;
  titleKey: string;
  section: string;
}
