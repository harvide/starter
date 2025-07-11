import { unauthorized } from 'next/navigation';
import { auth } from '@repo/auth';
import { headers } from 'next/headers';
import { ImpersonationLayout } from '@/components/dashboard/impersonation-layout';
import { Session } from '@repo/auth/client';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return unauthorized();
    }
    const user = session.user;
    if (!user) {
        return unauthorized();
    }

    return (
        <>
            <ImpersonationLayout visible={!!(session as Session).session.impersonatedBy} />
            {children}
        </>
    );
}
