import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { i18n } from '@/docs/runtime/i18n';
import { docs } from 'fumadocs-mdx:collections/server';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
  icon(icon) {
    if (!icon) return;

    const Icon = icons[icon as keyof typeof icons];
    if (!Icon) return;

    return createElement(Icon);
  },
});
