import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'architecture/doctrine/README.md',
  'architecture/doctrine/0001-documentation-authority.md',
  'architecture/doctrine/0002-feature-public-api-boundaries.md',
  'architecture/doctrine/0003-documentation-authority-and-promotion.md',
  'architecture/doctrine/0004-environment-script-command-contract.md',
  'architecture/doctrine/0005-database-migration-safety.md',
  'architecture/doctrine/0006-api-auth-tenant-boundaries.md',
  'architecture/doctrine/0007-ui-component-design-system-rules.md',
  'architecture/doctrine/0008-test-ci-artifact-hygiene.md',
  'architecture/adr/README.md',
  'architecture/adr/0001-adopt-doctrine-adr-atc.md',
  'architecture/adr/0002-strict-feature-public-apis-pragmatic-shared-subpaths.md',
  'architecture/adr/0003-governance-as-code-ci-authority.md',
  'architecture/atc/README.md',
  'architecture/atc/ATC-0001-documentation-authority.md',
  'architecture/atc/ATC-0002-feature-public-api-boundaries.md',
  'architecture/atc/ATC-0003-documentation-promotion.md',
  'architecture/atc/ATC-0004-environment-script-command-contract.md',
  'architecture/atc/ATC-0005-database-migration-safety.md',
  'architecture/atc/ATC-0006-api-auth-tenant-boundaries.md',
  'architecture/atc/ATC-0007-ui-component-design-system-rules.md',
  'architecture/atc/ATC-0008-test-ci-artifact-hygiene.md',
  'architecture/docs/README.md',
];

const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing required authority file: ${file}`);
  }
}

if (existsSync(join(root, 'architecture/docs/README.md'))) {
  const docsReadme = readFileSync(join(root, 'architecture/docs/README.md'), 'utf8');
  if (!/deprecated/i.test(docsReadme)) {
    errors.push('architecture/docs/README.md must clearly mark docs as deprecated.');
  }
}

const forbiddenClaims = [
  {
    file: 'README.md',
    patterns: [/single source of truth[^\n]*docs/i, /docs\/[^\n]*single source of truth/i],
  },
  {
    file: 'CONTRIBUTING.md',
    patterns: [/single source of truth[^\n]*docs/i, /authoritative project knowledge lives in\s+\*\*?`?docs/i],
  },
  {
    file: 'AGENTS.md',
    patterns: [/single source of truth[^\n]*docs/i, /authoritative project knowledge lives in\s+\*\*?`?docs/i],
  },
];

for (const { file, patterns } of forbiddenClaims) {
  const path = join(root, file);
  if (!existsSync(path)) continue;

  const content = readFileSync(path, 'utf8');
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      errors.push(`${file} contains a stale docs-as-authority claim: ${pattern}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Doctrine check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Doctrine check passed.');
