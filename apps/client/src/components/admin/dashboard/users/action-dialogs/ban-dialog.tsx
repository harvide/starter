'use client';
import { authClient, type User } from '@repo/auth/client';
import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@repo/ui/components/popover';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { config } from '@repo/config';
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@repo/ui/components/alert-dialog';
import { showToast } from '@repo/ui/lib/toast';

interface BanDialogProps {
    user: User;
    onAction?: () => void;
}

export function BanDialog({ user, onAction }: BanDialogProps) {
    const [banReason, setBanReason] = useState('');
    const [banUntilDate, setBanUntilDate] = useState<Date | null>(user.banExpires ?? null);
    const [banUntilTime, setBanUntilTime] = useState<string | null>(null);
    const [banForever, setBanForever] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const [isBanning, setIsBanning] = useState(false);

    const getBanExpiresIn = (expiresIn: Date) => {
        if (banForever) return undefined;
        if (!banUntilDate) return undefined;
        return Math.floor((expiresIn.getTime() - Date.now()) / 1000);
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {user.banned ? <>Unban user?</> : <>Ban user?</>}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {user.banned
                        ? <>Remove ban from {user.name}.</>
                        : <>Ban {user.name}. Provide reason and expiry date.</>}
                </AlertDialogDescription>
            </AlertDialogHeader>
            {!user.banned ? (
                <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Reason</Label>
                        <Input
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder={config.admin.defaultBanReason || 'No reason'}
                            value={banReason}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="px-1" htmlFor="date-picker">
                                Date
                            </Label>
                            <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        className="w-32 justify-between font-normal"
                                        id="date-picker"
                                        variant="outline"
                                        disabled={banForever}
                                    >
                                        {banUntilDate
                                            ? banUntilDate.toLocaleDateString()
                                            : <>Select date</>}
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-auto overflow-hidden p-0"
                                >
                                    <Calendar
                                        captionLayout="dropdown"
                                        disabled={(date) => {
                                            if (banForever) return true;
                                            const today = new Date();
                                            return (
                                                date < today ||
                                                date > new Date(
                                                    today.getFullYear() + 1,
                                                    today.getMonth(),
                                                    today.getDate()
                                                )
                                            );
                                        }}
                                        mode="single"
                                        onSelect={(date: Date | undefined) => {
                                            setBanUntilDate(date || null);
                                            setPopoverOpen(false);
                                        }}
                                        selected={banUntilDate || undefined}
                                        showOutsideDays={true}
                                        required={false}
                                        defaultMonth={new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="px-1" htmlFor="time-picker">
                                Time
                            </Label>
                            <Input
                                className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                disabled={!banUntilDate || banForever}
                                id="time-picker"
                                onChange={(e) => {
                                    const timeParts = e.target.value.split(':');
                                    if (timeParts.length === 3) {
                                        const date = new Date(banUntilDate || Date.now());
                                        date.setHours(
                                            Number.parseInt(timeParts[0] || '0', 10),
                                            Number.parseInt(timeParts[1] || '0', 10)
                                        );
                                        setBanUntilDate(date);
                                        setBanUntilTime(e.target.value);
                                    }
                                }}
                                step="3600"
                                type="time"
                                value={banUntilTime || '10:30'}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={banForever}
                            onCheckedChange={(checked) => {
                                setBanForever(checked as boolean);
                            }}
                        />
                        <Label htmlFor="ban-forever">Forever</Label>
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                        This user is already banned.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Ban reason: {user.banReason || 'No reason provided'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Ban expires in{' '}
                        {user.banExpires
                            ? `${getBanExpiresIn(user.banExpires)} hours`
                            : 'forever'}
                    </p>
                </div>
            )}
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={async () => {
                        try {
                            if (user.banned) {
                                await authClient.admin.unbanUser({
                                    userId: user.id,
                                });
                                showToast.success(<>{user.name} unbanned successfully</>);
                                onAction?.();
                            } else {
                                setIsBanning(true);
                                await authClient.admin.banUser({
                                    userId: user.id,
                                    banReason: banReason || config.admin.defaultBanReason,
                                    banExpiresIn: banForever
                                        ? undefined
                                        : banUntilDate
                                            ? Math.floor(
                                                (banUntilDate.getTime() -
                                                    Date.now()) /
                                                1000
                                            )
                                            : undefined,
                                });
                                setIsBanning(false);
                                showToast.success(<>{user.name} banned successfully</>);
                                onAction?.();
                            }
                        } catch (err) {
                            setIsBanning(false);
                            showToast.error(
                                <>Error banning user: {(err as Error).message}</>
                            );
                        }
                    }}
                    disabled={isBanning || !user}
                >
                    {
                        isBanning
                            ? <>Processing…</>
                            : user.banned
                                ? <>Unban User</>
                                : <>Ban User</>
                    }
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}
