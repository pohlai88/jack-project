import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { POST } from './route';

describe('POST /api/marketing/live-demo', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'afenda-live-demo-'));
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(tempDir, { recursive: true, force: true });
  });

  it('returns 400 for invalid payloads', async () => {
    const response = await POST(
      new Request('http://localhost/api/marketing/live-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', agreedToTerms: false }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: 'Enter a valid work email and accept the live memo terms to continue.',
    });
  });

  it('writes a live demo registration artifact and returns success', async () => {
    const response = await POST(
      new Request('http://localhost/api/marketing/live-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ops@example.com', agreedToTerms: true }),
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      message: 'Registration queued. We will contact ops@example.com when the next live memo window opens.',
    });

    const artifact = await readFile(path.join(tempDir, '.artifacts', 'marketing-live-demo-requests.ndjson'), 'utf8');
    expect(artifact).toContain('"email":"ops@example.com"');
    expect(artifact).toContain('"source":"marketing-live-demo-dialog"');
  });
});
