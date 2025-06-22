"use client";

import React, { useMemo } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { getAcronym } from "@/lib/utils";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Badge } from "@repo/ui/components/badge";

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

  // pagination
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: "avatar",
      header: "",
      cell: ({ row }) => (
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarImage src={row.getValue("avatar")} alt={row.getValue("name")} />
          <AvatarFallback className="rounded-lg">{getAcronym(row.getValue("name"))}</AvatarFallback>
        </Avatar>
      )
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span>
          {row.getValue("name")}
          {row.original.banned ? <Badge variant="destructive" className="mr-2">Banned</Badge> : (<></>)}
        </span>
      )
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
      cell: ({ row }) => (
        <DropdownMenu modal={false} onOpenChange={(open) => {
          if (!open) {
            //remove the style="pointer-events: none;" from the body
            document.body.style.pointerEvents = "auto"
          }
        }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="align-end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Promote to admin</DropdownMenuItem>
            <DropdownMenuItem disabled>Set role</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>List Session</DropdownMenuItem>
            <DropdownMenuItem>Revoke session</DropdownMenuItem>
            <DropdownMenuItem>Revoke all session</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Impersonate</DropdownMenuItem>
            <DropdownMenuItem>Ban user</DropdownMenuItem>
            <DropdownMenuItem>Delete user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  async function fetchUsers(page: number) {
    setIsLoading(true);
    const usersData = await authClient.admin.listUsers({
      query: {
        limit: pageSize,
        offset: page * pageSize,
        sortBy: "createdAt",
        sortDirection: "desc",
      }
    });
    setUsers(usersData.data?.users as User[] || []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUsers(pageIndex);
  }, [pageIndex])

  const filteredUsers = useMemo(() => {
    const searchStr = search.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchStr) ||
      user.email.toLowerCase().includes(searchStr)
    );
  }, [search, users]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div>
      <Input
        placeholder="Search by name or email..."
        className="max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
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
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={users.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
