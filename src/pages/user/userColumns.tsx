import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings, Trash, Trash2, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { DeleteDialog } from "@/components/user/deleteDialog";
import { useEffect, useState } from "react";
import { decodeJWT } from "@/utils/jwt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { USER_ROLES } from "@/constants";
import useToast from "@/hooks/useToast";
import { useDeactivateUserMutation, userApi } from "@/redux/apiServices/user";

export const userColumns: ColumnDef<User>[] = [
  {
    header: "NO.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0 hover:bg-transparent"
          asChild
        >
          <div>
            NAME
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
          className="!px-0 hover:bg-transparent"
          asChild
        >
          <div>
            EMAIL
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "ROLE",
  },
  {
    accessorKey: "supervisor",
    header: "LEADER",
    cell: ({ getValue }) => (getValue() as { name: string })?.name || "",
    filterFn: (row, id, value) => {
      return value.includes((row.getValue(id) as { name: string })?.name);
    },
  },
  {
    accessorKey: "project",
    header: "PROJECT",
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
      const dispatch = useDispatch();
      const currentUser = decodeJWT(
        useSelector((state: RootState) => state.auth.authToken)
      );
      const [deactivateUserMutation, { isLoading, isSuccess }] =
        useDeactivateUserMutation();

      const deactivateUser = (id: number) => {
        deactivateUserMutation(id.toString());
      };

      useEffect(() => {
        if (!isSuccess) return;
        dispatch(userApi.util.invalidateTags(["User"]));
      }, [isSuccess]);

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
          {user.is_active ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 custom-animate-button"
              onClick={() => deactivateUser(user.id)}
            >
              <UserRoundX className="h-4 w-4" />
              <span className="sr-only">Inactive</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 custom-animate-button"
              onClick={() => setOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}

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
