import { useAdminUser } from "@/hooks/use-admin-user";
import { auth } from "@repo/auth/index";
import { config } from "@repo/config";
import { headers } from "next/headers";
import { notFound, unauthorized } from "next/navigation";

export default async function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (!config.admin.enabled) {
        return notFound();
    }

    const result = await useAdminUser();
    if (result.error === "unauthorized") return unauthorized();

    const user = result.user;

    if (!user) return unauthorized();


    return <>{children}</>;
}
