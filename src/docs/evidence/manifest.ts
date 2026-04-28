/* ========================================================================
   Docs Manifest Contract — Afenda Governance Surface
   ======================================================================== */

export const docsReleaseStates = ['draft', 'beta', 'released', 'deprecated'] as const;

export type DocsReleaseState = (typeof docsReleaseStates)[number];

/* ------------------------------------------------------------------------
      ID TYPES — enforce structure (no random strings)
      ------------------------------------------------------------------------ */

export type DocsId = string;
export type RoutePath = string;
export type PermissionKey = string;

/* ------------------------------------------------------------------------
      BASE CONTRACT
      ------------------------------------------------------------------------ */

interface BaseRef {
  id: DocsId;
  title: string;
  summary: string;
}

/* ------------------------------------------------------------------------
      DOMAIN REFERENCES
      ------------------------------------------------------------------------ */

export interface DocsWorkflowRef extends BaseRef {
  steps?: string[];
}

export interface DocsActionRef extends BaseRef {
  intent?: string;
}

export interface DocsApiRef extends Omit<BaseRef, 'title'> {
  title?: string;
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  route: RoutePath;
  version?: string;
}

export interface DocsErrorRef {
  code: DocsId;
  title: string;
  mitigation: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface DocsTroubleshootingRef {
  id: DocsId;
  title: string;
  summary?: string;
  symptom: string;
  resolution: string;
}

/* ------------------------------------------------------------------------
      MAIN MANIFEST
      ------------------------------------------------------------------------ */

export interface DocsManifest {
  id: DocsId;
  title: string;
  module: string;
  owner: string;

  releaseState: DocsReleaseState;

  summary: string;

  routes: RoutePath[];
  permissions: PermissionKey[];

  workflows: DocsWorkflowRef[];
  actions: DocsActionRef[];
  apis: DocsApiRef[];
  errors: DocsErrorRef[];
  troubleshooting: DocsTroubleshootingRef[];

  /**
   * Governance metadata
   */
  lastUpdated?: string;
  version?: string;
}

/* ------------------------------------------------------------------------
      RUNTIME VALIDATION (CRITICAL UPGRADE)
      ------------------------------------------------------------------------ */

function assertNonEmpty(value: unknown, field: string): void {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    throw new Error(`[DocsManifest] "${field}" must not be empty`);
  }
}

function assertUniqueIds(items: { id: string }[], field: string): void {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`[DocsManifest] Duplicate id "${item.id}" in "${field}"`);
    }
    seen.add(item.id);
  }
}

function assertUniqueErrorCodes(items: DocsErrorRef[]): void {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.code)) {
      throw new Error(`[DocsManifest] Duplicate error code "${item.code}"`);
    }
    seen.add(item.code);
  }
}

/* ------------------------------------------------------------------------
      MAIN FACTORY — GUARDED ENTRYPOINT
      ------------------------------------------------------------------------ */

export function defineDocsManifest(manifest: DocsManifest): DocsManifest {
  // ---- Required fields
  assertNonEmpty(manifest.id, 'id');
  assertNonEmpty(manifest.title, 'title');
  assertNonEmpty(manifest.module, 'module');
  assertNonEmpty(manifest.owner, 'owner');

  // ---- Arrays must exist
  assertNonEmpty(manifest.routes, 'routes');
  if (!Array.isArray(manifest.permissions)) {
    throw new Error('[DocsManifest] "permissions" must be an array');
  }

  // ---- Enforce uniqueness
  assertUniqueIds(manifest.workflows, 'workflows');
  assertUniqueIds(manifest.actions, 'actions');
  assertUniqueIds(manifest.apis, 'apis');
  assertUniqueErrorCodes(manifest.errors);

  return manifest;
}
