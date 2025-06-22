import { config } from "@repo/config"
import { Button } from "@repo/ui/components/button"
import { Separator } from "@repo/ui/components/separator"
import { SidebarTrigger } from "@repo/ui/components/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          {config.admin.dashboard.shortcuts.map((shortcut, i) => {
            const Icon = shortcut.icon;
            const isUrl = typeof Icon === "string";
            const isIcon = Icon !== undefined;

            return (
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="hidden sm:flex"
                key={shortcut.label + i}
              >
                <a
                  href={shortcut.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="dark:text-foreground flex items-center gap-1"
                >
                  {isIcon ? (
                    isUrl ? (
                      <img
                        src={Icon}
                        alt={shortcut.label}
                        className="size-4 object-contain"
                      />
                    ) : (
                      <Icon className="size-4" />
                    )
                  ) : (
                    <span className="text-sm font-medium">{shortcut.label}</span>
                  )}

                  {/* SR fallback for screen readers */}
                  {isIcon && (
                    <span className="sr-only">{shortcut.label}</span>
                  )}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  )
}
