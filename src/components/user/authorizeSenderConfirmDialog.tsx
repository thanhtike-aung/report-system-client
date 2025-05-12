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
import { useEffect } from "react";
import { Label } from "../ui/label";
import { userApi, useUpdateUserMutation } from "@/redux/apiServices/user";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import useToast from "@/hooks/useToast";
import { MESSAGE } from "@/constants/messages";

interface AuthorizeSenderConfirmDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  targetContent: { id: number; name: string; canReport: boolean };
}

export function AuthorizeSenderConfirmDialog({
  open,
  setOpen,
  targetContent,
}: AuthorizeSenderConfirmDialogProps) {
  const [
    updateUserMutation,
    {
      isLoading: isUserUpdateLoading,
      isSuccess: isUserUpdateSuccess,
      isError: isUserUpdateError,
    },
  ] = useUpdateUserMutation();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (!isUserUpdateSuccess) return;
    dispatch(userApi.util.invalidateTags(["User"]));
    showSuccess(
      `${targetContent.canReport ? "Unauthorize" : "Authorize"} successfully.`
    );
  }, [isUserUpdateSuccess]);

  useEffect(() => {
    if (!isUserUpdateError) return;
    showError(MESSAGE.ERROR.UNKNOWN_ERROR);
  }, [isUserUpdateError]);

  const handleAuthorize = async () => {
    await updateUserMutation({
      id: targetContent.id.toString(),
      body: {
        canReport: !targetContent.canReport,
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Authorize Sender</AlertDialogTitle>
          <AlertDialogDescription className="leading-5">
            Are you sure you want to authorize <b>{targetContent.name}</b> as a
            sender? <br /> This action will grant his/her the ability to send
            reports to you via Microsoft Teams.
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
            onClick={() => handleAuthorize()}
            className="!bg-[#5b87ff] custom-animate-button"
          >
            {isUserUpdateLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <Label>Updating</Label>
              </>
            ) : (
              <Label>Confirm</Label>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
