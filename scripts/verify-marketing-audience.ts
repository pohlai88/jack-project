/**
 * Validates marketing landing audience equilibrium:
 * - every audience appears in ≥2 sections
 * - every audience appears in ≥1 explorer
 * - every section lists ≥1 audience
 * - every explorer lists ≥1 audience
 * Registry keys match `MARKETING_SECTIONS` and `ExplorerId` exactly.
 */

import { EXPLORER_IDS } from '../src/app/[locale]/(marketing)/_content/explorers';
import {
  AUDIENCES,
  EXPLORER_AUDIENCE_MAP,
  MARKETING_SECTIONS,
  SECTION_AUDIENCE_MAP,
} from '../src/app/[locale]/(marketing)/_content/marketing-audience.contract';

function main() {
  const errors: string[] = [];

  const sectionKeys = new Set(Object.keys(SECTION_AUDIENCE_MAP));
  const expectedSections = new Set(MARKETING_SECTIONS as readonly string[]);
  for (const id of MARKETING_SECTIONS) {
    if (!sectionKeys.has(id)) errors.push(`Missing SECTION_AUDIENCE_MAP entry for section "${id}".`);
  }
  for (const id of sectionKeys) {
    if (!expectedSections.has(id))
      errors.push(`Unexpected SECTION_AUDIENCE_MAP key "${id}" (not in MARKETING_SECTIONS).`);
  }

  const explorerKeys = new Set(Object.keys(EXPLORER_AUDIENCE_MAP));
  const expectedExplorers = new Set(EXPLORER_IDS as readonly string[]);
  for (const id of EXPLORER_IDS) {
    if (!explorerKeys.has(id)) errors.push(`Missing EXPLORER_AUDIENCE_MAP entry for explorer "${id}".`);
  }
  for (const id of explorerKeys) {
    if (!expectedExplorers.has(id)) errors.push(`Unexpected EXPLORER_AUDIENCE_MAP key "${id}" (not an ExplorerId).`);
  }

  for (const section of MARKETING_SECTIONS) {
    const list = SECTION_AUDIENCE_MAP[section];
    if (!list?.length) errors.push(`Section "${section}" must list at least one audience.`);
  }

  for (const explorer of EXPLORER_IDS) {
    const list = EXPLORER_AUDIENCE_MAP[explorer];
    if (!list?.length) errors.push(`Explorer "${explorer}" must list at least one audience.`);
  }

  for (const audience of AUDIENCES) {
    let sectionCount = 0;
    for (const section of MARKETING_SECTIONS) {
      if ((SECTION_AUDIENCE_MAP[section] as readonly string[]).includes(audience)) sectionCount++;
    }
    if (sectionCount < 2) {
      errors.push(`Audience "${audience}" appears in fewer than 2 sections (found ${sectionCount}).`);
    }

    let explorerCount = 0;
    for (const explorer of EXPLORER_IDS) {
      if ((EXPLORER_AUDIENCE_MAP[explorer] as readonly string[]).includes(audience)) explorerCount++;
    }
    if (explorerCount < 1) {
      errors.push(`Audience "${audience}" appears in zero explorers.`);
    }
  }

  if (errors.length) {
    console.error('verify-marketing-audience failed:\n' + errors.map((e) => `  • ${e}`).join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log(
    [
      'verify-marketing-audience: PASS',
      `  sections=${MARKETING_SECTIONS.length} explorers=${EXPLORER_IDS.length} audiences=${AUDIENCES.length}`,
    ].join('\n'),
  );
}

main();
