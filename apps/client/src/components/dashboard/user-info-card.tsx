'use client';

import { cn } from '@repo/ui/lib/utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { type User } from '@repo/auth/client';

type UserInfoCardProps = {
    user: User;
    className?: string;
};

export function UserInfoCard({ user, className }: UserInfoCardProps) {
    return (
        <div className="w-full space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Current User</h2>
            </div>
            <Card className={cn("w-full text-left", className)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
                            {user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h3 className="text-2xl">{user.email}</h3>
                            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Account created {new Date(user.createdAt).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div>
                        <h4 className="text-sm font-medium mb-3">Raw Data</h4>
                        <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-auto">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        This can change based on your settings. You should always run <code>bun db:generate</code> and <code>bun db:migrate</code> after changes to <code>starter.config.ts</code></span>
                </CardContent>
            </Card>
        </div>
    );
}
