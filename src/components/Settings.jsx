"use client";

import Navbar from "@/components/Navbar";

import Charts from "@/components/Charts";
import { LineBarsChart } from "@/components/LineBarsChart";
import Link from "next/link";
import {
  ChevronDown,
  Copy,
  Globe,
  House,
  LandmarkIcon,
  Lock,
  Mail,
  Trash,
  Upload,
  User,
} from "lucide-react";

export function Settings() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />

        <h1 className="text-2xl p-4 font-bold">Settings</h1>

        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="w-1/3">
              <label className="block text-lg font-medium">
                Business information
              </label>
              <span className="block text-xs text-gray-500 mt-1">
                Edit your business details to keep them up to date.{" "}
              </span>
            </div>

            <button className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700">
              Update
            </button>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="space-y-6">
            {/* Campaign Title */}
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Profile Type
                </label>
              </div>
              <div className="relative flex-1">
                {/* Landmark Icon on the left */}
                <LandmarkIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                {/* Chevron Down Icon on the right */}
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                {/* Dropdown select */}
                <select className="w-full appearance-none border border-gray-300 rounded-full pl-10 pr-10 py-2 text-gray-700">
                  <option value="">Select Profile</option>
                  <option value="agency">Marketing Agency</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Company Name
                </label>
              </div>
              <div className="relative flex-1">
                <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Reebok promotion"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                />
              </div>
            </div>

            {/* Website/Product Link */}
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Business Website(optional)
                </label>
              </div>

              <div className="flex-1">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="https://shop.app/"
                    className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="w-1/3">
              <label className="block text-lg font-medium">
                Personal information
              </label>
              <span className="block text-xs text-gray-500 mt-1">
                Update your personal details to keep your profile accurate.{" "}
              </span>
            </div>

            <button className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700">
              Update
            </button>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="space-y-6">
            {/* Campaign Title */}

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">Name</label>
              </div>
              <div className="relative flex-1">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Reebok promotion"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium pt-2">
                  Phone Number
                </label>
              </div>

              <div className="flex-1">
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden w-full">
                  <select className="bg-transparent text-sm px-4 py-2 outline-none appearance-none">
                    <option value="+1">🇺🇸+1</option>
                    <option value="+44">🇬🇧+44</option>
                    <option value="+92">🇵🇰+92</option>
                    <option value="+971">🇦🇪+971</option>
                    <option value="+974">🇶🇦+974</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute pointer-events-none" />


                  <span className="h-6 w-px bg-gray-300"></span>

                  <div className="relative flex-1">
                    {" "}
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-2 pr-4 py-2 text-sm bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">Email</label>
              </div>

              <div className="flex-1">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="https://shop.app/"
                    className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                  />
                </div>
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Current Password
                </label>
              </div>
              <div className="relative flex-1">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter your current password"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                />
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  New Password
                </label>
              </div>
              <div className="relative flex-1">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter your new password"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="w-1/3">
              <label className="block text-lg font-medium">
                Account Deletion
              </label>
              <span className="block text-xs text-gray-500 mt-1">
                Easily delete your account and remove all associated data from
                our platform.
              </span>
            </div>

            <button className="bg-white text-red-500 px-10 py-2 rounded-full border-2 border-red-500 hover:bg-red-700 hover:text-white">
              Request Account Deletion
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
