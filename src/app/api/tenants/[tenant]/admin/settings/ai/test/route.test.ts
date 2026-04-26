const {
  authMock,
  consumeConnectionTestRateLimitMock,
  getTenantBySlugMock,
  hasPermissionMock,
  loggerErrorMock,
  loggerInfoMock,
  testAIConnectionMock,
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  consumeConnectionTestRateLimitMock: vi.fn(),
  getTenantBySlugMock: vi.fn(),
  hasPermissionMock: vi.fn(),
  loggerErrorMock: vi.fn(),
  loggerInfoMock: vi.fn(),
  testAIConnectionMock: vi.fn(),
}));

vi.mock('@/shared/lib/auth', () => ({
  auth: authMock,
}));

vi.mock('@/shared/lib/permissions', () => ({
  hasPermission: hasPermissionMock,
}));

vi.mock('@/shared/lib/tenant', () => ({
  getTenantBySlug: getTenantBySlugMock,
}));

vi.mock('@/shared/lib/logger', () => ({
  logger: {
    error: loggerErrorMock,
    info: loggerInfoMock,
  },
}));

vi.mock('@/features/admin', () => ({
  consumeConnectionTestRateLimit: consumeConnectionTestRateLimitMock,
  testAIConnection: testAIConnectionMock,
}));

import { POST } from './route';

describe('POST /api/tenants/[tenant]/admin/settings/ai/test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ user: { id: 'user-123' } });
    hasPermissionMock.mockResolvedValue(true);
    getTenantBySlugMock.mockResolvedValue({ id: 'tenant-123', slug: 'test-tenant' });
    consumeConnectionTestRateLimitMock.mockReturnValue(true);
    testAIConnectionMock.mockResolvedValue({
      ok: true,
      message: 'OpenAI connection verified successfully.',
      durationMs: 42,
    });
  });

  it('returns 401 when unauthenticated', async () => {
    authMock.mockResolvedValue(null);

    const response = await POST(new Request('http://localhost', { method: 'POST' }), {
      params: Promise.resolve({ tenant: 'test-tenant' }),
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('returns 403 without admin:settings permission', async () => {
    hasPermissionMock.mockResolvedValue(false);

    const response = await POST(new Request('http://localhost', { method: 'POST' }), {
      params: Promise.resolve({ tenant: 'test-tenant' }),
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Forbidden' });
  });

  it('returns 404 when the tenant is missing', async () => {
    getTenantBySlugMock.mockResolvedValue(null);

    const response = await POST(new Request('http://localhost', { method: 'POST' }), {
      params: Promise.resolve({ tenant: 'missing-tenant' }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'Tenant not found' });
  });

  it('returns 429 when the rate limit is exceeded', async () => {
    consumeConnectionTestRateLimitMock.mockReturnValue(false);

    const response = await POST(new Request('http://localhost', { method: 'POST' }), {
      params: Promise.resolve({ tenant: 'test-tenant' }),
    });

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: 'Too many connection test attempts. Please wait and try again.',
      code: 'UNKNOWN',
    });
  });

  it('returns 400 for invalid payloads', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ provider: 'openai' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: Promise.resolve({ tenant: 'test-tenant' }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: 'Provider and API key are required to test the AI connection.',
      code: 'UNKNOWN',
    });
  });

  it('returns the service result for valid requests', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ provider: 'openai', apiKey: 'sk-test' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: Promise.resolve({ tenant: 'test-tenant' }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      message: 'OpenAI connection verified successfully.',
      durationMs: 42,
    });
    expect(testAIConnectionMock).toHaveBeenCalledWith({ provider: 'openai', apiKey: 'sk-test' });
    expect(loggerInfoMock).toHaveBeenCalled();
  });
});
