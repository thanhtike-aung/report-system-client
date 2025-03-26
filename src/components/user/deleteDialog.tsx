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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";

export function DeleteDialog({
  open,
  setOpen,
  targetContent,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  targetContent: { id: number; name: string };
}) {
  const [deleteUserMutation, { isLoading, isSuccess }] =
    useDeleteUserMutation();
  const dispatch = useDispatch();
  const handleDelete = (id: number) => {
    deleteUserMutation(id.toString());
    setOpen(false);
  };

  useEffect(() => {
    if (!isSuccess) return;
    dispatch(userApi.util.invalidateTags(["User"]));
  }, [isSuccess]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <b>{targetContent.name}</b>
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
            onClick={() => handleDelete(targetContent.id)}
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
