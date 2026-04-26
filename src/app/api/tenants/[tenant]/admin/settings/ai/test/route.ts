import { NextResponse } from 'next/server';
import { z } from 'zod';

import { type ConnectionTestResult, consumeConnectionTestRateLimit, testAIConnection } from '@/features/admin';
import { auth } from '@/shared/lib/auth';
import { logger } from '@/shared/lib/logger';
import { hasPermission } from '@/shared/lib/permissions';
import { getTenantBySlug } from '@/shared/lib/tenant';

const aiConnectionTestSchema = z.object({
  provider: z.enum(['openai', 'anthropic']),
  apiKey: z.string().min(1),
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

  const rateLimitKey = `${tenantSlug}:${session.user.id}:admin-settings-ai-test`;
  if (!consumeConnectionTestRateLimit(rateLimitKey)) {
    const result: ConnectionTestResult = {
      ok: false,
      message: 'Too many connection test attempts. Please wait and try again.',
      code: 'UNKNOWN',
    };
    return NextResponse.json(result, { status: 429 });
  }

  try {
    const payload = aiConnectionTestSchema.parse(await request.json());
    const result = await testAIConnection(payload);

    logger.info(
      {
        endpoint: 'admin-settings-ai-test',
        tenantSlug,
        userId: session.user.id,
        provider: payload.provider,
        ok: result.ok,
        code: result.code,
        durationMs: result.durationMs,
      },
      'Completed admin settings AI connection test',
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const result: ConnectionTestResult = {
        ok: false,
        message: 'Provider and API key are required to test the AI connection.',
        code: 'UNKNOWN',
      };
      return NextResponse.json(result, { status: 400 });
    }

    logger.error(
      {
        endpoint: 'admin-settings-ai-test',
        tenantSlug,
        userId: session.user.id,
      },
      'Failed to run admin settings AI connection test',
    );

    const result: ConnectionTestResult = {
      ok: false,
      message: 'Unable to run the AI connection test right now.',
      code: 'UNKNOWN',
    };
    return NextResponse.json(result, { status: 500 });
  }
}
