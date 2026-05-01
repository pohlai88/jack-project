import { NextResponse } from 'next/server';
import { z } from 'zod';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const liveDemoRegistrationSchema = z.object({
  email: z.string().trim().email(),
  agreedToTerms: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const payload = liveDemoRegistrationSchema.parse(await request.json());
    const artifactsDir = path.join(process.cwd(), '.artifacts');
    const outputFile = path.join(artifactsDir, 'marketing-live-demo-requests.ndjson');

    await mkdir(artifactsDir, { recursive: true });
    await appendFile(
      outputFile,
      `${JSON.stringify({
        email: payload.email,
        agreedToTerms: true,
        source: 'marketing-live-demo-dialog',
        submittedAt: new Date().toISOString(),
      })}\n`,
      'utf8',
    );

    return NextResponse.json(
      {
        ok: true,
        message: `Registration queued. We will contact ${payload.email} when the next live memo window opens.`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Enter a valid work email and accept the live memo terms to continue.',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to register for the live demo right now.',
      },
      { status: 500 },
    );
  }
}
