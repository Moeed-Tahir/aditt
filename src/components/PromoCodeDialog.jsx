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

export default function PromoCodeDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    discountType: "Percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    appliesTo: "",
    customUserLimit: "",
    limitUsers: false,
    status: true,
    fullWaiver: false,
  });

  const [loading, setLoading] = useState(false);
  const [showCustomUserInput, setShowCustomUserInput] = useState(false);

  const handleAppliesToChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomUserInput(true);
      setFormData({ ...formData, appliesTo: "", customUserLimit: "" });
    } else {
      setShowCustomUserInput(false);
      setFormData({ ...formData, appliesTo: value, customUserLimit: "" });
    }
  };

  const handleCustomUserLimitChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({
        ...formData,
        customUserLimit: value,
        appliesTo: value ? `First ${value} Users` : "",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a promo code name");
      return;
    }

    if (!formData.discountValue) {
      toast.error("Please enter a discount value");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    // Validate discount value
    if (formData.discountType === "Percentage" &&
      (formData.discountValue < 0 || formData.discountValue > 100)) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }

    if (formData.discountType === "Fixed Amount" && formData.discountValue < 0) {
      toast.error("Fixed amount cannot be negative");
      return;
    }

    // Validate dates
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/routes/v1/promoRoutes?action=createPromoCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          startDate: formData.startDate,
          endDate: formData.endDate,
          appliesTo: formData.appliesTo,
          customUserLimit: formData.customUserLimit ? Number(formData.customUserLimit) : undefined,
          limitUsers: formData.limitUsers,
          status: formData.status,
          fullWaiver: formData.fullWaiver
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create promo code');
      }

      toast.success("Promo code created successfully");

      if (onSave) {
        onSave(data);
      }

      setFormData({});
      onClose();
    } catch (error) {
      toast.error(response?.data?.error?.message);
    } finally {
      setLoading(false);
    }
  };

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
            <label className="block text-sm font-medium mb-1">Code Name *</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter promo code name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select a Discount Type *</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="discountType"
                  value="Percentage"
                  checked={formData.discountType === "Percentage"}
                  onChange={() =>
                    setFormData({ ...formData, discountType: "Percentage", discountValue: "" })
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
                    setFormData({ ...formData, discountType: "Fixed Amount", discountValue: "" })
                  }
                />
                Fixed Amount
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="fullWaiver"
                  checked={formData.fullWaiver}
                  onChange={() =>
                    setFormData({ ...formData, fullWaiver: !formData.fullWaiver })
                  }
                />
                Full Wavier
              </label>
            </div>

            <div className="mt-2 relative">
              {formData.discountType === "Percentage" ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 pr-8"
                    placeholder="0-100"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 text-gray-500">%</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="absolute left-3 text-gray-500">$</span>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 pl-8"
                    placeholder="Enter amount"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Applies To</label>
            <div className="flex flex-wrap gap-2">
              <select
                className="w-full border rounded px-3 py-2"
                value={showCustomUserInput ? "custom" : formData.appliesTo}
                onChange={handleAppliesToChange}
              >
                <option value="First 50 Users">First 50 Users</option>
                <option value="First 100 Users">First 100 Users</option>
                <option value="custom">Add other...</option>
              </select>

              {showCustomUserInput && (
                <div className="w-full flex items-center gap-2">
                  <span className="whitespace-nowrap">First</span>
                  <input
                    type="number"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Enter number of users"
                    value={formData.customUserLimit}
                    onChange={handleCustomUserLimitChange}
                    min="1"
                  />
                  <span className="whitespace-nowrap">Users</span>
                </div>
              )}
            </div>
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
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </label>
          </div>

          <p className="text-xs text-gray-500">
            When toggled off, existing campaigns can continue to use this promo code,
            but new campaigns won't be able to use it.
          </p>
        </div>

        <DialogFooter className="mt-6">
          <div className="flex justify-between gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-full px-8 py-2 w-1/2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="rounded-full px-8 py-2 w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}