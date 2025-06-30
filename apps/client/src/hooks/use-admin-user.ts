import { auth } from '@repo/auth';
import { headers } from 'next/headers';

export async function useAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user?.role) {
    return { error: 'unauthorized' };
  }

  const roles = (user.role as string).replace(/[{}"]/g, '').split(',');
  if (!roles.includes('admin')) {
    return { error: 'unauthorized' };
  }

  return { user };
}
