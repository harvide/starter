'use client';
import { authClient, type User } from '@repo/auth/client';
import {
  ProfileDialog,
  SessionsDialog,
  ImpersonateDialog,
  PromoteDialog,
  BanDialog,
} from './action-dialogs';
import {
  AlertDialog
} from '@repo/ui/components/alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Dialog
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAcronym } from '@/lib/utils';
import { showToast } from '@repo/ui/lib/toast';
import { useRouter } from 'next/navigation';
import { DeleteUserDialog } from './action-dialogs/delete-user';
import { RevokeAllSessionsDialog } from './action-dialogs/revoke-all-sessions-dialog';

type DialogAction = 'profile' | 'listSession' | 'revokeSession';
type AlertAction = 'promote' | 'revokeAll' | 'ban' | 'delete' | 'impersonate';

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

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

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
                <Badge className="ml-2 text-xs" variant="destructive">
                  BAN
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
                  {u.role === 'admin' ? <>Demote to user</> : <>Promote to admin</>}
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
                  onSelect={async () => {
                    setActionUser(u);
                    setDialogAction('listSession');
                    setIsLoadingSessions(true);
                    try {
                      const sessionsData = await authClient.admin.listUserSessions({
                        userId: u.id,
                      });
                      setSessions(sessionsData.data?.sessions || []);
                    } catch (err) {
                      showToast.error(
                        <>Error loading sessions: {(err as Error).message}</>
                      );
                    }
                    setIsLoadingSessions(false);
                  }}
                >
                  List Session
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={async () => {
                    setActionUser(u);
                    setDialogAction('revokeSession');
                    setIsLoadingSessions(true);
                    try {
                      const sessionsData = await authClient.admin.listUserSessions({
                        userId: u.id,
                      });
                      setSessions(sessionsData.data?.sessions || []);
                    } catch (err) {
                      showToast.error(
                        <>Error loading sessions: {(err as Error).message}</>
                      );
                    }
                    setIsLoadingSessions(false);
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
                    setAlertAction('impersonate');
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

  const fetchUsers = useCallback(async (page: number) => {
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
  }, [authClient, pageSize, setUsers, setIsLoading]);

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
            setTimeout(() => {
              setDialogAction(null);
            }, 400); // Delay to allow dialog to close before resetting state
          }
        }}
        open={!!dialogAction}
      >
        {dialogAction === 'profile' && actionUser && (
          <ProfileDialog user={actionUser} />
        )}
        {dialogAction === 'listSession' && actionUser && (
          <SessionsDialog
            user={actionUser}
            onAction={async () => { setDialogAction(null); fetchUsers(pageIndex); }}
          />
        )}
        {dialogAction === 'revokeSession' && actionUser && (
          <SessionsDialog
            user={actionUser}
            onAction={async () => { setDialogAction(null); fetchUsers(pageIndex); }}
          />
        )}
      </Dialog>

      <AlertDialog
        onOpenChange={(v) => {
          if (!v) {
            setAlertAction(null);
          }
        }}
        open={!!alertAction}
      >
        {alertAction === 'revokeAll' && actionUser && (
          <RevokeAllSessionsDialog
            user={actionUser}
            onAction={async () => {
              setAlertAction(null);
            }}
          />
        )}
        {alertAction === 'ban' && actionUser && (
          <BanDialog
            user={actionUser}
            onAction={() => {
              fetchUsers(pageIndex);
              setAlertAction(null);
            }}
          />
        )}
        {alertAction === 'promote' && actionUser && (
          <PromoteDialog
            user={actionUser}
            onAction={async () => {
              await fetchUsers(pageIndex);
              setAlertAction(null);
            }}
          />
        )}
        {alertAction === 'impersonate' && actionUser && (
          <ImpersonateDialog
            user={actionUser}
            onAction={async () => {
              setAlertAction(null);
            }}
          />
        )}
        {alertAction === 'delete' && actionUser && (
          <DeleteUserDialog
            user={actionUser}
            onAction={async () => {
              setAlertAction(null);
              fetchUsers(pageIndex);
            }}
          />
        )}
      </AlertDialog >
    </>
  );
}
