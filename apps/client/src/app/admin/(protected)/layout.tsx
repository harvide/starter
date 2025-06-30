import { config } from '@repo/config';
import { notFound, unauthorized } from 'next/navigation';
import { useAdminUser } from '@/hooks/use-admin-user';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!config.admin.enabled) {
    return notFound();
  }

  const result = await useAdminUser();
  if (result.error === 'unauthorized') {
    return unauthorized();
  }

  const user = result.user;

  if (!user) {
    return unauthorized();
  }

  return <>{children}</>;
}
