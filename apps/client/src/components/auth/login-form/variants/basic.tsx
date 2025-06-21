"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/input-otp";
import { Label } from "@repo/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { cn } from "@repo/ui/lib/utils";
import { config } from "@repo/config";

import { oauthIconsMap } from "../../oauth-icons";
import * as flows from "../flows";
import { LoginFormProps } from "../types";

type Tab = "email" | "phone";
type Step =
  | "login"
  | "email-link-sent"
  | "enter-otp-code"
  | "prompt-email"
  | "reset-password-link-sent";

interface SubmittedValue {
  value: string;
  type: "email" | "phone";
}

export function BasicLoginForm({
  className,
  forceEmailAndPasswordOnly = false,
  header = <>Welcome back</>,
  subtitle = <>Login to your <b>{config.branding.name}</b> account</>,
  ...props
}: LoginFormProps) {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("email");
  const [step, setStep] = useState<Step>("login");
  const [submitted, setSubmitted] = useState<SubmittedValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const FORCE_EMAIL_PASSWORD_ONLY = forceEmailAndPasswordOnly === true;

  const PHONE_AUTH_ENABLED = !FORCE_EMAIL_PASSWORD_ONLY && config.auth.phone.enabled;
  const PHONE_OTP_ENABLED = !FORCE_EMAIL_PASSWORD_ONLY && config.auth.phone.otp.enabled;
  const EMAIL_AUTH_ENABLED = FORCE_EMAIL_PASSWORD_ONLY || config.auth.emailAndPassword.enabled;
  const EMAIL_OTP_ENABLED = !FORCE_EMAIL_PASSWORD_ONLY && config.auth.emailAndPassword.otp.enabled;
  const SOCIAL_PROVIDERS = FORCE_EMAIL_PASSWORD_ONLY
    ? []
    : Object.entries(config.auth.socialProviders ?? {}).filter(
      ([, provider]) => provider.enabled,
    );
  const SHOW_FORGOT_PASSWORD = !FORCE_EMAIL_PASSWORD_ONLY && config.auth.emailAndPassword.sendResetPassword;
  const SHOW_SIGNUP_LINK = !FORCE_EMAIL_PASSWORD_ONLY && !config.auth.emailAndPassword.disableSignUp;
  const SHOW_TOS = !FORCE_EMAIL_PASSWORD_ONLY;

  function buildFlowProps(): flows.LoginFlowProps {
    return {
      onError: setError,
      onSuccess: () => router.push("/app"),
      onOtpRequired: (value, type) => {
        setSubmitted({ value, type });
        setStep("enter-otp-code");
      },
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string | null;
    const phone = data.get("phone") as string | null;
    const password = data.get("password") as string | null;

    if (EMAIL_OTP_ENABLED && email) {
      await flows.handleEmailOtpRequest(email, buildFlowProps());
      return;
    }

    if (PHONE_OTP_ENABLED && phone) {
      await flows.handlePhoneOtpRequest(phone, buildFlowProps());
      return;
    }

    if (email && password) {
      await flows.handleEmailPasswordLogin(email, password, buildFlowProps());
      return;
    }

    if (phone && password) {
      await flows.handlePhonePasswordLogin(phone, password, buildFlowProps());
      return;
    }

    setError("Please provide a valid email or phone number.");
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!submitted) {
      setError("No submitted value found. Please try again.");
      return;
    }
    const code = new FormData(e.currentTarget).get("code") as string;
    await flows.handleOtpVerification(
      code,
      submitted.value,
      submitted.type,
      buildFlowProps(),
    );
  }

  async function handleOAuth(provider: string) {
    await flows.handleOAuthSignIn(provider, buildFlowProps());
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const email = new FormData(e.currentTarget).get("email") as string;
    if (!email) {
      setStep("prompt-email");
      return;
    }

    const ok = await flows.handleResetPasswordRequest(email, buildFlowProps());
    if (ok) {
      setSubmitted({ value: email, type: "email" });
      setStep("reset-password-link-sent");
    }
  }

  const showPasswordField =
    (tab === "email" && EMAIL_AUTH_ENABLED && !EMAIL_OTP_ENABLED) ||
    (tab === "phone" && PHONE_AUTH_ENABLED && !PHONE_OTP_ENABLED);

  const CredentialsSwitch =
    EMAIL_AUTH_ENABLED && (PHONE_AUTH_ENABLED || PHONE_OTP_ENABLED) ? (
      <Tabs
        defaultValue="email"
        value={tab}
        onValueChange={(v) => setTab(v as Tab)}
      >
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
    ) : EMAIL_AUTH_ENABLED ? (
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
    ) : PHONE_AUTH_ENABLED || PHONE_OTP_ENABLED ? (
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
    ) : null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden h-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          {step === "login" && (
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{header}</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                </div>

                {CredentialsSwitch}

                {showPasswordField && (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      {SHOW_FORGOT_PASSWORD && (
                        <button
                          type="button"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                          onClick={() => setStep("prompt-email")}
                        >
                          Forgot your password?
                        </button>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Login
                </Button>
                {error && <p className="text-red-700 text-xs -mt-4 tracking-tighter">{error}</p>}

                {SOCIAL_PROVIDERS.length > 0 && (
                  <>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {SOCIAL_PROVIDERS.map(([provider]) => {
                        const Icon = oauthIconsMap[provider];
                        return (
                          <Button
                            type="button"
                            key={provider}
                            variant="outline"
                            className="w-full cursor-pointer"
                            onClick={() => handleOAuth(provider)}
                          >
                            {Icon ? (
                              <Icon className="w-5 h-5" />
                            ) : (
                              <span className="text-sm capitalize">
                                {provider}
                              </span>
                            )}
                            <span className="sr-only">Login with {provider}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}

                {SHOW_SIGNUP_LINK && (
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </form>
          )}

          {step === "email-link-sent" && (
            <div className="text-center p-6 md:p-8">
              <h2 className="text-xl font-semibold">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mt-2">
                We&apos;ve sent a login link to <b>{submitted?.value}</b>.
              </p>
              {error && <p className="text-red-700 text-xs -mt-4 tracking-tighter">{error}</p>}
            </div>
          )}

          {step === "reset-password-link-sent" && (
            <div className="text-center p-6 md:p-8">
              <h2 className="text-xl font-semibold">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mt-2">
                We&apos;ve sent a password reset link to <b>{submitted?.value}</b>.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                If you don&apos;t see it, check your spam folder.
              </p>
              <Button className="mt-4" onClick={() => setStep("login")}>
                Back to login
              </Button>
              {error && <p className="text-red-700 text-xs -mt-4 tracking-tighter">{error}</p>}
            </div>
          )}

          {step === "enter-otp-code" && (
            <form
              onSubmit={handleVerifyOtp}
              className="p-6 md:p-8 flex flex-col gap-4"
            >
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
              <Button type="submit" className="mt-4">
                Verify
              </Button>
              {error && <p className="text-red-700 text-xs -mt-4 tracking-tighter">{error}</p>}
            </form>
          )}

          {step === "prompt-email" && (
            <form
              onSubmit={handleResetPassword}
              className="p-6 md:p-8 space-y-4"
            >
              <h2 className="text-xl font-semibold">Reset password</h2>
              <div className="grid gap-2">
                <Label htmlFor="email-prompt">Email</Label>
                <Input id="email-prompt" type="email" name="email" required />
              </div>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
              {error && <p className="text-red-700 text-xs -mt-4 tracking-tighter">{error}</p>}
              <Button
                type="button"
                className="w-full"
                onClick={() => setStep("login")}
                variant="outline"
              >
                Back to login
              </Button>
            </form>
          )}

          <div className="relative hidden bg-muted border-border border rounded-md md:block mr-2">
            <img
              src="https://www.harvide.com/logo/small-dark-white.svg"
              alt="Image"
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale rounded-md"
            />
          </div>
        </CardContent>
      </Card>

      {
        SHOW_TOS && (
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <Link href="/legal/terms-of-service">Terms of Service</Link> and{" "}
            <Link href="/legal/privacy-policy">Privacy Policy</Link>.
          </div>
        )
      }
    </div>
  );
}
