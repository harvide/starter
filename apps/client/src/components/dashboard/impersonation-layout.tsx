'use client';

import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/components/button";

const POSITION: "top" | "bottom" = "top";

type ImpersonationLayoutProps = {
    visible: boolean;
};

export const ImpersonationLayout = ({ visible }: ImpersonationLayoutProps) => {
    if (!visible) return null;

    const stopImpersonation = async () => {
        await authClient.admin.stopImpersonating();
        window.location.reload();
    };

    return (
        <div
            className={`fixed inset-x-0 ${POSITION === "top" ? "top-0" : "bottom-0"
                } z-50 bg-foreground hover:text-background text-gray-300 flex items-center justify-between px-6 py-3 opacity-25 hover:opacity-100 transition-opacity duration-300 shadow-xl`}
        >
            <span className="text-sm">
                You are currently impersonating another user.
            </span>
            <Button variant="secondary" onClick={stopImpersonation} className="cursor-pointer rounded-xs">
                Stop Impersonation
            </Button>
        </div>
    );
};
