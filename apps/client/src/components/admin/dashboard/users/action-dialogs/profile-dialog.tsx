'use client';
import type { User } from '@repo/auth/client';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@repo/ui/components/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { getAcronym } from '@/lib/utils';
import { Button } from '@repo/ui/components/button';

interface ProfileDialogProps {
    user: User;
}

export function ProfileDialog({ user }: ProfileDialogProps) {
    function splitName(fullName: string): { firstName: string, lastName: string } {
        const parts = fullName.trim().split(/\s+/);
        const lastName = parts.pop() ?? '';
        const firstName = parts.join(' ');
        return { firstName, lastName };
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
                <DialogDescription>
                    View user information
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex gap-8">
                <div className="flex-1 space-y-4">
                    <div className="w-full space-x-2 flex flex-row">
                        <div className="space-y-2">
                            <Label>First name</Label>
                            <Input
                                value={splitName(user.name).firstName}
                                disabled={true}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Last name</Label>
                            <Input
                                value={splitName(user.name).lastName}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={user.email}
                            disabled={true}
                            type="email"
                        />
                    </div>
                    {user.phoneNumber && (
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={user.phoneNumber}
                                disabled={true}
                                type="tel"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                            value={user.role === 'admin' ? 'Administrator' : 'User'}
                            disabled={true}
                        />
                    </div>
                    {user.banned && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-destructive">Ban Reason</Label>
                                <Input
                                    value={user.banReason || 'No reason provided'}
                                    disabled={true}
                                    className="text-destructive"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-destructive">Ban Expires</Label>
                                <Input
                                    value={user.banExpires
                                        ? new Date(user.banExpires).toLocaleDateString()
                                        : 'Never'}
                                    disabled={true}
                                    className="text-destructive"
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32 rounded-md -mt-8">
                        <AvatarImage
                            alt={user.name}
                            src={user.image || undefined}
                            className="object-cover rounded-md"
                        />
                        <AvatarFallback className="text-4xl rounded-md">
                            {getAcronym(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
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
