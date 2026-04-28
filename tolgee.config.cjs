/**
 * Tolgee CLI — cosmiconfig entry (`tolgee.config.cjs`).
 * Secrets: use `TOLGEE_API_KEY` env only (never commit keys into this file).
 *
 * @see https://docs.tolgee.io/tolgee-cli/project-configuration
 */

const projectIdRaw = process.env.TOLGEE_PROJECT_ID;
const projectId =
  projectIdRaw !== undefined && String(projectIdRaw).trim() !== ''
    ? Number.parseInt(String(projectIdRaw).trim(), 10)
    : undefined;

module.exports = {
  $schema: 'https://docs.tolgee.io/cli-schema.json',
  ...(Number.isFinite(projectId) ? { projectId } : {}),
  /** Tolgee Cloud default is https://app.tolgee.io — set env only for self-hosted. */
  ...(process.env.TOLGEE_API_URL?.trim() ? { apiUrl: process.env.TOLGEE_API_URL.trim() } : {}),
  format: process.env.TOLGEE_CLI_FORMAT?.trim() || 'JSON_ICU',
  pull: {
    path: 'src/i18n/catalogs/tolgee-staging',
  },
  push: {
    files: [
      {
        path: 'architecture/governance/evidence/i18n/tolgee-spike-sample-canonical.json',
        language: 'en',
      },
    ],
  },
};
