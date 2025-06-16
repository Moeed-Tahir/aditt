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

export default function PromoCodeDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    discountType: "Percentage",
    startDate: "",
    endDate: "",
    appliesTo: "New Signup",
    limitUsers: false,
    status: true,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-2xl font-medium">
            Create New Promo Code
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select a Discount Type</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discountType"
                  value="Percentage"
                  checked={formData.discountType === "Percentage"}
                  onChange={() =>
                    setFormData({ ...formData, discountType: "Percentage" })
                  }
                />
                Percentage
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discountType"
                  value="Fixed Amount"
                  checked={formData.discountType === "Fixed Amount"}
                  onChange={() =>
                    setFormData({ ...formData, discountType: "Fixed Amount" })
                  }
                />
                Fixed Amount
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Applies To</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.appliesTo}
              onChange={(e) =>
                setFormData({ ...formData, appliesTo: e.target.value })
              }
            >
              <option value="New Signup">New Signup</option>
              <option value="First 50 Users">First 50 Users</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.limitUsers}
              onChange={() =>
                setFormData({ ...formData, limitUsers: !formData.limitUsers })
              }
            />
            <label className="text-sm">Limit to all users for each campaign</label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.status}
                onChange={() =>
                  setFormData({ ...formData, status: !formData.status })
                }
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </label>
          </div>

          <p className="text-xs text-gray-500">
            When toggled off, allow existing campaigns continue to use this promo code,
            but disallow new campaigns from using it.
          </p>
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
      onClick={() => onSave(formData)}
      className="rounded-full px-8 py-2 w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
    >
      Save
    </Button>
  </div>
</DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
