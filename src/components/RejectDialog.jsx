"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

export default function RejectDialog({ open, onClose, onSave }) {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please explain the reason for rejection");
      return;
    }
    
    try {
      await onSave({ reason });
      onClose();
    } catch (error) {
      console.error("Error submitting rejection:", error);
      toast.error("Failed to submit rejection");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <div className="w-full flex justify-center mt-2">
            <ShieldAlert className="h-16 w-16 sm:h-20 sm:w-20 text-blue-300" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-2xl font-medium">
            Reason to Reject
          </DialogTitle>
          <DialogTitle className="text-center font-light text-gray-600 text-md sm:text-md mt-2">
            Please Explain the reason of rejection below
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <div>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[150px] resize-none placeholder:text-gray-500 focus:outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write here"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <div className="flex justify-between gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-full px-8 py-2 w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="rounded-full px-8 py-2 w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}