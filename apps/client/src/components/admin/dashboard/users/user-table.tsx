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
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Badge } from "@repo/ui/components/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@repo/ui/components/tooltip";
import Link from "next/link";
import { getAcronym } from "@/lib/utils";

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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertAction === "promote" && "Promote to admin?"}
              {alertAction === "revokeAll" && "Revoke all sessions?"}
              {alertAction === "ban" && (actionUser?.banned ? "Unban user?" : "Ban user?")}
              {alertAction === "delete" && "Delete user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction === "promote" && `Grant admin to ${actionUser?.name}.`}
              {alertAction === "revokeAll" && `This will revoke all sessions for ${actionUser?.name}.`}
              {alertAction === "ban" && (
                actionUser?.banned
                  ? `Remove ban from ${actionUser.name}.`
                  : `Ban ${actionUser?.name} from the system.`
              )}
              {alertAction === "delete" && `Permanently delete ${actionUser?.name}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              {alertAction === "promote" && "Promote"}
              {alertAction === "revokeAll" && "Revoke All"}
              {alertAction === "ban" && (actionUser?.banned ? "Unban" : "Ban")}
              {alertAction === "delete" && "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
