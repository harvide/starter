import { config } from '@repo/config';
import { notFound } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!config.admin.enabled) {
    return notFound();
  }

  return <>{children}</>;
}
