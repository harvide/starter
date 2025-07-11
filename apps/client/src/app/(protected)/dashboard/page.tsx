import { auth } from '@repo/auth';
import { Button } from '@repo/ui/components/button';
import { headers } from 'next/headers';
import Image from 'next/image';
import { unauthorized } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user) {
        unauthorized();
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
                {/* Hero Section */}
                <div className="w-full max-w-3xl space-y-4">
                    <div className="mx-auto mb-8 flex items-center justify-center gap-4">
                        <Image
                            alt="Harvide Logo"
                            className="select-none rounded-md border border-border p-4 dark:brightness-[0.2] dark:grayscale"
                            height={60}
                            priority
                            src="https://www.harvide.com/logo/small-dark-white.svg"
                            width={60}
                        />
                        <div className="text-left">
                            <p className="text-sm text-muted-foreground">Welcome back</p>
                            <h2 className="font-medium">{user?.email}</h2>
                        </div>
                    </div>
                    <h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">
                        Protected Dashboard
                    </h1>
                    <p className="mx-auto max-w-2xl font-extralight text-lg text-muted-foreground leading-relaxed">
                        This is your authenticated dashboard. Start building your protected routes
                        and components here. Any routes under (protected) require authentication.
                    </p>
                </div>

                {/* Quick Start Section */}
                <div className="w-full max-w-3xl space-y-6">
                    <h2 className="text-2xl font-medium">I just want to try @harvide/starter</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-card p-4 text-left">
                            <h3 className="font-medium mb-2">1. Add Components</h3>
                            <p className="text-sm text-muted-foreground">
                                Create new components in{' '}
                                <code className="rounded bg-muted px-1">src/components/dashboard</code>{' '}
                                and add them to this page.
                            </p>
                        </div>
                        <div className="rounded-lg border bg-card p-4 text-left">
                            <h3 className="font-medium mb-2">2. Access User Data</h3>
                            <p className="text-sm text-muted-foreground">
                                Use <code className="rounded bg-muted px-1">useAuthUser()</code>{' '}
                                hook to access the authenticated user&apos;s data.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button asChild className="gap-2" size="lg" variant="default">
                        <a
                            href="https://starter.harvide.com/docs/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                            Documentation
                        </a>
                    </Button>
                    <Button asChild className="gap-2" size="lg" variant="outline">
                        <a
                            href="https://x.com/madebyharvide"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                            @harvide
                        </a>
                    </Button>
                </div>
            </main>
        </div>
    );
}
