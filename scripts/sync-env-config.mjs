import {
  collectTenantCookieEnvWarnings,
  getEnvConfigPath,
  getEnvProductionPath,
  getNextEnvLocalPath,
  loadManagedEnvConfig,
} from './env-config.mjs';
import { printLocalProductionReport } from './production-env-report.mjs';

const envConfig = loadManagedEnvConfig();

if (!envConfig) {
  console.error(`Missing ${getEnvConfigPath()}. Create it from env.config.example first.`);
  process.exit(1);
}

for (const line of collectTenantCookieEnvWarnings(envConfig.values)) {
  console.warn(`[env:sync] ${line}`);
}

console.log(`Synced ${getNextEnvLocalPath()} and ${getEnvProductionPath()} from ${envConfig.path}`);
printLocalProductionReport(envConfig.values);
