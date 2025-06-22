import React from 'react';
import { UserTable } from "@/components/admin/dashboard/users/user-table";
import { AppSidebar } from '@/components/admin/app-sidebar';
import { SiteHeader } from '@/components/admin/site-header';
import { SidebarProvider, SidebarInset } from '@repo/ui/components/sidebar';
import { useAdminUser } from '@/hooks/use-admin-user';
import { unauthorized } from 'next/navigation';

export async function Page() {
  const result = await useAdminUser();
  if (result.error === "unauthorized") return unauthorized();

  const user = result.user;

  if (!user) return unauthorized();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={{
        email: user.email,
        name: user.name,
        avatar: user.avatar as string | undefined,
      }} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
              <UserTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
