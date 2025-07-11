'use client';
import { authClient, type User } from '@repo/auth/client';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@repo/ui/components/table';
import { Skeleton } from '@repo/ui/components/skeleton';
import { showToast } from '@repo/ui/lib/toast';
import { useEffect, useState } from 'react';
import {
    Monitor,
    Smartphone,
    Apple,
    Bot
} from 'lucide-react';

interface SessionsDialogProps {
    user: User;
    onAction?: () => void;
}

export function SessionsDialog({ user, onAction }: SessionsDialogProps) {
    const [sessions, setSessions] = useState<{
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        listSessions();
    }, [user.id]);

    const listSessions = async () => {
        try {
            setIsLoading(true);
            const response = await authClient.admin.listUserSessions({ userId: user.id });
            setSessions(response.data?.sessions || []);
        } catch (err) {
            showToast.error(
                <>Error loading sessions: {(err as Error).message}</>
            );
        } finally {
            setIsLoading(false);
        }
    };

    const revokeSession = async (sessionToken: string) => {
        try {
            await authClient.admin.revokeUserSession({ sessionToken });
            setSessions(prev => prev.map(s =>
                s.token === sessionToken ? { ...s, revoked: true } : s
            ));
            showToast.success(
                <>Session revoked successfully</>
            );
            onAction?.();
        } catch (err) {
            showToast.error(
                <>Error revoking session: {(err as Error).message}</>
            );
        }
    };

    const getDeviceIcon = (userAgent?: string | null) => {
        if (!userAgent) return <Monitor className="h-4 w-4" />;
        const ua = userAgent.toLowerCase();
        if (ua.includes('mobile')) return <Smartphone className="h-4 w-4" />;
        if (ua.includes('tablet')) return <Smartphone className="h-4 w-4" />;
        if (ua.includes('macintosh')) return <Apple className="h-4 w-4" />;
        if (ua.includes('android')) return <Smartphone className="h-4 w-4" />;
        if (ua.includes('iphone')) return <Smartphone className="h-4 w-4" />;
        if (ua.includes('ipad')) return <Smartphone className="h-4 w-4" />;
        if (ua.includes('bot')) return <Bot className="h-4 w-4" />;
        return <Monitor className="h-4 w-4" />;
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Active Sessions</DialogTitle>
                <DialogDescription>
                    View and manage active sessions for {user.name}
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Used</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="flex justify-center py-4">
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : sessions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No active sessions
                                </TableCell>
                            </TableRow>
                        ) : (
                            sessions.map((session) => (
                                <TableRow key={session.token}>
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex items-center gap-2">
                                            {getDeviceIcon(session.userAgent)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {session.ipAddress || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(session.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(session.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => revokeSession(session.token)}
                                            size="sm"
                                            variant="destructive"
                                            className="cursor-pointer text-xs"
                                        >
                                            Revoke
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}
