"use client";

import { House, Globe, LandmarkIcon, ChevronDown, Tag } from "lucide-react";
import { useState } from "react";

export default function BusinessSettings({
  formData,
  handleChange,
  businessEditMode,
  setBusinessEditMode,
  businessLoading,
  updateUserData,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-2 md:p-8 relative flex flex-col gap-[35px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="w-full">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Business information
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            Edit your business details to keep them up to date.
          </p>
        </div>
        <button
          className={`w-full md:w-[218px] h-[48px] md:h-[56px] text-[14px] md:text-[16px] rounded-full hover:bg-blue-700 cursor-pointer ${
            businessEditMode
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:text-white"
          }`}
          onClick={() => {
            if (businessEditMode) updateUserData(true);
            setBusinessEditMode(!businessEditMode);
          }}
          disabled={businessLoading}
        >
          {businessLoading ? "Saving..." : businessEditMode ? "Update" : "Edit"}
        </button>
      </div>

      <hr className="border-t border-gray-300" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Profile Type
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <LandmarkIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            {businessEditMode ? (
              <select
                className="w-full appearance-none border border-gray-300 rounded-full pl-10 pr-10 py-2 text-gray-700 h-[56px]"
                onChange={handleChange}
                name="profileType"
                value={formData.profileType || ""}
              >
                <option value="" disabled>
                  Select Profile Type
                </option>
                <option value="Marketing agency">Marketing Agency</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Corporate">Corporate</option>
              </select>
            ) : (
              <div className="w-full h-[56px] flex items-center pl-10 pr-4 border border-gray-300 rounded-full ">
                {formData.profileType
                  ? `${formData.profileType}`
                  : "Select Profile Type"}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Company Name
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Reebok promotion"
              onChange={handleChange}
              name="companyName"
              value={formData.companyName}
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 h-[56px]"
              disabled={!businessEditMode}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Brand Name
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Your brand name"
              onChange={handleChange}
              name="brandName"
              value={formData.brandName || ""}
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 h-[56px]"
              disabled={!businessEditMode}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Business Website (optional)
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 h-[56px]"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}