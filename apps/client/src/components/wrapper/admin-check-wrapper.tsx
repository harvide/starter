"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { checkAdminsExist } from "@/components/auth/admin-signup-form/flows";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";

export function AdminCheckWrapper() {
    useEffect(() => {
        async function run() {
            const res = await checkAdminsExist();
            if (res?.error || res.exists) return;

            if (window.location.pathname === "/admin/signin") {
                return;
            }

            setTimeout(() => {
                toast.warning(<>No Admin Account Found</>, {
                    description: (
                        <>Please create the first admin account at <Button asChild variant="link" size="sm" className="p-0 m-0 gap-0 h-auto font-normal"><Link href="/admin/signin">/admin/signin</Link></Button></>
                    )
                });
            }, 100);
        }

        run();
    }, []);

    return null;
}