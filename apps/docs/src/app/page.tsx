import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import '@repo/ui/globals.css';
import { CheckCircle, Feather, GitMerge, BookOpen, Shield, Zap } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
    <Card className="text-left">
        <CardHeader className="flex flex-row items-center gap-4">
            {icon}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function IndexPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Header */}
            <header className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Image
                        src="https://www.harvide.com/logo/small-dark-white.svg"
                        alt="Harvide Logo"
                        width={32}
                        height={32}
                        priority
                        className="dark:brightness-[0.2] dark:grayscale"
                    />
                    <span className="text-xl font-bold tracking-tight">@harvide/starter</span>
                </div>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="https://github.com/harvide/starter">GitHub</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/docs">Documentation</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="text-center py-20 sm:py-32">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter mb-4">
                            Build Your Next App Faster Than Ever
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground mb-8">
                            An opinionated starter kit with everything you need to build a modern web application. Authentication, UI components, and best practices included.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild className="gap-2">
                                <Link href="/docs/getting-started">
                                    <Zap className="w-5 h-5" />
                                    Get Started
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="gap-2">
                                <a href="https://github.com/harvide/starter" target="_blank" rel="noopener noreferrer">
                                    <GitMerge className="w-5 h-5" />
                                    View on GitHub
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 sm:py-32 bg-secondary/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Powerful Features Out of the Box</h2>
                            <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
                                Save weeks of development time with a fully-featured starter kit.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Shield className="w-8 h-8 text-primary" />}
                                title="Authentication"
                                description="Secure, pre-configured authentication flows for email, password, and social providers."
                            />
                            <FeatureCard
                                icon={<Feather className="w-8 h-8 text-primary" />}
                                title="UI Components"
                                description="A rich set of customizable and accessible UI components built with Radix and Tailwind CSS."
                            />
                            <FeatureCard
                                icon={<BookOpen className="w-8 h-8 text-primary" />}
                                title="Best Practices"
                                description="Leverage a well-structured codebase with best practices for scalability and maintenance."
                            />
                            <FeatureCard
                                icon={<Zap className="w-8 h-8 text-primary" />}
                                title="Type-Safe"
                                description="End-to-end type safety with TypeScript, ensuring a robust and error-free developer experience."
                            />
                            <FeatureCard
                                icon={<GitMerge className="w-8 h-8 text-primary" />}
                                title="Monorepo Ready"
                                description="Organized as a Turborepo monorepo, making it easy to manage shared packages and applications."
                            />
                            <FeatureCard
                                icon={<CheckCircle className="w-8 h-8 text-primary" />}
                                title="Ready to Deploy"
                                description="Deploy your application to your favorite hosting provider with minimal configuration."
                            />
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 sm:py-32">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Loved by Developers</h2>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="italic">"This starter kit is a game-changer. I was able to launch my MVP in a weekend."</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <Image src="https://avatars.githubusercontent.com/u/1?v=4" alt="User" width={40} height={40} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold">Developer Dave</p>
                                            <p className="text-sm text-muted-foreground">Indie Hacker</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="italic">"The documentation is clear and the codebase is a pleasure to work with. Highly recommended!"</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <Image src="https://avatars.githubusercontent.com/u/2?v=4" alt="User" width={40} height={40} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold">Startup Sarah</p>
                                            <p className="text-sm text-muted-foreground">CTO, TechCorp</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="italic">"I've tried many starter kits, but this one is by far the most complete and well-thought-out."</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <Image src="https://avatars.githubusercontent.com/u/3?v=4" alt="User" width={40} height={40} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold">Engineer Emily</p>
                                            <p className="text-sm text-muted-foreground">Software Engineer</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 sm:py-32 bg-secondary/50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to Start Building?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            Clone the repository and start your next project in minutes.
                        </p>
                        <Button size="lg" asChild className="gap-2">
                            <a href="https://github.com/harvide/starter" target="_blank" rel="noopener noreferrer">
                                <GitMerge className="w-5 h-5" />
                                Clone on GitHub
                            </a>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Harvide. All rights reserved.</p>
            </footer>
        </div>
    );
}
