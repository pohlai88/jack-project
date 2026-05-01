// src/docs/runtime/docs-mdx.policy.ts

export const DOCS_MDX_LOCKED_COMPONENTS = [
  'Accordion',
  'Accordions',
  'APIPage',
  'AutoTypeTable',
  'Banner',
  'GithubInfo',
  'GraphView',
  'InlineTOC',
  'Step',
  'Steps',
  'Tab',
  'Tabs',
  'TabsContent',
  'TabsList',
  'TabsTrigger',
  'TypeTable',
] as const;

export type DocsMdxLockedComponent = (typeof DOCS_MDX_LOCKED_COMPONENTS)[number];

export function isDocsMdxLockedComponent(name: string): name is DocsMdxLockedComponent {
  return DOCS_MDX_LOCKED_COMPONENTS.includes(name as DocsMdxLockedComponent);
}
