"use client";

import Navbar2 from "@/components/Navbar2";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Ellipsis,
  EllipsisVertical,
  Pencil,
  Pause,
  CheckCheck,
  X,
  House,
  Globe,
  Upload,
  Trash,
  Copy,
  ArrowLeft,
} from "lucide-react";

export default function EditCampaign() {
  return (
    <>
      <Navbar2 />

      <div className="min-h-screen bg-gray-100 px-4 py-8">
        {/* Stepper */}

        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center mb-6">
            <Link
          href="/userid/campaign-dashboard"
          className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft />
              Back
            </Link>

            <div className="flex-1 text-center text-lg font-medium">
              Edit the Campaign
            </div>
          </div>

          <div className="flex items-center justify-between relative">
            {[
              "Campaign info",
              "Targeting details",
              "Campaign budget",
              "Set questions",
            ].map((step, index, arr) => (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center w-1/4"
              >
                <div
                  className={`w-30 h-10 flex items-center justify-center rounded-full text-xs font-medium ${
                    index === 0
                      ? "bg-white border-1 border-blue-600 text-gray-600"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {/* <span
                  className={`text-sm mt-2 ${
                    index === 0 ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {step}
                </span> */}
              </div>
            ))}
            <div className="absolute top-5 left-[7%] right-[7%] h-0.5 bg-blue-600 z-0" />
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 relative">
          {/* Top-right Next button */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-1/3">
              <label className="block text-lg font-medium">Campaign info</label>
              <span className="block text-xs text-gray-500 mt-1">
                Add key details to set up and optimize your campaign.
              </span>
            </div>

            <button className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700">
              Next
            </button>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="space-y-6">
            {/* Campaign Title */}
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Campaign Title
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Choose a clear and recognizable title to help identify your
                  campaign.
                </span>
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

            <hr className="border-t mb-4 border-gray-300" />

            {/* Website/Product Link */}
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Website/Product Link
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Add your website or product link. A UTM link will be
                  auto-generated for tracking.
                </span>
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

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-green-600 select-all">
                    https://www.example.com?utm_source=adit&utm_medium=video&utm_campaign=spring_sal
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "https://www.example.com?utm_source=adit&utm_medium=video&utm_campaign=spring_sal"
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            {/* Campaign Video Upload */}
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Campaign Video
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Upload your campaign video. For best results, we recommend
                  using vertical videos.
                </span>
              </div>
              <div className="flex-1 bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                <p className="text-sm text-gray-700 mb-1">Upload video</p>
                <p className="text-xs text-gray-500">Format: mp4</p>
                <div className="mt-4 flex justify-between items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-md">
                  <span className="text-sm">ads video.mp4</span>
                  <span className="text-xs text-gray-500">34.6 MB</span>
                  <button className="text-red-500 ml-4">
                    <Trash />
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            {/* Campaign Image Upload */}
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-sm font-medium">
                  Campaign Image (optional)
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  This image will be used as a thumbnail for your campaign.
                </span>
              </div>
              <div className="flex-1 bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                <p className="text-sm text-gray-700 mb-1">Upload image</p>
                <p className="text-xs text-gray-500">Format: jpeg, jpg, png</p>
                <div className="mt-4 flex justify-between items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-md">
                  <span className="text-sm">Campaign image.jpg</span>
                  <span className="text-xs text-gray-500">4.6 MB</span>
                  <button className="text-red-500 ml-4">
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
