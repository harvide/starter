'use client';
import { authClient, type User } from '@repo/auth/client';
import { showToast } from '@repo/ui/lib/toast';
import { useRouter } from 'next/navigation';
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@repo/ui/components/alert-dialog';
import { useState } from 'react';

interface ImpersonateDialogProps {
    user: User;
    onAction?: () => void;
}

export function ImpersonateDialog({ user, onAction }: ImpersonateDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleImpersonate = async (userId: string) => {
        if (!userId) return;

        try {
            setLoading(true);
            await authClient.admin.impersonateUser({ userId });
            showToast.success(
                <>You are now impersonating {user?.name}.</>
                , {
                    description: <>You will be redirected to the dashboard in 5 seconds.</>
                });
            setTimeout(() => {
                onAction?.();
                router.push('/dashboard');
            }, 5000);
        } catch (err) {
            console.error('Error impersonating user:', err);
            showToast.error(
                <>Error impersonating user: {(err as Error).message}</>
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>You are about to impersonate a user</AlertDialogTitle>
                <AlertDialogDescription>
                    This will create a new session for you with the same permissions as the user.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-2">
                <p className="text-sm text-destructive">
                    Warning: You will be signed out of your current session and all actions will be performed as {user.name}.
                </p>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => handleImpersonate(user.id)}
                    disabled={loading}
                >
                    {loading ? 'Impersonating...' : 'Impersonate User'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}
