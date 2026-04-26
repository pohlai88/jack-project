import { NextResponse } from 'next/server';
import { z } from 'zod';

import { type ConnectionTestResult, consumeConnectionTestRateLimit, testStorageConnection } from '@/features/admin';
import { auth } from '@/shared/lib/auth';
import { logger } from '@/shared/lib/logger';
import { hasPermission } from '@/shared/lib/permissions';
import { getTenantBySlug } from '@/shared/lib/tenant';

const storageConnectionTestSchema = z.object({
  provider: z.enum(['s3', 'minio', 'r2']),
  endpoint: z.string().optional(),
  publicEndpoint: z.string().optional(),
  accessKey: z.string().min(1),
  secretKey: z.string().min(1),
  bucket: z.string().min(1),
  region: z.string().optional(),
  forcePathStyle: z.boolean().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ tenant: string }> }) {
  const { tenant: tenantSlug } = await context.params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allowed = await hasPermission(tenantSlug, 'admin:settings');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const rateLimitKey = `${tenantSlug}:${session.user.id}:admin-settings-storage-test`;
  if (!consumeConnectionTestRateLimit(rateLimitKey)) {
    const result: ConnectionTestResult = {
      ok: false,
      message: 'Too many connection test attempts. Please wait and try again.',
      code: 'UNKNOWN',
    };
    return NextResponse.json(result, { status: 429 });
  }

  try {
    const payload = storageConnectionTestSchema.parse(await request.json());
    const result = await testStorageConnection(payload);

    logger.info(
      {
        endpoint: 'admin-settings-storage-test',
        tenantSlug,
        userId: session.user.id,
        provider: payload.provider,
        ok: result.ok,
        code: result.code,
        durationMs: result.durationMs,
      },
      'Completed admin settings storage connection test',
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const result: ConnectionTestResult = {
        ok: false,
        message: 'Provider, bucket, access key, and secret key are required to test storage.',
        code: 'UNKNOWN',
      };
      return NextResponse.json(result, { status: 400 });
    }

    logger.error(
      {
        endpoint: 'admin-settings-storage-test',
        tenantSlug,
        userId: session.user.id,
      },
      'Failed to run admin settings storage connection test',
    );

    const result: ConnectionTestResult = {
      ok: false,
      message: 'Unable to run the storage connection test right now.',
      code: 'UNKNOWN',
    };
    return NextResponse.json(result, { status: 500 });
  }
}
