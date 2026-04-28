import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const routingPath = join(dirname(fileURLToPath(import.meta.url)), '../routing.ts');

describe('routing.ts cookie surface', () => {
  it('does not import server-only env (ADR 0008)', () => {
    const src = readFileSync(routingPath, 'utf8');
    expect(src).not.toMatch('@/shared/lib/env');
    expect(src).not.toMatch('from "next/headers"');
    expect(src).not.toMatch("from 'next/headers'");
  });
});
