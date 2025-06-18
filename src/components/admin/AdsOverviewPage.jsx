"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdsVideoInfo } from "./AdsVideoInfo";
import { AdsQuizDetails } from "./AdsQuizDetails";
import { AdsSurveyDetails } from "./AdsSurveyDetails";
import { AdsHeader } from "./AdsHeader";
import axios from "axios";
import { useRouter } from "next/navigation";

export function AdsOverview({ campaignData }) {
  const router = useRouter();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  
  const handleCampaignAction = async (action) => {
    try {
      if (action === "accept") {
        setAcceptLoading(true);
      } else {
        setRejectLoading(true);
      }

      const response = await axios.post(
        "/api/routes/v1/campaignRoutes?action=activeOrRejectCampaign",
        {
          id: campaignData._id,
          status: action === "accept" ? "Active" : "Rejected",
        }
      );

      if (response.data.success) {
        router.push("/admin/ads-approval");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating campaign status:", error);
      throw error;
    } finally {
      if (action === "accept") {
        setAcceptLoading(false);
      } else {
        setRejectLoading(false);
      }
    }
  };

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-4 sm:p-0">
          <Link
            href={`/admin/ads-approval`}
            className="order-1 sm:order-none py-2 px-5 sm:ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
          >
            <ArrowLeft />
            Back
          </Link>

          <div className="order-3 sm:order-none text-[24px] font-medium text-center text-gray-800 w-full sm:w-auto">
            Campaign Overview
          </div>

          <div className="order-2 sm:order-none flex gap-3 w-full sm:w-auto justify-center sm:justify-end sm:mr-5">
            <button
              type="button"
              onClick={() => handleCampaignAction("reject")}
              disabled={rejectLoading || acceptLoading}
              className={`py-2 px-5 rounded-full bg-red-100 text-red-700 border border-red-800 hover:bg-red-200 transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start ${
                rejectLoading || acceptLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {rejectLoading ? "Processing..." : "Reject"}
            </button>

            <button
              type="button"
              onClick={() => handleCampaignAction("accept")}
              disabled={acceptLoading || rejectLoading} 
              className={`py-2 px-5 rounded-full bg-green-100 text-green-700 border border-green-800 hover:bg-green-200 transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start ${
                acceptLoading || rejectLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {acceptLoading ? "Processing..." : "Accept"}
            </button>
          </div>
        </div>

        <div className="bg-white sm:p-6 rounded-[24px]">
          <AdsHeader campaignData={campaignData} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[24px]">
          <AdsVideoInfo campaignData={campaignData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <AdsQuizDetails
              quizQuestion={campaignData?.quizQuestion}
              genderRatio={campaignData?.genderRatio}
              genderType={campaignData?.genderType}
            />
          </div>

          <div>
            <AdsSurveyDetails
              surveyQuestion1={campaignData?.surveyQuestion1}
              surveyQuestion2={campaignData?.surveyQuestion2}
              engagements={campaignData?.engagements}
            />
          </div>
        </div>
      </div>
    </main>
  );
}