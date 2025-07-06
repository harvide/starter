'use client';

import { User, authClient } from "@repo/auth/client";
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@repo/ui/components/alert-dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useState } from "react";

interface DeleteUserDialogProps {
    user: User;
    onAction?: () => void;
}

export function DeleteUserDialog({ user, onAction }: DeleteUserDialogProps) {
    const [confirmInput, setConfirmInput] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete user?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action is permanent and cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4">
                <Label className="pb-2 tracking-tigher">
                    To confirm, type the full name of the user{' '}
                    <code className="ml-2 select-none font-mono text-muted-foreground text-xs tracking-tighter">
                        {user.name}
                    </code>
                </Label>
                <Input
                    disabled={isDeleting}
                    onChange={(e) => {
                        setConfirmInput(e.target.value);
                        setDeleteError('');
                    }}
                    placeholder={user.name}
                    value={confirmInput}
                />
                {deleteError && (
                    <p className="mt-2 text-destructive text-sm">{deleteError}</p>
                )}
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                    disabled={confirmInput !== user.name || isDeleting}
                    onClick={async () => {
                        setIsDeleting(true);
                        try {
                            await authClient.admin.removeUser({
                                userId: user.id,
                            });
                            setIsDeleting(false);
                            onAction?.();
                        } catch (err) {
                            setIsDeleting(false);
                            setDeleteError(
                                (err as Error).message || 'Error deleting user'
                            );
                        }
                    }}
                >
                    {isDeleting ? 'Deleting…' : 'Delete'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}