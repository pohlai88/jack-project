module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/with-env-config.mjs next start --hostname localhost --port 3101',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 120000,
      url: ['http://localhost:3101/en', 'http://localhost:3101/en/login', 'http://localhost:3101/en/docs'],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox',
        preset: 'desktop',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.artifacts/reports/lighthouse',
    },
  },
};
