"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar2 from "@/components/Navbar2";
import QuestionBox from "./QuestionBox";
import Sliders from "@/components/Sliders";
import Calendars from "@/components/Calendars";

import {
  Calendar,
  ChevronDown,
  CircleDollarSign,
  CircleDot,
  Copy,
  Globe,
  House,
  Trash,
  Upload,
} from "lucide-react";
import PaymentMethod from "./PaymentMethod";
import LinkBankAccount from "./LinkBankAccount";

export function CreateCampaigns() {
  const steps = [
    { label: "Set Questions" },
    { label: "Campaign Info" },
    { label: "Targeting Details" },
    { label: "Campaign Budget" },
  ];

  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "0");

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar2 />

      <div className="p-10">
        {/* Top Header with Back Button */}
        <div className="relative flex items-center mb-10 justify-between">
          <Link
            href="/CampaignDashboard"
            className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition"
          >
            ← Back
          </Link>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 text-lg">
            Create Campaign
          </div>
          <div className="w-[90px]" />
        </div>

        {/* Stepper */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center w-1/4"
              >
                <Link
                  href={`?step=${index}`}
                  className={`w-40 gap-2 h-10 flex items-center justify-center rounded-full text-xs font-medium ${
                    index === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-500 border border-gray-300"
                  } hover:cursor-pointer transition`}
                >
                  <CircleDot className="w-4 h-4" />
                  {step.label}
                </Link>
              </div>
            ))}
            <div className="absolute top-5 left-[9%] right-[9%] h-0.5 bg-blue-600 z-0" />
          </div>
        </div>

        {/* Page Content (only for step 0 here) */}
        {currentStep === 0 && (
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-lg font-medium">
                    Set Questions
                  </label>
                  <span className="block text-xs text-gray-500 mt-1">
                    Add a quiz or survey for campaign insights.
                  </span>
                </div>
                {/* Next button goes to next step */}
                <Link
                  href="?step=1"
                  className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700"
                >
                  Next
                </Link>
              </div>

              <hr className="border-t mb-4 border-gray-300" />
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Quiz Question (optional)
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Adit will create if you don't
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <QuestionBox />
                  </div>
                </div>
                <hr className="border-t mb-4 border-gray-300" />
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Survey Question 1 (optional)
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Adit will NOT create if you don't
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <QuestionBox />
                  </div>
                </div>
                <hr className="border-t mb-4 border-gray-300" />
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Survey Question 2 (optional)
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Adit will NOT create if you don't
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <QuestionBox />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="min-h-screen px-4 py-8">
            {/* Form Section */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              {/* Top-right Next button */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-lg font-medium">
                    Campaign info
                  </label>
                  <span className="block text-xs text-gray-500 mt-1">
                    Add key details to set up and optimize your campaign.
                  </span>
                </div>

                <Link
                  href="?step=2"
                  className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700"
                >
                  Next
                </Link>
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
                      Choose a clear and recognizable title to help identify
                      your campaign.
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
                  <div className="flex-1 border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
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
                  <div className="flex-1 border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                    <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                    <p className="text-sm text-gray-700 mb-1">Upload image</p>
                    <p className="text-xs text-gray-500">
                      Format: jpeg, jpg, png
                    </p>
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
        )}

        {currentStep === 2 && (
          <div className="min-h-screen px-4 py-8">
            {/* Form Section */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              {/* Top-right Next button */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-lg font-medium">
                    Targeting Details
                  </label>
                  <span className="block text-xs text-gray-500 mt-1">
                    Reach the right people by setting up precise targeting for
                    your ads.
                  </span>
                </div>

                <Link
                  href="?step=3"
                  className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700"
                >
                  Next
                </Link>
              </div>

              <hr className="border-t mb-4 border-gray-300" />

              <div className="space-y-6">
                {/* Campaign Title */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Gender Ratio
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Define your preferred male-to-female ratio for ad
                      targeting.
                    </span>
                  </div>
                  <div className="relative bg-blue flex-1">
                    <Sliders
                      min={0}
                      max={100}
                      defaultValue={50}
                      showLabel={true}
                      showRadio={true}
                      labelUnit="%"
                      radioOptions={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                    />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Website/Product Link */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">Age</label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Select the age range of your target audience.
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="relative flex-1">
                      <Sliders
                        min={18}
                        max={65}
                        defaultValue={30}
                        showLabel={true}
                        showRadio={false}
                        labelUnit=" yrs"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign Video Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Categories
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Select the categories that align with your campaign to
                      reach the right audience.
                    </span>
                  </div>
                  <div className="flex-1 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <input type="checkbox" name="selected" className="mr-2" />
                      <span className="w-120 h-12 text-black text-m p-2 border rounded-full">
                        🎮 Gaming
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <input type="checkbox" name="selected" className="mr-2" />
                      <span className="w-120 h-12 text-black text-m p-2 border rounded-full">
                        🍹 Food and Drink
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <input type="checkbox" name="selected" className="mr-2" />
                      <span className="w-120 h-12 text-black text-m p-2 border rounded-full">
                        📺 Entertainment & Technology
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <input type="checkbox" name="selected" className="mr-2" />
                      <span className="w-120 h-12 text-black text-m p-2 border rounded-full">
                        👩🏻‍⚕️ Health & wellness
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <input type="checkbox" name="selected" className="mr-2" />
                      <span className="w-120 h-12 text-black text-m p-2 border rounded-full">
                        🛍️ Shopping
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="min-h-screen px-4 py-8">
            {/* Form Section */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              {/* Top-right Next button */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-lg font-medium">
                    Campaign budget
                  </label>
                  <span className="block text-xs text-gray-500 mt-1">
                    Define your budget to maximize reach and performance.
                  </span>
                </div>

                <Link
                  href="/CampaignDashboard"
                  className="bg-blue-600 text-white px-16 py-2 rounded-full hover:bg-blue-700"
                >
                  Next
                </Link>
              </div>

              <hr className="border-t mb-4 border-gray-300" />

              <div className="space-y-6">
                {/* Campaign Title */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Campaign start date (Required)
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Choose when you want your campaign to go live and start
                      reaching your audience.
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <Calendars />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Website/Product Link */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                      Campaign end date (Optional)
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Choose an end date for your campaign or leave it
                      open-ended to run indefinitely.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <Calendars />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign Video Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                    Calculate campaign budget
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                      Define the total budget for your campaign.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <CircleDollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                    <input
                      type="text"
                      placeholder="Enter campaign budget"
                      className="w-120 h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2"
                    />
                  </div>
                  
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign Video Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium">
                    Payment Info
                    </label>
                    <span className="block text-xs text-gray-500 mt-1">
                    Choose a payment method to fund your campaign.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <PaymentMethod />
                    <LinkBankAccount />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
