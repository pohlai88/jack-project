/**
 * Print local + Vercel Production env readiness without writing files or pushing.
 * Usage: pnpm vercel:env:report
 */

import { readEnvConfig } from './env-config.mjs';
import { printLocalProductionReport, printVercelProductionReport } from './production-env-report.mjs';

const envConfig = readEnvConfig();

if (!envConfig) {
  console.error('Missing env.config. Copy from env.config.example first.');
  process.exit(1);
}

printLocalProductionReport(envConfig.values, { prefix: '[env:report]' });
printVercelProductionReport(envConfig.values, { prefix: '[env:report]' });
