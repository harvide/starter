import { Metadata } from "next";
import { config } from "@repo/config";

import { getSignupFormVariant } from "@repo/ui/components/auth/signup-form";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import { ToastOnPageLoadWrapper } from "@/components/wrapper/toast-client-wrapper";

export const metadata: Metadata = {
    title: `Sign up`
};

export default function SignupPage() {
    const BasicSignupForm = getSignupFormVariant(config.ui.signupForm);
    if (!BasicSignupForm) {
        throw new Error(`Signup form variant "${config.ui.signupForm}" not found.`);
    }

    if (config.auth.emailAndPassword.disableSignUp) {
        return (
            <>
                <ToastOnPageLoadWrapper type="error" message={<>Signup is currently disabled.</>} data={{ description: <>Please contact support for assistance.</> }} />
                <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
                    <div className="w-full max-w-sm md:max-w-3xl">
                        <h1 className="text-2xl font-bold text-center">Signup Disabled</h1>
                        <p className="text-center mt-4">Signup is currently disabled. Please contact support for assistance.</p>
                    </div>
                    <div className="mt-6 flex flex-row items-center self-center">
                        <Link href="/auth/signin">
                            <Button variant="default" className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <BasicSignupForm />
            </div>
        </div>
    );
}
