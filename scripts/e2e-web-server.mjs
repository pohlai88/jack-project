import { spawn } from 'node:child_process';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with ${signal ?? code}`));
    });
  });
}

await run('node', ['scripts/with-env-config.mjs', 'tsx', 'scripts/seed-demo.ts']);

const server = spawn(
  'node',
  ['scripts/with-env-config.mjs', 'next', 'dev', '--hostname', 'localhost', '--port', process.env.E2E_PORT ?? '3000'],
  {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
    stdio: 'inherit',
    env: {
      ...process.env,
      AUTH_URL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
      NEXT_PUBLIC_APP_URL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    },
  },
);

function stop() {
  if (!server.killed) server.kill();
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

server.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
