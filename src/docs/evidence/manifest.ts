export const docsReleaseStates = ['draft', 'beta', 'released', 'deprecated'] as const;

export type DocsReleaseState = (typeof docsReleaseStates)[number];

export interface DocsWorkflowRef {
  id: string;
  title: string;
  summary: string;
}

export interface DocsActionRef {
  id: string;
  title: string;
  summary: string;
}

export interface DocsApiRef {
  id: string;
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  route: string;
  summary: string;
}

export interface DocsErrorRef {
  code: string;
  title: string;
  mitigation: string;
}

export interface DocsTroubleshootingRef {
  id: string;
  title: string;
  symptom: string;
  resolution: string;
}

export interface DocsManifest {
  id: string;
  title: string;
  module: string;
  owner: string;
  releaseState: DocsReleaseState;
  summary: string;
  routes: string[];
  permissions: string[];
  workflows: DocsWorkflowRef[];
  actions: DocsActionRef[];
  apis: DocsApiRef[];
  errors: DocsErrorRef[];
  troubleshooting: DocsTroubleshootingRef[];
}

export function defineDocsManifest(manifest: DocsManifest): DocsManifest {
  return manifest;
}
