import { signOut } from 'next-auth/react';

export async function performClientSignOut(callbackUrl = '/') {
  const result = await signOut({
    redirect: false,
    callbackUrl,
  });

  const target = new URL(result?.url ?? callbackUrl, window.location.origin);
  window.location.href = `${target.pathname}${target.search}${target.hash}`;
}
