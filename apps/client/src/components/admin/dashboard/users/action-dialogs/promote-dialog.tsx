'use client';
import { authClient, type User } from '@repo/auth/client';
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@repo/ui/components/alert-dialog';
import { useState } from 'react';
import { showToast } from '@repo/ui/lib/toast';

interface PromoteDialogProps {
    user: User;
    onAction?: () => void;
}

export function PromoteDialog({ user, onAction }: PromoteDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const isAdmin = user.role === 'admin';

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {isAdmin ? <>Demote to user?</> : <>Promote to admin?</>}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {isAdmin
                        ? <>Remove administrator privileges from {user.name}. They will no longer have access to the admin dashboard and administrative functions.</>
                        : <>Grant administrator privileges to {user.name}. They will have full access to the admin dashboard and all administrative functions.</>
                    }
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-2">
                {isAdmin && (
                    <p className="text-sm text-destructive">
                        Warning: This action will immediately revoke their admin access.
                    </p>
                )}
            </div>

            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={async () => {
                        try {
                            setIsProcessing(true);
                            await authClient.admin.setRole({
                                userId: user.id,
                                role: isAdmin ? 'user' : 'admin',
                            });
                            showToast.success(
                                isAdmin
                                    ? <>{user.name} demoted to user successfully</>
                                    : <>{user.name} promoted to administrator successfully</>
                            );
                            onAction?.();
                        } catch (err) {
                            showToast.error(
                                <>Error updating role: {(err as Error).message}</>
                            );
                        } finally {
                            setIsProcessing(false);
                        }
                    }}
                    disabled={isProcessing || !user}
                >
                    {isProcessing
                        ? <>Processing…</>
                        : isAdmin
                            ? <>Demote to User</>
                            : <>Promote to Admin</>
                    }
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}
