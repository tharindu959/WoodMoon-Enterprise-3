"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Admin = {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  status: "active" | "inactive";
  role: "admin";
};

export const columns: ColumnDef<Admin>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="w-9 h-9 relative">
          <Image
            src={admin.avatar}
            alt={admin.fullName}
            fill
            className="rounded-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Admin",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "active" && "bg-green-500/40",
            status === "inactive" && "bg-red-500/40"
          )}
        >
          {status as string}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: () => (
      <span className="px-2 py-1 rounded text-xs bg-blue-500/30">admin</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const admin = row.original;

      const handleDeleteSingle = async () => {
        if (!confirm(`Are you sure you want to delete admin "${admin.fullName}"?`)) return;
        try {
          const res = await fetch(`http://localhost:8080/api/admins/${admin.id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete admin");

          alert("✅ Admin deleted successfully!");
          window.location.reload();
        } catch (err) {
          console.error("Error deleting admin:", err);
          alert("❌ Failed to delete admin");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(admin.id)}
            >
              Copy admin ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admins/${admin.id}`}>View Admin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteSingle}>
              Delete admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
