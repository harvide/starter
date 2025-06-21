"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";
import { config } from "@repo/config";
import { createAdminUser } from "../flows";
import { AlertTriangle } from "lucide-react";
import { showToast } from "@/lib/toast";

export function BasicSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;

    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < config.auth.emailAndPassword.minPasswordLength) {
      setError(`Password must be at least ${config.auth.emailAndPassword.minPasswordLength} characters`);
      return;
    }

    const result = await createAdminUser(email, password, firstName, lastName);

    if (!result.success) {
      setError(result.error ?? "Unknown error");
      return;
    }

    showToast.success(<>Nice to meet you, {firstName}!</>);
    window.location.reload();
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden h-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="mb-2">
              <h2 className="text-2xl font-bold mb-4">Create Admin Account</h2>
            </div>
            <div className="mb-4 flex items-start gap-3 rounded-md border border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <strong>No admins found!</strong> You must create the first admin account to access the system.
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

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

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  minLength={config.auth.emailAndPassword.minPasswordLength}
                  maxLength={config.auth.emailAndPassword.maxPasswordLength}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  minLength={config.auth.emailAndPassword.minPasswordLength}
                  maxLength={config.auth.emailAndPassword.maxPasswordLength}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Create Account
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

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
    </div>
  );
}
