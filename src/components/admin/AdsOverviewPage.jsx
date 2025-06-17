"use client";

import Navbar from "@/components/Navbar";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { AdsVideoInfo } from "./AdsVideoInfo";
import { AdsQuizDetails } from "./AdsQuizDetails";
import { AdsSurveyDetails } from "./AdsSurveyDetails";
import { AdsHeader } from "./AdsHeader";

export function AdsOverview() {
  const campaignData = {
    title: "Dummy Campaign Title",
    views: 1200,
    videoUrl: "https://www.example.com/sample.mp4",
    budget: 1000,
    spent: 750,
    quizQuestion: {
      questionText: "What's your favorite color?",
      option1: "Red",
      option2: "Blue",
      option3: "Green",
      option4: "Yellow",
    },
    genderRatio: 60, // pass a number, not object
    surveyQuestion1: {
      questionText: "Where did you hear about us?",
      option1: "Social Media",
      option2: "Friends",
      option3: "Google Ads",
      option4: "Other",
    },
    surveyQuestion2: {
      questionText: "Would you recommend our service?",
      option1: "Yes",
      option2: "No",
      option3: "Maybe",
      option4: "Not Sure",
    },
    engagements: {
      totalCount: 350,
    },
    performance: {
      clicks: 180,
      impressions: 5000,
      conversions: 45,
    },
  };

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-4 sm:p-0">
          {/* Back Button - Left Side */}
          <Link
            href={`/admin/ads-approval`}
            className="order-1 sm:order-none py-2 px-5 sm:ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
          >
            <ArrowLeft />
            Back
          </Link>

          {/* Title - Center */}
          <div className="order-3 sm:order-none text-[24px] font-medium text-center text-gray-800 w-full sm:w-auto">
            Campaign Overview
          </div>

          {/* Action Buttons - Right Side */}
          <div className="order-2 sm:order-none flex gap-3 w-full sm:w-auto justify-center sm:justify-end sm:mr-5">
            <button
              type="button"
              className="py-2 px-5 rounded-full bg-red-100 text-red-700 border border-red-800 hover:bg-red-200 transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              Reject
            </button>

            <button
              type="button"
              className="py-2 px-5 rounded-full bg-green-100 text-green-700 border border-green-800 hover:bg-green-200 transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              Accept
            </button>
          </div>
        </div>

     
        <div className="bg-white sm:p-6 rounded-[24px]">
          <AdsHeader/>
        </div>

        {/* Campaign Video Info */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px]">
          <AdsVideoInfo campaignData={campaignData} />
        </div>

        {/* Quiz and Survey */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <AdsQuizDetails
              quizQuestion={campaignData.quizQuestion}
              genderRatio={campaignData.genderRatio}
            />
          </div>

          <div>
            <AdsSurveyDetails
              surveyQuestion1={campaignData.surveyQuestion1}
              surveyQuestion2={campaignData.surveyQuestion2}
              engagements={campaignData.engagements}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
