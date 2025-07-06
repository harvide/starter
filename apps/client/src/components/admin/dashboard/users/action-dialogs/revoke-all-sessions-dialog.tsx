import { authClient, User } from "@repo/auth/client";
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@repo/ui/components/alert-dialog";
import { showToast } from "@repo/ui/lib/toast";
import { useState } from "react";

type RevokeAllSessionsDialogProps = {
    user: User;
    onAction?: () => void;
}

export function RevokeAllSessionsDialog({ user, onAction }: RevokeAllSessionsDialogProps) {
    const [isRevokingAll, setIsRevokingAll] = useState(false);

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Revoke all sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will terminate all active sessions for {user.name}.
                    The user will need to log in again on all devices.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isRevokingAll}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    disabled={isRevokingAll}
                    onClick={async () => {
                        setIsRevokingAll(true);
                        try {
                            await authClient.admin.revokeUserSessions({
                                userId: user.id,
                            });
                            onAction?.();

                            showToast.success('All sessions revoked successfully');
                        } catch (err) {
                            setIsRevokingAll(false);
                            showToast.error(
                                <>Error revoking all sessions: {(err as Error).message}</>
                            );
                        }
                    }}
                >
                    {isRevokingAll ? 'Revoking...' : 'Revoke All'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}