'use client';
import type { User } from '@repo/auth/client';
import { Button } from '@repo/ui/components/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@repo/ui/components/table';
import { useState } from 'react';
import { showToast } from '@repo/ui/lib/toast';

interface RevokeSessionDialogProps {
    user: User;
    sessions: any[];
    isLoading: boolean;
    onRevokeSession: (sessionToken: string) => Promise<void>;
}

export function RevokeSessionDialog({ user, sessions, isLoading, onRevokeSession }: RevokeSessionDialogProps) {
    const [revokingSession, setRevokingSession] = useState<string | null>(null);
    const activeSessions = sessions.filter(s => !s.revoked);

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className="flex justify-center py-4">
                                        Loading sessions...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : activeSessions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className="flex justify-center py-4">
                                        No active sessions found
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            activeSessions.map(session => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.userAgent || 'Unknown Device'}</TableCell>
                                    <TableCell>{session.ip || 'Unknown IP'}</TableCell>
                                    <TableCell>
                                        {session.lastActive ? new Date(session.lastActive).toLocaleString() : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            disabled={revokingSession === session.id}
                                            onClick={async () => {
                                                if (!session.token) return;
                                                setRevokingSession(session.id);
                                                try {
                                                    await onRevokeSession(session.token);
                                                    showToast.success('Session revoked successfully');
                                                } catch (err) {
                                                    showToast.error(
                                                        <>Error revoking session: {(err as Error).message}</>
                                                    );
                                                }
                                                setRevokingSession(null);
                                            }}
                                            size="sm"
                                            variant="destructive"
                                        >
                                            {revokingSession === session.id ? 'Revoking...' : 'Revoke'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">
                Select a session to revoke. Only active sessions are shown.
            </p>
        </div>
    );
}
