import { BookOpen, GraduationCap, HelpCircle, Settings } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

/**
 * Metadata for top-level doc nav sections. Page lists are generated from
 * English Markdown frontmatter — see `docs-nav-pages.generated.json` and
 * `pnpm docs:generate-nav`.
 */
export const sectionNavConfig: Record<string, { titleKey: string; icon: LucideIcon; sectionOrder: number }> = {
  'getting-started': {
    titleKey: 'docs.nav.gettingStarted',
    icon: BookOpen,
    sectionOrder: 1,
  },
  member: {
    titleKey: 'docs.nav.memberGuide',
    icon: GraduationCap,
    sectionOrder: 2,
  },
  admin: {
    titleKey: 'docs.nav.adminGuide',
    icon: Settings,
    sectionOrder: 3,
  },
  faq: {
    titleKey: 'docs.nav.faq',
    icon: HelpCircle,
    sectionOrder: 4,
  },
};
