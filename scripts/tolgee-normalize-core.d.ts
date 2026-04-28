/**
 * Ambient typings for [`./lib/tolgee-normalize-core.mjs`](./lib/tolgee-normalize-core.mjs).
 * Imports use path alias `@scripts-lib/tolgee-normalize-core` (see `tsconfig.json` paths).
 */

declare module '@scripts-lib/tolgee-normalize-core' {
  export function unwrapTolgeeLocaleWrapper(
    obj: unknown,
    forcedLocale?: string | null,
  ): { messages: unknown; detectedLocale: string | null };

  export function expandDotKeys(value: unknown): unknown;

  export function resolveCatalogLocale(
    tolgeeStem: string,
    tolgeeTagToCatalogLocale: Record<string, string>,
    activeLocales: readonly string[],
  ): { catalogLocale: string } | { skip: string };
}
