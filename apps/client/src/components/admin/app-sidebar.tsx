'use client';
import { config } from '@repo/config';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar';
import {
  IconDashboard,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { NavMain } from '@/components/admin/nav-main';
import { NavSecondary } from '@/components/admin/nav-secondary';
import { NavUser } from '@/components/admin/nav-user';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: IconUsers,
    }
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
};

type AppSidebarProps = {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin/dashboard">
                <Image
                  alt={config.branding.name}
                  height={20}
                  src={config.branding.logo.icon}
                  width={20}
                />
                <span className="font-semibold text-base">
                  {config.branding.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
