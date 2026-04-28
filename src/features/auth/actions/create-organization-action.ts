'use server';

import { z } from 'zod';

import { auth } from '@/shared/lib/auth';

import { createOrganizationForUser } from '../services/create-organization-service';

const inputSchema = z.object({
  organizationName: z.string().trim().min(2).max(255),
  organizationSlug: z.string().trim().min(1).max(100),
});

export type CreateOrganizationActionResult = { ok: true; slug: string } | { ok: false; error: string };

export async function createOrganizationAction(raw: unknown): Promise<CreateOrganizationActionResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: 'You must be signed in to create an organization.' };
  }

  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Please provide a valid organization name and URL slug.' };
  }

  return createOrganizationForUser({
    userId: session.user.id,
    email: session.user.email,
    userDisplayName: session.user.name,
    organizationName: parsed.data.organizationName,
    organizationSlug: parsed.data.organizationSlug,
  });
}
