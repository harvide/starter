import { Metadata } from "next";
import { config } from "@repo/config";

import { getSignupFormVariant } from "@/components/auth/signup-form";

export const metadata: Metadata = {
    title: `Sign up - ${config.branding.name}`,
    description: config.branding.description,
};

export default function SignupPage() {
    const BasicSignupForm = getSignupFormVariant(config.ui.signupForm);
    if (!BasicSignupForm) {
        throw new Error(`Signup form variant "${config.ui.signupForm}" not found.`);
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <BasicSignupForm />
            </div>
        </div>
    );
}
