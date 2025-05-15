"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCheck, ShieldAlert } from "lucide-react";

export default function ConfirmationDialog({
  open,
  title,
  smallText,
  confirmLabel,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="h-[340px] sm:h-[340px] flex flex-col justify-between">
        <DialogHeader className="items-center">
          <div className="w-full flex justify-center mt-2">
            <ShieldAlert className="h-16 w-16 sm:h-20 sm:w-20 text-blue-300" />
          </div>
          <DialogTitle className="text-center text-xl sm:text-2xl font-normal mt-2">{title}</DialogTitle>
          <DialogTitle className="text-center font-light text-gray-600 text-xs sm:text-sm mt-2">{smallText}</DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 mt-auto">
          <div className="flex gap-2 sm:gap-4">
            <Button className="mt-4 py-5 sm:py-7 px-12 sm:px-20 rounded-[58px] text-blue-600 bg-white hover:bg-blue-600 hover:text-white cursor-pointer" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="mt-4 py-5 sm:py-7 px-12 sm:px-20 rounded-[58px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}