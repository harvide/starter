'use client';
import { authClient, type User } from '@repo/auth/client';
import { config } from '@repo/config';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Checkbox } from '@repo/ui/components/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover';
import { Skeleton } from '@repo/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDownIcon, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getAcronym } from '@/lib/utils';

type DialogAction = 'profile' | 'listSession' | 'revokeSession' | 'impersonate';
type AlertAction = 'promote' | 'revokeAll' | 'ban' | 'delete';

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
    </TableRow>
  );
}

export function UserTable() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [dialogAction, setDialogAction] = useState<DialogAction | null>(null);
  const [alertAction, setAlertAction] = useState<AlertAction | null>(null);
  const [actionUser, setActionUser] = useState<User | null>(null);

  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [banReason, setBanReason] = useState('');
  const [banUntilDate, setBanUntilDate] = useState<Date | null>(null);
  const [banUntilTime, setBanUntilTime] = useState<string | null>(null);
  const [banForever, setBanForever] = useState(false);

  const [isBanning, setIsBanning] = useState(false);
  const [banError, setBanError] = useState('');

  const [popoverOpen, setPopoverOpen] = useState(false);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'avatar',
        header: '',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage alt={u.name} src={u.image || undefined} />
              <AvatarFallback className="rounded-lg">
                {getAcronym(u.name)}
              </AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <span>
              {u.name}
              {u.banned && (
                <Badge className="mr-2" variant="destructive">
                  Banned
                </Badge>
              )}
            </span>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <DropdownMenu
              modal={false}
              onOpenChange={(open) => {
                if (!open) {
                  document.body.style.pointerEvents = 'auto';
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="align-end">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2 font-normal">
                    <Avatar className="h-6 w-6">
                      <AvatarImage alt={u.name} src={u.image || undefined} />
                      <AvatarFallback className="rounded-lg">
                        {getAcronym(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{u.name}</span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setDialogAction('profile');
                  }}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Billing</DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setAlertAction('promote');
                  }}
                  variant="destructive"
                >
                  Promote to admin
                </DropdownMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <DropdownMenuItem disabled>Set role</DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    You need to enable{' '}
                    <Link
                      className="text-xs underline"
                      href="https://www.better-auth.com/docs/plugins/admin#access-control"
                    >
                      Access Control
                    </Link>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setDialogAction('listSession');
                  }}
                >
                  List Session
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setDialogAction('revokeSession');
                  }}
                >
                  Revoke session
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setAlertAction('revokeAll');
                  }}
                  variant="destructive"
                >
                  Revoke all session
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setDialogAction('impersonate');
                  }}
                >
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setAlertAction('ban');
                  }}
                  variant="destructive"
                >
                  {u.banned ? 'Unban user' : 'Ban user'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setActionUser(u);
                    setAlertAction('delete');
                  }}
                  variant="destructive"
                >
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  async function fetchUsers(page: number) {
    setIsLoading(true);
    const res = await authClient.admin.listUsers({
      query: {
        limit: pageSize,
        offset: page * pageSize,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
    });
    setUsers((res.data?.users as User[]) || []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUsers(pageIndex);
  }, [pageIndex, fetchUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [search, users]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Input
        className="mb-4 max-w-sm"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        value={search}
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex w-fit flex-col items-start justify-center text-muted-foreground text-sm">
          <span>
            Page {pageIndex + 1} of {Math.ceil(users.length / pageSize)}
          </span>
          <span className="text-[9px]">
            {users.length > 0
              ? ` (${users.length} users)`
              : ' (No users found)'}
          </span>
        </div>
        <div className="space-x-2">
          <Button
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={users.length < pageSize}
            onClick={() => setPageIndex((p) => p + 1)}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog
        onOpenChange={(v) => {
          if (!v) {
            setDialogAction(null);
          }
        }}
        open={!!dialogAction}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'profile' && 'User Profile'}
              {dialogAction === 'listSession' && 'Sessions'}
              {dialogAction === 'revokeSession' && 'Revoke Session'}
              {dialogAction === 'impersonate' && 'Impersonate User'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'profile' && `Details for ${actionUser?.name}`}
              {dialogAction === 'listSession' &&
                `Sessions for ${actionUser?.name}`}
              {dialogAction === 'revokeSession' &&
                `Select session to revoke for ${actionUser?.name}`}
              {dialogAction === 'impersonate' &&
                `You will impersonate ${actionUser?.name}`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogAction(null)}>Close</Button>
            {dialogAction === 'revokeSession' && <Button>Revoke</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        onOpenChange={(v) => {
          if (!v) {
            setAlertAction(null);
          }
        }}
        open={!!alertAction}
      >
        {alertAction === 'ban' && actionUser && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionUser.banned ? 'Unban user?' : 'Ban user?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionUser.banned
                  ? `Remove ban from ${actionUser.name}.`
                  : `Ban ${actionUser.name}. Provide reason and expiry date.`}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {!actionUser.banned && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Reason</Label>
                  <Input
                    disabled={isBanning}
                    onChange={(e) => {
                      setBanReason(e.target.value);
                      setBanError('');
                    }}
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
                        >
                          {banUntilDate
                            ? banUntilDate.toLocaleDateString()
                            : 'Select date'}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-auto overflow-hidden p-0"
                      >
                        <Calendar
                          captionLayout="dropdown"
                          disabled={(data) => {
                            if (banForever) {
                              return true;
                            }

                            const today = new Date();
                            return (
                              data < today ||
                              data >
                                new Date(
                                  today.getFullYear() + 1,
                                  today.getMonth(),
                                  today.getDate()
                                )
                            );
                          }}
                          mode="single"
                          onSelect={(date) => {
                            setBanUntilDate(date || null);
                            setPopoverOpen(false);
                          }}
                          selected={banUntilDate || undefined}
                          showOutsideDays={true}
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
                      disabled={!banUntilDate || isBanning || banForever}
                      id="time-picker"
                      onChange={(e) => {
                        // todo fix
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
                      type="time" // 1 hour step
                      value={banUntilTime || '10:30'}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={banForever}
                    disabled={isBanning}
                    onCheckedChange={(checked) => {
                      setBanForever(checked as boolean); // what the actual fuck todo
                    }}
                  />
                  <Label htmlFor="ban-forever">Forever</Label>
                </div>
                {banError && (
                  <p className="text-destructive text-sm">{banError}</p>
                )}
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isBanning}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isBanning}
                onClick={async () => {
                  setIsBanning(true);
                  try {
                    if (actionUser.banned) {
                      await authClient.admin.unbanUser({
                        userId: actionUser.id,
                      });
                    } else {
                      let expiresIn: number | undefined;

                      if (banForever) {
                        expiresIn = undefined;
                      } else if (banUntilDate) {
                        expiresIn = Math.floor(
                          (banUntilDate.getTime() - Date.now()) / 1000
                        );
                      } else {
                        expiresIn = undefined;
                      }

                      await authClient.admin.banUser({
                        userId: actionUser.id,
                        banReason: banReason || undefined,
                        banExpiresIn: expiresIn,
                      });
                    }
                    setIsBanning(false);
                    setAlertAction(null);
                  } catch (err) {
                    setIsBanning(false);
                    setBanError(
                      (err as Error).message || 'Error processing ban'
                    );
                  }
                }}
              >
                {isBanning
                  ? actionUser.banned
                    ? 'Unbanning…'
                    : 'Banning…'
                  : actionUser.banned
                    ? 'Unban'
                    : 'Ban'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
        {alertAction === 'delete' && actionUser && (
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
                  {actionUser.name}
                </code>
              </Label>
              <Input
                disabled={isDeleting}
                onChange={(e) => {
                  setConfirmInput(e.target.value);
                  setDeleteError('');
                }}
                placeholder={actionUser.name}
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
                disabled={confirmInput !== actionUser.name || isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await authClient.admin.removeUser({
                      userId: actionUser.id,
                    });
                    setIsDeleting(false);
                    setAlertAction(null);
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
        )}
      </AlertDialog>
    </>
  );
}
