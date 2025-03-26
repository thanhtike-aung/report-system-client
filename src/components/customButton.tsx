"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteConfirmationButtonProps {
  onDelete: () => void;
  onCancel?: () => void;
  onShowConfirmation?: (show: boolean) => void;
  className?: string;
}

export function DeleteConfirmationButton({
  onDelete,
  onCancel,
  onShowConfirmation,
  className,
}: DeleteConfirmationButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
    onShowConfirmation?.(true);
  };

  const handleConfirm = () => {
    onDelete();
    setShowConfirmation(false);
    onShowConfirmation?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setShowConfirmation(false);
  };

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence initial={false} mode="wait">
        {!showConfirmation ? (
          <motion.div
            key="delete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteClick}
              className="!bg-red-400 rounded-full custom-animate-button"
            >
              <Trash2 className="size-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                variant="default"
                size="icon"
                onClick={handleConfirm}
                className="rounded-full !bg-green-600 !hover:bg-green-700"
              >
                <Check className="size-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleCancel}
                className="rounded-full !border-red-200 !bg-red-100 !hover:bg-red-200"
              >
                <X className="size-4 text-red-600" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
