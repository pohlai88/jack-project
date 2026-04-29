import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'server-only': path.resolve(__dirname, './tests/support/server-only.ts'),
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
      '@scripts-lib/tolgee-normalize-core': path.resolve(__dirname, './scripts/lib/tolgee-normalize-core.mjs'),
    },
  },
  test: {
    coverage: {
      exclude: ['**/__mocks__/**', '**/node_modules/**', '**/*.d.ts'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'clover', 'lcov'],
      reportsDirectory: './.artifacts/reports/coverage',
      thresholds: {
        branches: 6,
        functions: 7,
        lines: 12,
        statements: 12,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'scripts/**/*.{test,spec}.{ts,tsx}'],
    pool: 'threads',
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.tsx'],
    testTimeout: 30000,
  },
});
