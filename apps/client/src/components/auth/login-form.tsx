"use client";

import React, { useEffect } from "react";
import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/button"
import { Card, CardContent } from "@repo/ui/components/card"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

import { oauthIconsMap } from "./oauth-icons"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs"

import { useState } from "react";

import { useRouter } from "next/navigation";
import { config } from "@repo/config";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();

    const [step, setStep] = useState<"login" | "email-link-sent" | "enter-otp-code" | "prompt-email" | "reset-password" | "reset-password-link-sent">("login");
    const [submittedEmail, setSubmittedEmail] = useState<string>("");

    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        const email = (form.get("email") as string) || "";
        const phone = (form.get("phone") as string) || "";
        const password = form.get("password") as string;

        if (config.authorization.otp) {
            setSubmittedEmail(email || phone);
            let data;
            if (config.authorization.otp.email) {
                data = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
            } else if (config.authorization.otp.phone) {
                data = await supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser: false } });
            } else {
                throw new Error("OTP method is not configured correctly.");
            }
            if (data.error) {
                setError(data.error.message);
                return;
            }

            if (config.authorization.otp.method === "link") {
                setStep("email-link-sent");
                return;
            } else if (config.authorization.otp.method === "code") {
                setStep("enter-otp-code");
                return;
            } else {
                throw new Error("Invalid OTP method configured.");
            }

        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email, phone, password
            });
            if (error) throw error;
            router.push(config.authorization.oauth?.redirectUri || "/");
        }
    }


    async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get("code") as string;

        let error;

        if (config.authorization.otp?.email) {
            const { error: otpError } = await supabase.auth.verifyOtp({
                email: submittedEmail,
                token: code,
                type: "email"
            });

            if (otpError) {
                error = otpError;
            }
        } else if (config.authorization.otp?.phone) {
            const { error: otpError } = await supabase.auth.verifyOtp({
                phone: submittedEmail,
                token: code,
                type: "sms"
            });

            if (otpError) {
                error = otpError;
            }
        }

        if (error) {
            setError(error.message);
            return;
        }

        router.push(config.authorization?.oauth?.redirectUri || "/");
    }

    async function handleOAuthSignIn(provider: Provider) {
        const { error } = await supabase.auth.signInWithOAuth({ provider: provider });
        if (error) setError(error.message);
    }

    async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = new FormData(e.currentTarget);
        const email = form.get("email") as string;

        if (!email) {
            setStep("prompt-email");
            return;
        }

        const { error } = await supabase.auth
            .resetPasswordForEmail(email, {
                redirectTo: window.location.href
            })
        if (error) {
            setError(error.message);
            return;
        }

        setSubmittedEmail(email);
        setStep("reset-password-link-sent");
    }

    async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const newPassword = form.get("newPassword") as string;
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) {
            setError(error.message);
            return;
        }
        setStep("login");
        router.push(config.authorization?.oauth?.redirectUri || "/");
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    {step === "login" && (
                        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Welcome back</h1>
                                    <p className="text-balance text-sm text-muted-foreground">
                                        Login to your <b>{config.branding.name}</b> account
                                    </p>
                                </div>

                                {
                                    config.auth.emailAndPassword.enabled && config.plugins.some(plugin => plugin.id === 'phone-number') ? (
                                        <>
                                            <Tabs defaultValue="email">
                                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                                    <TabsTrigger value="email">Email</TabsTrigger>
                                                    <TabsTrigger value="phone">Phone</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="email">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            placeholder="starter@harvide.com"
                                                            required
                                                        />
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="phone">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="phone">Phone</Label>
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            name="phone"
                                                            placeholder="+1234567890"
                                                            required
                                                        />
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </>
                                    ) : config.auth.emailAndPassword.enabled ? (
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="example@example.com"
                                                required
                                            />
                                        </div>
                                    ) : config.plugins.some(plugin => plugin.id === 'phone-number') ? (
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                placeholder="+1234567890"
                                                required
                                            />
                                        </div>
                                    ) : null
                                }
                                {
                                    config.auth.emailAndPassword.enabled && (
                                        <>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">Password</Label>
                                                    {
                                                        config.auth.emailAndPassword.sendResetPassword && (
                                                            <a
                                                                href="#"
                                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                                                onClick={e => { e.preventDefault(); setStep("prompt-email") }}
                                                            >
                                                                Forgot your password?
                                                            </a>
                                                        )
                                                    }
                                                </div>
                                                <Input id="password" type="password" name="password" required placeholder="••••••••" />
                                            </div>
                                        </>
                                    )}
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                                {config.auth.socialProviders && Object.entries(config.auth.socialProviders)
                                    .filter(([, enabled]) => enabled).length > 0 && (
                                        <>
                                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                                    Or continue with
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                {Object.entries(config.auth.socialProviders)
                                                    .filter(([, enabled]) => enabled)
                                                    .map(([provider]) => {
                                                        const Icon = oauthIconsMap[provider];
                                                        if (!Icon) {
                                                            console.warn(`No icon found for provider: ${provider}`);
                                                            return null;
                                                        }

                                                        return (
                                                            <Button
                                                                type="button"
                                                                key={provider}
                                                                variant="outline"
                                                                className="w-full"
                                                                onClick={() => handleOAuthSignIn(provider)}
                                                            >
                                                                {Icon ? <Icon className="w-5 h-5" /> : <span className="text-sm capitalize">{provider}</span>}
                                                                <span className="sr-only">Login with {provider}</span>
                                                            </Button>
                                                        );
                                                    })}
                                            </div>
                                        </>
                                    )}
                                {
                                    !config.auth.emailAndPassword.disableSignUp && (
                                        <div className="text-center text-sm">
                                            Don&apos;t have an account?{" "}
                                            <Link href="/auth/signup" className="underline underline-offset-4">
                                                Sign up
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </form>
                    )}

                    {step === "email-link-sent" && (
                        <div className="text-center p-6 md:p-8">
                            <h2 className="text-xl font-semibold">Check your inbox</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                We've sent a login link to <b>{submittedEmail}</b>.
                            </p>
                        </div>
                    )}

                    {step === "reset-password-link-sent" && (
                        <div className="text-center p-6 md:p-8">
                            <h2 className="text-xl font-semibold">Check your inbox</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                We've sent a password reset link to <b>{submittedEmail}</b>.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                If you don't see it, check your spam folder.
                            </p>
                            <Button className="mt-4" onClick={() => setStep("login")}>Back to login</Button>
                        </div>
                    )}

                    {step === "enter-otp-code" && (
                        <form onSubmit={handleVerifyOtp} className="p-6 md:p-8 flex flex-col gap-4">
                            <Label htmlFor="code">Enter the code</Label>
                            <InputOTP maxLength={6} id="code" name="code">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button type="submit" className="mt-4">Verify</Button>
                        </form>
                    )}

                    {step === "prompt-email" && (
                        <form onSubmit={handleResetPassword} className="p-6 md:p-8 space-y-4">
                            <h2 className="text-xl font-semibold">Reset password</h2>
                            <div className="grid gap-2">
                                <Label htmlFor="email-prompt">Email</Label>
                                <Input id="email-prompt" type="email" name="email" required />
                            </div>
                            <Button type="submit" className="w-full">Send reset link</Button>
                            {error && <p className="text-red-600">{error}</p>}
                            <Button type="button" className="w-full" onClick={() => setStep("login")} variant="outline">Back to login</Button>
                        </form>
                    )}

                    {step === "reset-password" && (
                        <form onSubmit={handleChangePassword} className="p-6 md:p-8 space-y-4">
                            <h2 className="text-xl font-semibold">Choose new password</h2>
                            <Input type="hidden" name="email" value={submittedEmail} />
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">New password</Label>
                                <Input id="new-password" type="password" name="newPassword" required />
                            </div>
                            <Button type="submit" className="w-full">Reset password</Button>
                            {error && <p className="text-red-600">{error}</p>}
                        </form>
                    )}

                    <div className="relative hidden bg-muted border-border border rounded md:block mr-2">
                        <img
                            src="https://www.harvide.com/logo/small-dark-white.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale rounded"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
