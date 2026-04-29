export const DOCS_RELEASE_STATES = ['draft', 'beta', 'released', 'deprecated'] as const;
export const docsReleaseStates = DOCS_RELEASE_STATES;

export type DocsReleaseState = (typeof DOCS_RELEASE_STATES)[number];

export interface DocsManifestReference {
  id: string;
  title: string;
  summary: string;
}

export interface DocsManifestApiReference {
  id: string;
  title?: string;
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  route: string;
  summary: string;
  version?: string;
  public?: boolean;
}

export interface DocsManifestErrorReference {
  code: string;
  title: string;
  mitigation: string;
}

export interface DocsManifestTroubleshootingReference {
  id: string;
  title: string;
  symptom: string;
  resolution: string;
  summary?: string;
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
  workflows: DocsManifestReference[];
  actions: DocsManifestReference[];
  apis: DocsManifestApiReference[];
  errors: DocsManifestErrorReference[];
  troubleshooting: DocsManifestTroubleshootingReference[];
  lastUpdated?: string;
  version?: string;
}

export function defineDocsManifest(manifest: DocsManifest): DocsManifest {
  assertNonEmptyString(manifest.id, 'id');
  assertNonEmptyString(manifest.title, 'title');
  assertNonEmptyString(manifest.module, 'module');
  assertNonEmptyString(manifest.owner, 'owner');
  assertNonEmptyString(manifest.summary, 'summary');
  assertNonEmptyArray(manifest.routes, 'routes');

  if (!DOCS_RELEASE_STATES.includes(manifest.releaseState)) {
    throw new Error(`[DocsManifest] Invalid releaseState "${manifest.releaseState}"`);
  }

  return manifest;
}

function assertNonEmptyString(value: unknown, field: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`[DocsManifest] "${field}" must be a non-empty string`);
  }
}

function assertNonEmptyArray(value: readonly unknown[], field: string): void {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`[DocsManifest] "${field}" must not be empty`);
  }
}
