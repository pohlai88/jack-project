import { redirect } from 'next/navigation';

interface OnboardingCvPageProps {
  params: Promise<{ tenant: string }>;
}

/**
 * Compatibility route for auth/onboarding flows that currently hand off to the
 * profile settings experience after invite acceptance or first-org creation.
 */
export default async function OnboardingCvPage({ params }: OnboardingCvPageProps) {
  const { tenant } = await params;

  redirect(`/t/${tenant}/profile/settings?onboarding=1`);
}
