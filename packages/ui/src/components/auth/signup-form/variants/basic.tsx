'use client';

import { config } from '@repo/config';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { showToast } from '@repo/ui/lib/toast';
import { cn } from '@repo/ui/lib/utils';
import { type HTMLMotionProps, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

import { oauthIconsMap } from '../../oauth-icons';
import {
  handleEmailPasswordSignup,
  handleOAuthSignup,
  type SignupFlowProps,
} from '../flows';

const _EMAIL_AUTH_ENABLED = config.auth.emailAndPassword.enabled;
const SIGNUP_ENABLED = !config.auth.emailAndPassword.disableSignUp;
const SOCIAL_PROVIDERS = Object.entries(
  config.auth.socialProviders ?? {}
).filter(([, provider]) => provider.enabled);

type MotionDivProps = HTMLMotionProps<'div'> & {
  className?: string;
};

export function BasicSignupForm({ className, ...props }: MotionDivProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function buildFlowProps(): SignupFlowProps {
    return {
      onError: setError,
      onSuccess: () => {
        if (config.auth.emailAndPassword.requireEmailVerification) {
          showToast.info('Please check your email to verify your account.');
        }
        router.push('/auth/signin');
      },
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;

    if (!(email && password && firstName && lastName)) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < config.auth.emailAndPassword.minPasswordLength) {
      setError(
        `Password must be at least ${config.auth.emailAndPassword.minPasswordLength} characters`
      );
      setIsLoading(false);
      return;
    }

    await handleEmailPasswordSignup(
      email,
      password,
      firstName,
      lastName,
      buildFlowProps()
    );
    setIsLoading(false);
  }

  async function handleOAuth(provider: string) {
    setIsLoading(true);
    await handleOAuthSignup(provider, buildFlowProps());
    setIsLoading(false);
  }

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
      {SIGNUP_ENABLED ? (
        <Card className="h-full overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <motion.form
              animate={animation.animate}
              className="p-6 md:p-8"
              exit={animation.exit}
              initial={animation.initial}
              key="signup"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="font-bold text-2xl">Create an account</h1>
                  <p className="text-balance text-muted-foreground text-sm">
                    Sign up for your <b>{config.branding.name}</b> account
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder={config.preferences.placeholders.firstName}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder={config.preferences.placeholders.lastName}
                        required
                      />
                    </div>
                  </div>

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

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      maxLength={config.auth.emailAndPassword.maxPasswordLength}
                      minLength={config.auth.emailAndPassword.minPasswordLength}
                      name="password"
                      placeholder={config.preferences.placeholders.password}
                      required
                      type="password"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      maxLength={config.auth.emailAndPassword.maxPasswordLength}
                      minLength={config.auth.emailAndPassword.minPasswordLength}
                      name="confirmPassword"
                      placeholder={config.preferences.placeholders.password}
                      required
                      type="password"
                    />
                  </div>
                </div>

                <Button className="w-full" disabled={isLoading} type="submit">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign up
                </Button>

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
                              Sign up with {provider}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    className="underline underline-offset-4"
                    href="/auth/signin"
                  >
                    Sign in
                  </Link>
                </div>

                {error && (
                  <p className="text-center text-red-500 text-sm">{error}</p>
                )}
              </div>
            </motion.form>

            <motion.div
              animate={{ opacity: 1 }}
              className="relative mr-2 hidden rounded-md border border-border bg-muted md:block"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="image"
            >
              <Image
                alt="Logo"
                className="absolute inset-0 h-full w-full rounded-md object-cover dark:brightness-[0.2] dark:grayscale"
                height={400}
                priority
                src="https://www.harvide.com/logo/small-dark-white.svg"
                width={400}
              />
            </motion.div>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-full overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-bold text-2xl">Sign up is disabled</h1>
              <p className="mt-2 text-balance text-muted-foreground text-sm">
                New user registration is currently disabled.
              </p>
              <Button asChild className="mt-4">
                <Link href="/auth/signin">Sign in instead</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By signing up, you agree to our{' '}
        <Link href="/legal/terms-of-service">Terms of Service</Link> and{' '}
        <Link href="/legal/privacy-policy">Privacy Policy</Link>.
      </div>
    </motion.div>
  );
}
