import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar';
import { unauthorized } from 'next/navigation';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { ChartAreaInteractive } from '@/components/admin/chart-area-interactive';
import { DataTable } from '@/components/admin/data-table';
import { SectionCards } from '@/components/admin/section-cards';
import { SiteHeader } from '@/components/admin/site-header';
import { useAdminUser } from '@/hooks/use-admin-user';

const data = [
  {
    id: 1,
    header: 'Cover page',
    type: 'Cover page',
    status: 'In Process',
    target: '18',
    limit: '5',
    reviewer: 'Eddie Lake',
  },
];

export default async function Page() {
  const result = await useAdminUser();
  if (result.error === 'unauthorized') {
    return unauthorized();
  }

  const user = result.user;

  if (!user) {
    return unauthorized();
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={{
          email: user.email,
          name: user.name,
          avatar: user.image as string | undefined,
        }}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
