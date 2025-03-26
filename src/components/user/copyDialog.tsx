import React, { useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { copyToClipboard } from "@/utils/clipboard";

interface DialogBoxProps {
  titleContent: string;
  bodyContent: string;
  userDetail: { email: string | null; password: string | null };
  buttonContent: string;
  onClose: () => void;
}

const CopyDialog: React.FC<DialogBoxProps> = ({
  titleContent,
  bodyContent,
  userDetail,
  buttonContent,
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const copyTemplate = `email: ${userDetail.email}\npassword: ${userDetail.password}`;

  const handleCopy = async () => {
    const copy = await copyToClipboard(copyTemplate);
    if (copy) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{titleContent}</AlertDialogTitle>
        <AlertDialogDescription>
          {bodyContent}
          <div className="m-3">
            <div className="grid grid-cols-2 gap-4">
              <Label>email: </Label>
              <p className="truncate">{userDetail.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Label>password: </Label>
              <p>{userDetail.password}</p>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="custom-animate-button">
          Close
        </AlertDialogCancel>
        <AlertDialogAction
          className="custom-primary custom-animate-button"
          onClick={handleCopy}
        >
          {isCopied ? "copied" : buttonContent}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default CopyDialog;
