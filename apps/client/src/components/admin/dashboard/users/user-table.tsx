"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Input } from "@repo/ui/components/input";
import { authClient, User } from "@/lib/auth";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/components/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@repo/ui/components/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ChevronDownIcon, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Badge } from "@repo/ui/components/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@repo/ui/components/tooltip";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";
import { getAcronym } from "@/lib/utils";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Calendar } from "@repo/ui/components/calendar";
import { config } from "@repo/config";

type DialogAction = "profile" | "listSession" | "revokeSession" | "impersonate";
type AlertAction = "promote" | "revokeAll" | "ban" | "delete";

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
    </TableRow>
  );
}

export function UserTable() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [dialogAction, setDialogAction] = useState<DialogAction | null>(null);
  const [alertAction, setAlertAction] = useState<AlertAction | null>(null);
  const [actionUser, setActionUser] = useState<User | null>(null);

  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [banReason, setBanReason] = useState("");
  const [banUntilDate, setBanUntilDate] = useState<Date | null>(null);
  const [banUntilTime, setBanUntilTime] = useState<string | null>(null);
  const [banForever, setBanForever] = useState(false);

  const [isBanning, setIsBanning] = useState(false);
  const [banError, setBanError] = useState("");

  const [popoverOpen, setPopoverOpen] = useState(false);

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: "avatar",
      header: "",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={u.image || undefined} alt={u.name} />
            <AvatarFallback className="rounded-lg">{getAcronym(u.name)}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <span>
            {u.name}
            {u.banned && <Badge variant="destructive" className="mr-2">Banned</Badge>}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <DropdownMenu modal={false} onOpenChange={open => {
            if (!open) document.body.style.pointerEvents = "auto";
          }}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="align-end">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2 font-normal">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={u.image || undefined} alt={u.name} />
                    <AvatarFallback className="rounded-lg">{getAcronym(u.name)}</AvatarFallback>
                  </Avatar>
                  <span>{u.name}</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => { setActionUser(u); setDialogAction("profile"); }}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Billing</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => { setActionUser(u); setAlertAction("promote"); }} variant="destructive">
                Promote to admin
              </DropdownMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem disabled>
                      Set role
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  You need to enable <Link href="https://www.better-auth.com/docs/plugins/admin#access-control" className="underline text-xs">Access Control</Link>
                </TooltipContent>
              </Tooltip>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => { setActionUser(u); setDialogAction("listSession"); }}>
                List Session
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setActionUser(u); setDialogAction("revokeSession"); }}>
                Revoke session
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setActionUser(u); setAlertAction("revokeAll"); }} variant="destructive">
                Revoke all session
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => { setActionUser(u); setDialogAction("impersonate"); }}>
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setActionUser(u); setAlertAction("ban"); }} variant="destructive">
                {u.banned ? "Unban user" : "Ban user"}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setActionUser(u); setAlertAction("delete"); }} variant="destructive">
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  async function fetchUsers(page: number) {
    setIsLoading(true);
    const res = await authClient.admin.listUsers({
      query: {
        limit: pageSize,
        offset: page * pageSize,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });
    setUsers(res.data?.users as User[] || []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUsers(pageIndex);
  }, [pageIndex]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
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
        placeholder="Search by name or email..."
        className="max-w-sm mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id}>
              {hg.headers.map(h => (
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
            : table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex flex-col w-fit items-start justify-center text-sm text-muted-foreground">
          <span>
            Page {pageIndex + 1} of {Math.ceil(users.length / pageSize)}
          </span>
          <span className="text-[9px]">
            {users.length > 0 ? ` (${users.length} users)` : " (No users found)"}
          </span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(p => Math.max(p - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(p => p + 1)}
            disabled={users.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!dialogAction} onOpenChange={v => { if (!v) setDialogAction(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "profile" && "User Profile"}
              {dialogAction === "listSession" && "Sessions"}
              {dialogAction === "revokeSession" && "Revoke Session"}
              {dialogAction === "impersonate" && "Impersonate User"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "profile" && `Details for ${actionUser?.name}`}
              {dialogAction === "listSession" && `Sessions for ${actionUser?.name}`}
              {dialogAction === "revokeSession" && `Select session to revoke for ${actionUser?.name}`}
              {dialogAction === "impersonate" && `You will impersonate ${actionUser?.name}`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogAction(null)}>Close</Button>
            {dialogAction === "revokeSession" && <Button>Revoke</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!alertAction} onOpenChange={v => { if (!v) setAlertAction(null); }}>
        {alertAction === "ban" && (
          <>
            {actionUser && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {actionUser.banned ? "Unban user?" : "Ban user?"}
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
                        placeholder={config.admin.defaultBanReason || "No reason"}
                        value={banReason}
                        onChange={e => { setBanReason(e.target.value); setBanError("") }}
                        disabled={isBanning}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date-picker" className="px-1">
                          Date
                        </Label>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="w-32 justify-between font-normal"
                            >
                              {banUntilDate ? banUntilDate.toLocaleDateString() : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={banUntilDate || undefined}
                              showOutsideDays={true}
                              disabled={(data) => {
                                if (banForever) return true;

                                const today = new Date();
                                return data < today || data > new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
                              }}
                              captionLayout="dropdown"
                              
                              onSelect={(date) => {
                                setBanUntilDate(date || null);
                                setPopoverOpen(false)
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="time-picker" className="px-1">
                          Time
                        </Label>
                        <Input
                          type="time"
                          id="time-picker"
                          onChange={(e) => {
                            // todo fix
                            const timeParts = e.target.value.split(":");
                            if (timeParts.length === 3) {
                              const date = new Date(banUntilDate || Date.now());
                              date.setHours(
                                parseInt(timeParts[0] || "0", 10),
                                parseInt(timeParts[1] || "0", 10),
                              );
                              setBanUntilDate(date);
                              setBanUntilTime(e.target.value);
                            }
                          }}
                          value={banUntilTime || "10:30"}
                          disabled={!banUntilDate || isBanning || banForever}
                          step="3600" // 1 hour step
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={banForever}
                        onCheckedChange={(checked) => {
                          setBanForever(checked as boolean); // what the actual fuck todo 
                        }
                        }
                        disabled={isBanning}
                      />
                      <Label htmlFor="ban-forever">Forever</Label>
                    </div>
                    {banError && <p className="text-sm text-destructive">{banError}</p>}
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
                          await authClient.admin.unbanUser({ userId: actionUser.id });
                        } else {
                          const expiresIn = banForever
                            ? undefined
                            : banUntilDate
                              ? Math.floor((banUntilDate.getTime() - Date.now()) / 1000)
                              : undefined;
                          await authClient.admin.banUser({
                            userId: actionUser.id,
                            banReason: banReason || undefined,
                            banExpiresIn: expiresIn,
                          });
                        }
                        setIsBanning(false);
                        setAlertAction(null);
                      } catch (err: any) {
                        setIsBanning(false);
                        setBanError(err.message || "Error processing ban");
                      }
                    }}
                  >
                    {isBanning
                      ? actionUser.banned ? "Unbanning…" : "Banning…"
                      : actionUser.banned ? "Unban" : "Ban"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </>
        )}
        {alertAction === "delete" && actionUser && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4">
              <Label className="pb-2 tracking-tigher">
                To confirm, type the full name of the user <code className="font-mono text-xs tracking-tighter select-none text-muted-foreground ml-2">{actionUser.name}</code>
              </Label>
              <Input
                placeholder={actionUser.name}
                value={confirmInput}
                onChange={e => { setConfirmInput(e.target.value); setDeleteError(""); }}
                disabled={isDeleting}
              />
              {deleteError && (
                <p className="text-sm text-destructive mt-2">
                  {deleteError}
                </p>
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
                    await authClient.admin.removeUser({ userId: actionUser.id });
                    setIsDeleting(false);
                    setAlertAction(null);
                  } catch (err: any) {
                    setIsDeleting(false);
                    setDeleteError(err.message || "Error deleting user");
                  }
                }}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
