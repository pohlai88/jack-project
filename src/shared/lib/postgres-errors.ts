/**
 * Read Postgres driver error fields from Drizzle/node-pg error chains.
 */

function* walkErrorChain(error: unknown): Generator<object, void, unknown> {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    yield current as object;
    current = (current as { cause?: unknown }).cause;
  }
}

export function getPostgresErrorCode(error: unknown): string | undefined {
  for (const obj of walkErrorChain(error)) {
    const code = (obj as { code?: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return undefined;
}

/** Constraint or unique index name from Postgres (node-pg uses `constraint`). */
export function getPostgresConstraintName(error: unknown): string | undefined {
  for (const obj of walkErrorChain(error)) {
    const o = obj as { constraint?: unknown; constraint_name?: unknown };
    if (typeof o.constraint === 'string') return o.constraint;
    if (typeof o.constraint_name === 'string') return o.constraint_name;
  }
  return undefined;
}

/** Postgres `unique_violation` (SQLSTATE 23505). */
export function isPostgresUniqueViolation(error: unknown): boolean {
  return getPostgresErrorCode(error) === '23505';
}
