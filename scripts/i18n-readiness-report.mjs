import { writeI18nReadinessArtifacts } from './lib/i18n-readiness-core.mjs';

function parseMode(argv) {
  const modeArg = argv.find((arg) => arg.startsWith('--mode='));
  if (!modeArg) {
    return 'warn';
  }

  const mode = modeArg.slice('--mode='.length);
  if (mode !== 'warn' && mode !== 'enforce') {
    throw new Error(`Unsupported i18n readiness mode: ${mode}`);
  }

  return mode;
}

try {
  const mode = parseMode(process.argv.slice(2));
  const evaluation = writeI18nReadinessArtifacts({ root: process.cwd(), mode });

  console.log(`i18n readiness report generated (${mode} mode).`);
  console.log(`- Markdown artifact: ${evaluation.artifactPaths.markdown}`);
  console.log(`- JSON artifact: ${evaluation.artifactPaths.json}`);
  console.log(`- Markdown SHA-256: ${evaluation.markdownHash}`);
  console.log(
    `- Derived verdicts: ${evaluation.records.map((record) => `${record.locale}=${record.activationVerdict}`).join(', ')}`,
  );

  if (!evaluation.snapshotHashMatches) {
    console.warn(
      '- Warning: committed snapshot source_artifact_hash does not match the generated markdown artifact hash.',
    );
  }

  if (evaluation.warnings.length > 0) {
    console.warn('- Readiness warnings:');
    for (const warning of evaluation.warnings) {
      console.warn(`  - [${warning.code}] ${warning.message}`);
    }
  } else {
    console.log('- Readiness warnings: none');
  }

  if (mode === 'enforce' && evaluation.exitCode !== 0) {
    console.error('- Enforcement findings:');
    for (const finding of evaluation.enforcementFindings) {
      console.error(`  - ${finding}`);
    }
  }

  process.exit(evaluation.exitCode);
} catch (error) {
  console.error(`i18n readiness report failed: ${error.message}`);
  process.exit(1);
}
