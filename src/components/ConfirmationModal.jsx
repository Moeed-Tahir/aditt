"use client";

import { Trash } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  icon: Icon = Trash,
  isLoading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border text-center p-6 rounded-[20px] w-full max-w-[456px]">
        <Icon className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-[20px] md:text-[24px] font-md mb-4">{title}</h3>
        <p className="text-[14px] md:text-[16px] text-gray-500 mb-6">
          {description}
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={onClose}
            className="border w-full md:w-[204px] h-[44px] rounded-[58px] text-blue-600 bg-white hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="border w-full md:w-[204px] h-[44px] rounded-[58px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}