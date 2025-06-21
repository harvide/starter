"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { checkAdminsExist } from "@/components/auth/admin-signup-form/flows";
import Link from "next/link";

export function AdminCheckWrapper() {
    useEffect(() => {
        async function run() {
            const res = await checkAdminsExist();
            if (res?.error || res.exists) return;

            setTimeout(() => {
                toast.warning(<>No Admin Account Found</>, {
                    description: (
                        <>Please create the first admin account at <Link href="/admin/signin" className="text-foreground">/admin/signin</Link></>
                    )
                });
            }, 100);
        }

        run();
    }, []);

    return null;
}