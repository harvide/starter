import { auth } from '@repo/auth';
import { Button } from '@repo/ui/components/button';
import { headers } from 'next/headers';
import { UserInfoCard } from '@/components/dashboard/user-info-card';
import { unauthorized } from 'next/navigation';
import { User } from '@repo/auth/client';
import Image from 'next/image';

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User | null;

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
                    <div className="flex min-h-screen flex-col">
                        <main className="container mx-auto flex flex-1 flex-col gap-8 px-4">
                            <div className="mx-auto w-full max-w-5xl space-y-8">
                                {/* User Info Card */}
                                <UserInfoCard user={user} />
                            </div>
                        </main>
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
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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
                                    d="M6 18L18 6M6 6l12 12"
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