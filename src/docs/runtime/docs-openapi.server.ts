import 'server-only';

import { createOpenAPI } from 'fumadocs-openapi/server';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const OPENAPI_SCHEMA_DOCUMENT = 'src/docs/openapi/afenda-public.json' as const;
const OPENAPI_SCHEMA_ABSOLUTE_PATH = join(process.cwd(), 'src', 'docs', 'openapi', 'afenda-public.json');

assertOpenApiSchemaExists();

export const openapi = createOpenAPI({
  input: [OPENAPI_SCHEMA_DOCUMENT],
});

function assertOpenApiSchemaExists(): void {
  if (existsSync(OPENAPI_SCHEMA_ABSOLUTE_PATH)) return;

  throw new Error(
    [
      '[docs:openapi] Missing OpenAPI schema file.',
      `Expected at: ${OPENAPI_SCHEMA_ABSOLUTE_PATH}`,
      'Ensure the schema is generated or committed before build.',
    ].join(' '),
  );
}
