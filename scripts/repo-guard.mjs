import { runRepoGuard } from './lib/repo-guard-core.mjs';

const findings = runRepoGuard({ root: process.cwd() });

if (findings.length > 0) {
  console.error('Repo guard failed:\n');
  for (const finding of findings) {
    const location = finding.file ? ` ${finding.file}` : '';
    const detail = finding.detail ? ` (${finding.detail})` : '';
    console.error(`- ${finding.id} [${finding.severity}]${location}: ${finding.message}${detail}`);
  }
  process.exit(1);
}

console.log('Repo guard passed.');
