import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Link2, Link2Off, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { DeleteDialog } from "@/components/user/deleteDialog";
import { useEffect, useState } from "react";
import { decodeJWT } from "@/utils/jwt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { USER_ROLES } from "@/constants";
import { useDeactivateUserMutation, userApi } from "@/redux/apiServices/user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuthorizeSenderConfirmDialog } from "@/components/user/authorizeSenderConfirmDialog";
import { PersonOff } from "@mui/icons-material";

const EditButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    className="p-1 !border-none transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:bg-transparent"
    onClick={onClick}
  >
    <Settings className="!h-5 !w-5" />
    <span className="sr-only">Edit</span>
  </Button>
);

const DeactivateButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="sm"
    className="p-1 !border-none transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:bg-transparent"
    onClick={onClick}
  >
    <PersonOff sx={{ width: "23px" }} />
    <span className="sr-only">Inactive</span>
  </Button>
);

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="sm"
    className="p-1 !border-none transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:bg-transparent"
    onClick={onClick}
  >
    <Trash2 className="!h-5 !w-5" />
    <span className="sr-only">Delete</span>
  </Button>
);

const AuthorizeButton = ({
  canReport,
  onClick,
}: {
  canReport: boolean;
  onClick: () => void;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="p-1 !border-none transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:bg-transparent"
        onClick={onClick}
      >
        {canReport ? (
          <Link2Off className="w-4 h-4" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>
        {canReport
          ? "Unauthorize to send evening reports at Microsoft Teams"
          : "Authorize to send evening reports at Microsoft Teams"}
      </p>
    </TooltipContent>
  </Tooltip>
);

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
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const currentUser = decodeJWT(
        useSelector((state: RootState) => state.auth.authToken)
      );
      const [deactivateUserMutation, { isSuccess }] =
        useDeactivateUserMutation();

      const deactivateUser = (id: number) => {
        deactivateUserMutation(id.toString());
      };

      useEffect(() => {
        if (!isSuccess) return;
        dispatch(userApi.util.invalidateTags(["User"]));
      }, [isSuccess]);

      if (currentUser.role === USER_ROLES.MEMBER) return null;

      // Show authorize button for ROOT_ADMIN or MANAGER
      const canShowAuthorize =
        currentUser.role === USER_ROLES.ROOT_ADMIN ||
        currentUser.role === USER_ROLES.MANAGER;

      // Show edit/deactivate/delete for MANAGER or supervisor
      const canEditOrDeactivate =
        currentUser.role === USER_ROLES.MANAGER ||
        (currentUser.supervisorRole === USER_ROLES.MANAGER &&
          currentUser.id === user.id) ||
        user.supervisor_id === currentUser.id;

      return (
        <TooltipProvider>
          <div className="flex items-center justify-end gap-2 max-w-full">
            {canShowAuthorize && (
              <AuthorizeButton
                canReport={user.can_report}
                onClick={() => setOpenConfirmDialog(true)}
              />
            )}

            {canEditOrDeactivate && (
              <>
                <EditButton onClick={() => navigate(`${user.id}/edit`)} />
                {user.is_active ? (
                  <DeactivateButton onClick={() => deactivateUser(user.id)} />
                ) : (
                  <DeleteButton onClick={() => setOpenDeleteDialog(true)} />
                )}
              </>
            )}

            {/* Dialogs */}
            <DeleteDialog
              open={openDeleteDialog}
              setOpen={setOpenDeleteDialog}
              targetContent={{ id: user.id, name: user.name }}
            />
            <AuthorizeSenderConfirmDialog
              open={openConfirmDialog}
              setOpen={setOpenConfirmDialog}
              targetContent={{
                id: user.id,
                name: user.name,
                canReport: user.can_report,
              }}
            />
          </div>
        </TooltipProvider>
      );
    },
    size: 120,
  },
];
