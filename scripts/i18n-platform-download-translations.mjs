import { runCrowdinCommand } from './lib/i18n-catalog-core.mjs';

process.exit(runCrowdinCommand({ command: 'download', extraArgs: ['translations'] }));
