"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { authClient } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const newPassword = form.get("newPassword") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError("Invalid or missing reset token");
      router.push("/auth/signin");
      return;
    }

    const { data, error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(`${error.code}: ${error.message}`);
      return;
    }

    showToast.success(<>Password reset successful!</>);
    router.push("/auth/signin");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className={cn("flex flex-col gap-6")}>
        <Card className="w-[400px]">
          <CardContent>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your new password below
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  required
                  placeholder="••••••••"
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
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Reset Password
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/auth/signin")}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
