import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUserMutation, userApi } from "@/redux/apiServices/user";
import { Loader2 } from "lucide-react";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";
import useToast from "@/hooks/useToast";
import { MESSAGE } from "@/constants/messages";

interface DeleteDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  targetContent: { id: number; name: string };
}

export function DeleteDialog({
  open,
  setOpen,
  targetContent,
}: DeleteDialogProps) {
  const [deleteUserMutation, { isLoading, isSuccess, isError }] =
    useDeleteUserMutation();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const handleDelete = useCallback(() => {
    deleteUserMutation(targetContent.id.toString());
    setOpen(false);
  }, [deleteUserMutation, targetContent.id, setOpen]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(userApi.util.invalidateTags(["User"]));
      showSuccess(`Member ${MESSAGE.SUCCESS.DELETED}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      showError(MESSAGE.ERROR.UNKNOWN_ERROR);
    }
  }, [isError, showError]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <b>{targetContent.name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            className="custom-animate-button"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="!bg-[#ff2200] custom-animate-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <Label>Deleting</Label>
              </>
            ) : (
              <Label>Delete</Label>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
