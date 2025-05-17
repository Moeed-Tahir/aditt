"use client";

import { User, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { allCountries } from "country-telephone-data";

export default function PersonalSettings({
  formData,
  handleChange,
  personalEditMode,
  setPersonalEditMode,
  personalLoading,
  passwordLoading,
  updateUserData,
  updatePassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-2 md:p-8 relative flex flex-col gap-[35px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
        <div className="w-full">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Personal information
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            Update your personal details to keep your profile accurate.
          </p>
        </div>
        <button
          className={`w-full md:w-[218px] h-[48px] md:h-[56px] text-[14px] md:text-[16px] rounded-full  cursor-pointer hover:bg-blue-700 ${
            personalEditMode
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:text-white"
          }`}
          onClick={() => {
            if (personalEditMode) updateUserData(false);
            setPersonalEditMode(!personalEditMode);
          }}
          disabled={personalLoading}
        >
          {personalLoading ? "Saving..." : personalEditMode ? "Update" : "Edit"}
        </button>
      </div>

      <hr className="border-t mb-4 border-gray-300" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Name
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 h-[56px]"
              disabled={!personalEditMode}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium pt-0 md:pt-2">
              Phone Number
            </label>
          </div>
          <div className="w-full md:flex-1">
            <div className="flex items-center border border-gray-300 rounded-full w-full overflow-visible h-[56px]">
              <div className="relative flex-shrink-0">
                <select
                  defaultValue="+1"
                  className="bg-transparent text-sm pl-4 pr-8 py-2 outline-none appearance-none"
                  disabled={!personalEditMode}
                >
                  {allCountries.map((country) => {
                    const flag = country.iso2
                      .toUpperCase()
                      .replace(/./g, (char) =>
                        String.fromCodePoint(127397 + char.charCodeAt(0))
                      );
                    return (
                      <option key={country.iso2} value={country.dialCode}>
                        {flag} +{country.dialCode}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="h-6 w-px bg-gray-300 mx-2"></span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="flex-1 pl-2 pr-4 py-2 text-sm bg-transparent outline-none h-[56px]"
                disabled={!personalEditMode}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Email
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 h-[56px]"
              disabled
            />
          </div>
        </div>
      </div>

      <hr className="border-t mb-4 border-gray-300" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              Current Password
            </label>
          </div>
          <div className="w-full md:flex-1">
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2 h-[56px]"
                disabled={!personalEditMode}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={!personalEditMode}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link
                href="/reset-password"
                className="text-blue-500 hover:underline font-medium text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-6">
          <div className="w-full md:w-1/3">
            <label className="block text-[16px] md:text-[18px] font-medium">
              New Password
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2 h-[56px]"
              disabled={!personalEditMode}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={!personalEditMode}
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {personalEditMode && (
          <div className="flex justify-end mt-4">
            <button
              onClick={updatePassword}
              disabled={passwordLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
