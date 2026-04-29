// src/docs/runtime/docs-mdx.policy.ts

export const DOCS_MDX_LOCKED_COMPONENTS = ['APIPage', 'TypeTable'] as const;

export type DocsMdxLockedComponent = (typeof DOCS_MDX_LOCKED_COMPONENTS)[number];

export function isDocsMdxLockedComponent(name: string): name is DocsMdxLockedComponent {
  return DOCS_MDX_LOCKED_COMPONENTS.includes(name as DocsMdxLockedComponent);
}
