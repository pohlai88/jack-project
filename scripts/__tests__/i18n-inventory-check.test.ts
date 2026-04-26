import { afterEach, describe, expect, it } from 'vitest';

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

// @ts-expect-error script core is ESM without generated declarations.
import { runI18nInventoryCheck } from '../lib/i18n-inventory-check-core.mjs';

const tempRoots: string[] = [];

function toJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeFixtureFile(root: string, file: string, content: string) {
  const fullPath = join(root, file);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
}

function createFixture(overrides: Record<string, string> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'afenda-i18n-inventory-'));
  tempRoots.push(root);

  const baseFiles: Record<string, string> = {
    'src/i18n/messages/en.json': toJson({
      common: {
        save: 'Save',
        welcome: 'Welcome, {name}',
        mention: 'Connected as @{username}',
      },
    }),
    'src/i18n/messages/es.json': toJson({
      common: {
        save: 'Guardar',
        welcome: 'Bienvenido, {name}',
        mention: 'Conectado como @{username}',
      },
    }),
  };

  for (const [file, content] of Object.entries({ ...baseFiles, ...overrides })) {
    writeFixtureFile(root, file, content);
  }

  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('i18n inventory check core', () => {
  it('passes a structurally valid inventory even when draft text stays in English', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': toJson({
        common: {
          save: 'Save',
          welcome: 'Welcome, {name}',
          mention: 'Connected as @{username}',
        },
      }),
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual([]);
  });

  it('fails malformed JSON', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': '{"common":{"save":"Lưu"}}\n}\n',
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('src/i18n/messages/vi.json is not valid JSON')]),
    );
  });

  it('fails on missing keys', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': toJson({
        common: {
          save: 'Lưu',
          welcome: 'Chào mừng, {name}',
        },
      }),
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('is missing key "common.mention"')]),
    );
  });

  it('fails on extra keys', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': toJson({
        common: {
          save: 'Lưu',
          welcome: 'Chào mừng, {name}',
          mention: 'Đã kết nối với @{username}',
          extra: 'Thừa',
        },
      }),
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('has extra key "common.extra"')]),
    );
  });

  it('fails on empty string values', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': toJson({
        common: {
          save: '',
          welcome: 'Chào mừng, {name}',
          mention: 'Đã kết nối với @{username}',
        },
      }),
    });

    expect(runI18nInventoryCheck({ root }).errors).toContain(
      'src/i18n/messages/vi.json contains an empty string at key "common.save".',
    );
  });

  it('fails on ICU placeholder mismatch', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': toJson({
        common: {
          save: 'Lưu',
          welcome: 'Chào mừng, {fullName}',
          mention: 'Đã kết nối với @{username}',
        },
      }),
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'has placeholder mismatch at key "common.welcome": expected "name" but found "fullName"',
        ),
      ]),
    );
  });

  it('fails on inline handle mismatch', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json': toJson({
        common: {
          save: 'Lưu',
          welcome: 'Chào mừng, {name}',
          mention: 'Đã kết nối với @{handle}',
        },
      }),
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'has placeholder mismatch at key "common.mention": expected "username" but found "handle"',
        ),
      ]),
    );
  });

  it('fails on non-canonical formatting drift', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json':
        '{\n    "common": {\n        "save": "Lưu",\n        "welcome": "Chào mừng, {name}",\n        "mention": "Đã kết nối với @{username}"\n    }\n}\n',
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('does not match stable JSON formatting')]),
    );
  });

  it('fails on key order drift', () => {
    const root = createFixture({
      'src/i18n/messages/vi.json':
        '{\n  "common": {\n    "welcome": "Chào mừng, {name}",\n    "save": "Lưu",\n    "mention": "Đã kết nối với @{username}"\n  }\n}\n',
    });

    expect(runI18nInventoryCheck({ root }).errors).toEqual(
      expect.arrayContaining([expect.stringContaining('key order does not match')]),
    );
  });
});
