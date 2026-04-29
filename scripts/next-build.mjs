import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

import { loadManagedEnvConfig } from './env-config.mjs';

function formatDuration(milliseconds) {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  }

  const totalSeconds = milliseconds / 1000;

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }

  const roundedSeconds = Math.round(totalSeconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = (roundedSeconds % 60).toString().padStart(2, '0');

  return `${minutes}m ${seconds}s`;
}

loadManagedEnvConfig();

const buildStartedAt = performance.now();
const cliArgs = process.argv.slice(2);
const nextBuildArgs = [...cliArgs];
const profilingEnabled = process.env.NEXT_BUILD_CPU_PROFILE === '1' || cliArgs.includes('--experimental-cpu-prof');
const debugPrerenderEnabled = process.env.NEXT_BUILD_DEBUG_PRERENDER === '1' || cliArgs.includes('--debug-prerender');

if (profilingEnabled && !nextBuildArgs.includes('--experimental-cpu-prof')) {
  nextBuildArgs.push('--experimental-cpu-prof');
}

if (debugPrerenderEnabled && !nextBuildArgs.includes('--debug-prerender')) {
  nextBuildArgs.push('--debug-prerender');
}

if (profilingEnabled) {
  console.log('[build] CPU profiling enabled (Next.js will write profiles to .next/cpu-profiles/)');
}

if (debugPrerenderEnabled) {
  console.log('[build] prerender debug output enabled (--debug-prerender)');
}

const result = spawnSync('pnpm', ['exec', 'next', 'build', ...nextBuildArgs], {
  env: {
    ...process.env,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION ?? 'true',
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

const duration = formatDuration(performance.now() - buildStartedAt);
const exitCode = result.status ?? 1;
const outcome = exitCode === 0 ? 'completed' : 'failed';
const signalSuffix = result.signal ? ` (${result.signal})` : '';

if (result.error) {
  console.error(`[build] failed to start next build: ${result.error.message}`);
}

console.log(`[build] next build ${outcome} in ${duration}${signalSuffix}`);

process.exit(exitCode);
