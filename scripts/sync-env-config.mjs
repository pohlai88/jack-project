import { getEnvConfigPath, getNextEnvLocalPath, loadManagedEnvConfig } from './env-config.mjs';

const envConfig = loadManagedEnvConfig();

if (!envConfig) {
  console.error(`Missing ${getEnvConfigPath()}. Create it from env.config.example first.`);
  process.exit(1);
}

console.log(`Synced ${getNextEnvLocalPath()} from ${envConfig.path}`);
