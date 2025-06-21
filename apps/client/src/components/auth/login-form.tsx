"use client";

import React from "react";
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
import { authClient } from "@/lib/auth";

import { showToast } from "@/lib/toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/input-otp";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();

    const [currentTab, setCurrentTab] = useState<"email" | "phone">("email");
    const [step, setStep] = useState<"login" | "email-link-sent" | "enter-otp-code" | "prompt-email" | "reset-password" | "reset-password-link-sent">("login");
    const [submittedValue, setSubmittedValue] = useState<{
        value: string;
        type: "email" | "phone";
    } | null>(null);

    const [error, setError] = useState<string | null>(null);

    // check if otp plugins are enabled
    const isPhoneSigninEnabled = config.auth.phone.enabled
    const isPhoneOTPPluginEnabled = config.auth.phone.otp?.enabled
    const isEmailOTPPluginEnabled = config.auth.emailAndPassword.otp.enabled

    // main login function - this flow is handled after user clicks the login button
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = new FormData(e.currentTarget);

        const email = (form.get("email") as string);
        const phone = (form.get("phone") as string);
        const password = form.get("password") as string;

        let data;

        // OTP flow has priority
        if (isEmailOTPPluginEnabled && email) {
            // email otp flow
            setSubmittedValue({
                value: email,
                type: "email"
            });
            data = await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in"
            });
            if (data.error) {
                setError(`${data.error.code}: ${data.error.message}`);
                return;
            }
            setStep("enter-otp-code");
        } else if (isPhoneOTPPluginEnabled && phone) {
            // phone otp flow
            setSubmittedValue({
                value: phone,
                type: "phone"
            });
            data = await authClient.phoneNumber.sendOtp({
                phoneNumber: phone
            });
            if (data.error) {
                setError(`${data.error.code}: ${data.error.message}`);
                return;
            }
            setStep("enter-otp-code");
        } else if (email && password) {
            // email + password flow
            data = await authClient.signIn.email({
                email: email,
                password: password,
                rememberMe: true,
                callbackURL: '/app'
            })
            if (data.error) {
                setError(`${data.error.code}: ${data.error.message}`);
                return;
            }
            showToast.success("Login successful!");
        } else if (phone && password) {
            // phone + password flow
            data = await authClient.signIn.phoneNumber({
                phoneNumber: phone,
                password: password,
                rememberMe: true
            })
            if (data.error) {
                setError(`${data.error.code}: ${data.error.message}`);
                return;
            }
            showToast.success(<>Hi, {data.data.user.name}!</>, {
                description: <>Good to see you back!</>
            })
        } else {
            setError("Please provide a valid email or phone number.");
            throw new Error("Please provide a valid email or phone number.");
        }
    }

    async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get("code") as string;

        let error;

        if (!submittedValue) {
            setError("No submitted value found. Please try again.");
            throw new Error("No submitted value found. Please try again.");
        }

        if (submittedValue.type === "email") {
            const data = await authClient.signIn.emailOtp({
                email: submittedValue.value,
                otp: code,
            })

            if (data.error) {
                setError(`${data.error.code}: ${data.error.message}`);
                return;
            }

            showToast.success(<>Hi, {data.data.user.name}!</>, {
                description: <>Good to see you back!</>
            })
            router.push("/app");
        } else if (submittedValue.type === "phone") {
            const data = await authClient.phoneNumber.verify({
                phoneNumber: submittedValue.value,
                code: code
            })

            if (data.error) {
                setError(`${data.error.code}: ${data.error.message}`);
                return;
            }

            showToast.success(<>Hi, {data.data.user.name}!</>, {
                description: <>Good to see you back!</>
            })
            router.push("/app");
        } else {
            setError("Invalid submitted value type. Please try again.");
            throw new Error("Invalid submitted value type. Please try again.");
        }
    }

    async function handleOAuthSignIn(provider: string) {
        const data = await authClient.signIn.social({
            provider: "apple",
            callbackURL: '/app'
        })

        if (data.error) {
            setError(`${data.error.code}: ${data.error.message}`);
            return;
        }

        showToast.info("Redirecting to " + provider + "...");
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

        const { data, error } = await authClient.requestPasswordReset({
            email: email,
        });

        if (error) {
            setError(`${error.code}: ${error.message}`);
            return;
        }

        setSubmittedValue({
            value: email,
            type: "email"
        });
        setStep("reset-password-link-sent");
        showToast.info(<>
            A password reset link has been sent to <b>{email}</b>. Please check your inbox.
            If you don't see it, check your spam folder.
        </>);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden h-full">
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
                                    config.auth.emailAndPassword.enabled && (isPhoneSigninEnabled || isPhoneOTPPluginEnabled) ? (
                                        <>
                                            <Tabs defaultValue="email" value={currentTab} onValueChange={(value) => setCurrentTab(value as "phone" | "email")}>
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
                                    ) : isPhoneSigninEnabled || isPhoneOTPPluginEnabled ? (
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
                                    (currentTab === "email" ? (config.auth.emailAndPassword.enabled && !config.auth.emailAndPassword.otp.enabled) :
                                        (config.auth.phone.enabled && !config.auth.phone.otp?.enabled)
                                    ) && (
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
                                We've sent a login link to <b>{submittedValue?.value}</b>.
                            </p>
                        </div>
                    )}

                    {step === "reset-password-link-sent" && (
                        <div className="text-center p-6 md:p-8">
                            <h2 className="text-xl font-semibold">Check your inbox</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                We've sent a password reset link to <b>{submittedValue?.value}</b>.
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
