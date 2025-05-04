"use client";

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
import Navbar2 from "./Navbar2";

export function Notifications() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar2 />

        <div className="p-10">
          <div className="relative flex items-center mb-10 justify-between">
            <Link
              href="/CampaignDashboard"
              className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition"
            >
              ← Back
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 text-lg">
              Notifications
            </div>
            <div className="w-[90px]" />
          </div>

          <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
            <div className="flex items-center justify-between ">
              <div>
                <label className="block text-lg font-medium mt-2">
                  Low Balance Alert ⚠️
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  The balance for your campaign, [Campaign Title], is running
                  low. Add funds now to avoid interruptions in its performance.{" "}
                </span>
                <p className="text-xs mt-2 text-gray-500">Today</p>
              </div>
            </div>
            <hr className="border-t  border-gray-300" />
            <div className="flex items-center bg-blue-100 justify-between">
              <div>
                <label className="block text-lg font-medium mt-2">
                  Congratulation your campaign has been published.
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Your campaign is now live and visible to your audience.
                </span>
                <p className="text-xs mt-2 text-gray-500">Today</p>
              </div>
            </div>
            <hr className="border-t  border-gray-300" />
            <div className="flex items-center justify-between ">
              <div>
                <label className="block text-lg font-medium mt-2">
                  New Client Added ✅
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Your client, [Client Name], has been approved. You can now
                  start creating campaigns for them.
                </span>
                <p className="text-xs mt-2 text-gray-500">Today</p>
              </div>
            </div>
            <hr className="border-t  border-gray-300" />
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-lg font-medium mt-2">
                  Campaign Expired ⏳
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Your campaign [Campaign Title] has expired, but you still have
                  an available budget. Update the dates or pause the campaign.{" "}
                </span>
                <p className="text-xs mt-2 text-gray-500">23 feb, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
