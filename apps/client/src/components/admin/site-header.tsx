import { config } from '@repo/config';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { SidebarTrigger } from '@repo/ui/components/sidebar';

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <h1 className="font-medium text-base">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          {config.admin.dashboard.shortcuts.map((shortcut, i) => {
            const Icon = shortcut.icon;
            const isUrl = typeof Icon === 'string';
            const isIcon = Icon !== undefined;

            return (
              <Button
                asChild
                className="hidden sm:flex"
                key={shortcut.label + i}
                size="sm"
                variant="ghost"
              >
                <a
                  className="flex items-center gap-1 dark:text-foreground"
                  href={shortcut.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {isIcon ? (
                    isUrl ? (
                      <img
                        alt={shortcut.label}
                        className="size-4 object-contain"
                        src={Icon}
                      />
                    ) : (
                      <Icon className="size-4" />
                    )
                  ) : (
                    <span className="font-medium text-sm">
                      {shortcut.label}
                    </span>
                  )}

                  {/* SR fallback for screen readers */}
                  {isIcon && <span className="sr-only">{shortcut.label}</span>}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
