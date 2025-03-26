import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Project } from "@/types/project";
import { ROOT_ADMIN_ID } from "@/constants";

interface DeleteWarningDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project | null;
}

export function DeleteWarningDialog({
  open,
  setOpen,
  project,
}: DeleteWarningDialogProps) {
  if (!project) return null; // Avoid rendering if no project is provided

  const activeUsers = project.users.filter((user) => user.id !== ROOT_ADMIN_ID);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold">
            You cannot delete this project. It has the following active members:
          </AlertDialogTitle>
          {activeUsers.length > 0 ? (
            activeUsers.map((user) => (
              <AlertDialogDescription key={user.id}>
                {user.name}
              </AlertDialogDescription>
            ))
          ) : (
            <AlertDialogDescription>
              No active members found.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
