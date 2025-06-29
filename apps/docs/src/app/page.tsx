import { Button } from "@repo/ui/components/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@repo/ui/components/tooltip";
import Image from "next/image";
import '@repo/ui/globals.css';

export default function IndexPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-4 flex flex-col items-center justify-start text-center gap-8">
                {/* Hero Section */}
                <div className="w-full max-w-3xl space-y-4">
                    <Image
                        src="https://www.harvide.com/logo/small-dark-white.svg"
                        alt="Harvide Logo"
                        width={80}
                        height={80}
                        priority
                        className="mx-auto mb-8 dark:brightness-[0.2] dark:grayscale p-4 rounded-md border border-border select-none"
                    />
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                        @harvide/starter
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-extralight leading-relaxed">
                        Never handle flows manually again. Kickstart your next project with pre-configured authentication,
                        UI components, and best practices baked in.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="gap-2"
                    >
                        <a
                            href="https://github.com/harvide/starter"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            GitHub
                        </a>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="gap-2"
                    >
                        <a
                            href="https://starter.harvide.com/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            Documentation
                        </a>
                    </Button>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="gap-2"
                                disabled
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                Pro
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Coming soon ✨</TooltipContent>
                    </Tooltip>
                </div>
            </main>
        </div>
    )
}