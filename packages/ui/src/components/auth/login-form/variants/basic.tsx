'use client';

import { authClient } from '@repo/auth/client';
import { config } from '@repo/config';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@repo/ui/components/input-otp';
import { Label } from '@repo/ui/components/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import { showToast } from '@repo/ui/lib/toast';
import { cn } from '@repo/ui/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { oauthIconsMap } from '../../oauth-icons';
import * as flows from '../flows';
import type { LoginFormProps } from '../types';

type Tab = 'email' | 'phone';
type Step =
  | 'login'
  | 'email-link-sent'
  | 'enter-otp-code'
  | 'prompt-email'
  | 'reset-password-link-sent'
  | 'email-not-verified';

interface SubmittedValue {
  value: string;
  type: 'email' | 'phone';
}

const IMAGE_URL = 'https://www.harvide.com/logo/small-dark-white.svg';

export function BasicLoginForm({
  className,
  callbackUrl = '/app',
  forceEmailAndPasswordOnly = false,
  header = <>Welcome back</>,
  subtitle = (
    <>
      Login to your <b>{config.branding.name}</b> account
    </>
  ),
  ...props
}: LoginFormProps) {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('email');
  const [step, setStep] = useState<Step>('login');
  const [submitted, setSubmitted] = useState<SubmittedValue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const FORCE_EMAIL_PASSWORD_ONLY = forceEmailAndPasswordOnly === true;

  const PHONE_AUTH_ENABLED =
    !FORCE_EMAIL_PASSWORD_ONLY && config.auth.phone.enabled;
  const PHONE_OTP_ENABLED =
    !FORCE_EMAIL_PASSWORD_ONLY && config.auth.phone.otp.enabled;
  const EMAIL_AUTH_ENABLED =
    FORCE_EMAIL_PASSWORD_ONLY || config.auth.emailAndPassword.enabled;
  const EMAIL_OTP_ENABLED =
    !FORCE_EMAIL_PASSWORD_ONLY && config.auth.emailAndPassword.otp.enabled;
  const SOCIAL_PROVIDERS = FORCE_EMAIL_PASSWORD_ONLY
    ? []
    : Object.entries(config.auth.socialProviders ?? {}).filter(
        ([, provider]) => provider.enabled
      );
  const SHOW_FORGOT_PASSWORD =
    !FORCE_EMAIL_PASSWORD_ONLY &&
    config.auth.emailAndPassword.sendResetPassword;
  const SHOW_SIGNUP_LINK = !(
    FORCE_EMAIL_PASSWORD_ONLY || config.auth.emailAndPassword.disableSignUp
  );
  const SHOW_TOS = !FORCE_EMAIL_PASSWORD_ONLY;

  function buildFlowProps(): flows.LoginFlowProps {
    return {
      callbackUrl,
      onError: (err) => {
        const errorCode = err.code;
        if (errorCode === 'EMAIL_NOT_VERIFIED') {
          setStep('email-not-verified');
        } else {
          setError(err.message || 'An unexpected error occurred.');
        }
      },
      onSuccess: () => router.push(callbackUrl),
      onOtpRequired: (value, type) => {
        setSubmitted({ value, type });
        setStep('enter-otp-code');
      },
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string | null;
    const phone = data.get('phone') as string | null;
    const password = data.get('password') as string | null;

    if (EMAIL_OTP_ENABLED && email) {
      await flows.handleEmailOtpRequest(email, buildFlowProps());
      setIsLoading(false);
      return;
    }

    if (PHONE_OTP_ENABLED && phone) {
      await flows.handlePhoneOtpRequest(phone, buildFlowProps());
      setIsLoading(false);
      return;
    }

    if (email && password) {
      setSubmitted({ value: email, type: 'email' });
      await flows.handleEmailPasswordLogin(email, password, buildFlowProps());
      setIsLoading(false);
      return;
    }

    if (phone && password) {
      setSubmitted({ value: phone, type: 'phone' });
      await flows.handlePhonePasswordLogin(phone, password, buildFlowProps());
      setIsLoading(false);
      return;
    }

    setError('Please provide a valid email or phone number.');
    setIsLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    if (!submitted) {
      setError('No submitted value found. Please try again.');
      setIsLoading(false);
      return;
    }
    const code = new FormData(e.currentTarget).get('code') as string;
    await flows.handleOtpVerification(
      code,
      submitted.value,
      submitted.type,
      buildFlowProps()
    );
    setIsLoading(false);
  }

  async function handleOAuth(provider: string) {
    setIsLoading(true);
    await flows.handleOAuthSignIn(provider, buildFlowProps());
    setIsLoading(false);
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = new FormData(e.currentTarget).get('email') as string;
    if (!email) {
      setStep('prompt-email');
      setIsLoading(false);
      return;
    }

    const ok = await flows.handleResetPasswordRequest(email, buildFlowProps());
    if (ok) {
      setSubmitted({ value: email, type: 'email' });
      setStep('reset-password-link-sent');
    }
    setIsLoading(false);
  }

  const showPasswordField =
    (tab === 'email' && EMAIL_AUTH_ENABLED && !EMAIL_OTP_ENABLED) ||
    (tab === 'phone' && PHONE_AUTH_ENABLED && !PHONE_OTP_ENABLED);

  const CredentialsSwitch =
    EMAIL_AUTH_ENABLED && (PHONE_AUTH_ENABLED || PHONE_OTP_ENABLED) ? (
      <Tabs
        defaultValue="email"
        onValueChange={(v) => {
          setError(null);
          setTab(v as Tab);
          setStep('login');
        }}
        value={tab}
      >
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder={config.preferences.placeholders.email}
              required
              type="email"
            />
          </div>
        </TabsContent>
        <TabsContent value="phone">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder={config.preferences.placeholders.phone}
              required
              type="tel"
            />
          </div>
        </TabsContent>
      </Tabs>
    ) : EMAIL_AUTH_ENABLED ? (
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder={config.preferences.placeholders.email}
          required
          type="email"
        />
      </div>
    ) : PHONE_AUTH_ENABLED || PHONE_OTP_ENABLED ? (
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          placeholder={config.preferences.placeholders.phone}
          required
          type="tel"
        />
      </div>
    ) : null;

  const animation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn('flex flex-col gap-6', className)}
      initial={{ opacity: 0 }}
      {...props}
    >
      <Card className="h-full overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <AnimatePresence mode="wait">
            {step === 'login' && (
              <motion.form
                animate={animation.animate}
                className="p-6 md:p-8"
                exit={animation.exit}
                initial={animation.initial}
                key="login"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="font-bold text-2xl">{header}</h1>
                    <p className="text-balance text-muted-foreground text-sm">
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
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                            onClick={() => setStep('prompt-email')}
                            type="button"
                          >
                            Forgot your password?
                          </button>
                        )}
                      </div>
                      <Input
                        id="password"
                        name="password"
                        placeholder={config.preferences.placeholders.password}
                        required
                        type="password"
                      />
                    </div>
                  )}

                  <Button className="w-full" disabled={isLoading} type="submit">
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                  {error && (
                    <p className="-mt-4 text-red-700 text-xs tracking-tighter">
                      {error}
                    </p>
                  )}

                  {SOCIAL_PROVIDERS.length > 0 && (
                    <>
                      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {SOCIAL_PROVIDERS.map(([provider]) => {
                          const Icon = oauthIconsMap[provider];
                          return (
                            <Button
                              className="w-full cursor-pointer"
                              disabled={isLoading}
                              key={provider}
                              onClick={() => handleOAuth(provider)}
                              type="button"
                              variant="outline"
                            >
                              {Icon ? (
                                <Icon className="h-5 w-5" />
                              ) : (
                                <span className="text-sm capitalize">
                                  {provider}
                                </span>
                              )}
                              <span className="sr-only">
                                Login with {provider}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {SHOW_SIGNUP_LINK && (
                    <div className="text-center text-sm">
                      Don't have an account?{' '}
                      <Link
                        className="underline underline-offset-4"
                        href="/auth/signup"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </motion.form>
            )}

            {step === 'email-not-verified' && (
              <motion.div
                animate={animation.animate}
                className="flex flex-col items-center p-6 text-center md:p-8"
                exit={animation.exit}
                initial={animation.initial}
                key="email-not-verified"
              >
                <h2 className="font-semibold text-xl">Email not verified</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Your email <b>{submitted?.value}</b> is not verified. Please
                  check your inbox for a verification link.
                </p>
                <Button
                  className="mt-4 w-full"
                  disabled={resendCooldown > 0}
                  onClick={async () => {
                    if (submitted?.value) {
                      const data = await authClient.sendVerificationEmail({
                        email: submitted.value,
                        callbackURL: callbackUrl,
                      });
                      if (data.error) {
                        setError(
                          data.error.message ||
                            'Failed to resend verification email.'
                        );
                      } else {
                        showToast.success(
                          <>Email verification link sent to {submitted.value}</>
                        );
                        setResendCooldown(60);
                      }
                    }
                  }}
                  variant="outline"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend verification email'}
                </Button>
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    if (submitted?.value) {
                      const domain = submitted.value.split('@')[1];
                      if (domain) {
                        const mailServices: { [key: string]: string } = {
                          'gmail.com': 'https://mail.google.com',
                          'outlook.com': 'https://outlook.live.com',
                          'yahoo.com': 'https://mail.yahoo.com',
                          'protonmail.com': 'https://mail.proton.me',
                        };
                        const mailUrl =
                          mailServices[domain] || `https://${domain}`;
                        window.open(mailUrl, '_blank');
                      }
                    }
                  }}
                >
                  Open Mailbox
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  className="mt-4 w-full"
                  onClick={() => setStep('login')}
                  variant="link"
                >
                  Back to login
                </Button>
                {error && (
                  <p className="-mt-4 text-red-700 text-xs tracking-tighter">
                    {error}
                  </p>
                )}
              </motion.div>
            )}

            {step === 'email-link-sent' && (
              <motion.div
                animate={animation.animate}
                className="p-6 text-center md:p-8"
                exit={animation.exit}
                initial={animation.initial}
                key="email-link-sent"
              >
                <h2 className="font-semibold text-xl">Check your inbox</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  We've sent a login link to <b>{submitted?.value}</b>.
                </p>
                {error && (
                  <p className="-mt-4 text-red-700 text-xs tracking-tighter">
                    {error}
                  </p>
                )}
              </motion.div>
            )}

            {step === 'reset-password-link-sent' && (
              <motion.div
                animate={animation.animate}
                className="p-6 text-center md:p-8"
                exit={animation.exit}
                initial={animation.initial}
                key="reset-password-link-sent"
              >
                <h2 className="font-semibold text-xl">Check your inbox</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  We've sent a password reset link to <b>{submitted?.value}</b>.
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  If you don't see it, check your spam folder.
                </p>
                <Button className="mt-4" onClick={() => setStep('login')}>
                  Back to login
                </Button>
                {error && (
                  <p className="-mt-4 text-red-700 text-xs tracking-tighter">
                    {error}
                  </p>
                )}
              </motion.div>
            )}

            {step === 'enter-otp-code' && (
              <motion.form
                animate={animation.animate}
                className="flex flex-col gap-4 p-6 md:p-8"
                exit={animation.exit}
                initial={animation.initial}
                key="enter-otp-code"
                onSubmit={handleVerifyOtp}
              >
                <Label htmlFor="code">Enter the code</Label>
                <InputOTP id="code" maxLength={6} name="code">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button className="mt-4" disabled={isLoading} type="submit">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify
                </Button>
                {error && (
                  <p className="-mt-4 text-red-700 text-xs tracking-tighter">
                    {error}
                  </p>
                )}
              </motion.form>
            )}

            {step === 'prompt-email' && (
              <motion.form
                animate={animation.animate}
                className="space-y-4 p-6 md:p-8"
                exit={animation.exit}
                initial={animation.initial}
                key="prompt-email"
                onSubmit={handleResetPassword}
              >
                <h2 className="font-semibold text-xl">Reset password</h2>
                <div className="grid gap-2">
                  <Label htmlFor="email-prompt">Email</Label>
                  <Input
                    id="email-prompt"
                    name="email"
                    placeholder={config.preferences.placeholders.email}
                    required
                    type="email"
                  />
                </div>
                <Button className="w-full" disabled={isLoading} type="submit">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send reset link
                </Button>
                {error && (
                  <p className="-mt-4 text-red-700 text-xs tracking-tighter">
                    {error}
                  </p>
                )}
                <Button
                  className="w-full"
                  onClick={() => setStep('login')}
                  type="button"
                  variant="outline"
                >
                  Back to login
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div
            animate={{ opacity: 1 }}
            className="relative mr-2 hidden rounded-md border border-border bg-muted md:block"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="image"
          >
            <img
              alt="Image"
              className="absolute inset-0 h-full w-full rounded-md object-cover dark:brightness-[0.2] dark:grayscale"
              height={400}
              src={IMAGE_URL}
              width={400}
            />
          </motion.div>
        </CardContent>
      </Card>

      {SHOW_TOS && (
        <div className="text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{' '}
          <Link href="/legal/terms-of-service">Terms of Service</Link> and{' '}
          <Link href="/legal/privacy-policy">Privacy Policy</Link>.
        </div>
      )}
    </motion.div>
  );
}
