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
      <DialogContent className="h-[300px] flex flex-col justify-between">
        <DialogHeader className="items-center">
          <div className="w-full flex justify-center mt-2">
            <ShieldAlert className="h-10 w-10 text-blue-300" />
          </div>
          <DialogTitle className="text-center text-xl font-normal mt-4">{title}</DialogTitle>

          <DialogTitle className="text-center font-light text-gray-600 text-sm mt-4">{smallText}</DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 mt-auto">
          <div className="flex gap-4">
            <Button className="mt-4 py-7 px-20 rounded-[58px] text-blue-600 bg-white hover:bg-white-700 cursor-pointer" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="mt-4 py-7 px-20 rounded-[58px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
