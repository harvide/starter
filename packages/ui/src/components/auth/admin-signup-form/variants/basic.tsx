'use client';

import { config } from '@repo/config';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { showToast } from '@repo/ui/lib/toast';
import { cn } from '@repo/ui/lib/utils';
import { type HTMLMotionProps, motion } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createAdminUser } from '../flows';

type MotionDivProps = HTMLMotionProps<'div'> & {
  className?: string;
};

export function BasicSignupForm({ className, ...props }: MotionDivProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    const result = await createAdminUser(email, password, firstName, lastName);

    if (!result.success) {
      setError(result.error ?? 'Unknown error');
      setIsLoading(false);
      return;
    }

    showToast.success(<>Nice to meet you, {firstName}!</>);
    window.location.reload();
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
      <Card className="h-full overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <motion.form
            animate={animation.animate}
            className="p-6 md:p-8"
            exit={animation.exit}
            initial={animation.initial}
            key="admin-signup"
            onSubmit={handleSubmit}
          >
            <div className="mb-2">
              <h2 className="mb-4 font-bold text-2xl">Create Admin Account</h2>
            </div>
            <div className="mb-4 flex items-start gap-3 rounded-md border border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <strong>No admins found!</strong> You must create the first
                admin account to access the system.
              </div>
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

            <Button className="mt-6 w-full" disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>

            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}
          </motion.form>

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
              src="https://www.harvide.com/logo/small-dark-white.svg"
              width={400}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
