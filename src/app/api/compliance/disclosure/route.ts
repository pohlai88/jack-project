import { NextResponse } from 'next/server';

import { generateComplianceSnapshot } from '@/app/[locale]/(marketing)/_content/compliance-footer';

/**
 * GET /api/compliance/disclosure — public machine-readable disclosure snapshot
 * (identity, ASEAN posture, canonical policy routes, semantic status classes).
 */
export async function GET() {
  const body = generateComplianceSnapshot();
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
