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

export function ChatSupport() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />
        <div className="p-10">
          <div className="relative flex items-center mb-10 justify-between">
            <Link
              href="/Support"
              className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition"
            >
              ← Back
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 text-lg">
              Help Center
            </div>
            <div className="w-[90px]" />
          </div>
          <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="w-1/3">
                <label className="block text-lg font-medium">
                  Do you have any questions?
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Contrary to popular belief is not simply.
                </span>
              </div>

              <button className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700">
                Send
              </button>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="space-y-6">
              {" "}
              <div className="flex items-start gap-6">
                <div className="w-1/3">
                  <label className="block text-sm font-medium">
                    Your query title
                  </label>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter your query title"
                    className="w-full border border-gray-300 rounded-full pl-3 pr-4 py-2"
                  />
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-1/3">
                  <label className="block text-sm font-medium">
                    Query Details
                  </label>
                </div>
                <div className="relative flex-1">
                  <textarea
                    placeholder="Enter a description"
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
