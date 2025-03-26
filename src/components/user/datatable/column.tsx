import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { DeleteDialog } from "@/components/user/deleteDialog";
import { useState } from "react";
import { decodeJWT } from "@/utils/jwt";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { USER_ROLES } from "@/constants";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          asChild
        >
          <div>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          asChild
        >
          <div>
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "supervisor",
    header: "Leader",
    cell: ({ getValue }) => (getValue() as { name: string })?.name || "",
    filterFn: (row, id, value) => {
      return value.includes((row.getValue(id) as { name: string })?.name);
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ getValue }) => (getValue() as { name: string })?.name || null,
    filterFn: (row, id, value) => {
      return value.includes(
        (row.getValue(id) as { id: number })?.id.toString()
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const [open, setOpen] = useState<boolean>(false);
      const navigate = useNavigate();
      const currentUser = decodeJWT(
        useSelector((state: RootState) => state.auth.authToken)
      );

      if (currentUser.role === USER_ROLES.MEMBER) return null;

      return (
        <div className="flex items-center justify-end gap-2 max-w-full">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 custom-animate-button"
            onClick={() => navigate(`${user.id}/edit`)}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 custom-animate-button"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>

          {/* Dialog */}
          <DeleteDialog
            open={open}
            setOpen={setOpen}
            targetContent={{ id: user.id, name: user.name }}
          />
        </div>
      );
    },
    size: 120,
  },
];
