"use client";

import Navbar from "@/components/Navbar";
import CampaignHeader from "../campaign/CampaignHeader";
import { CampaignVideoInfo } from "@/components/campaign/CampaignVideoInfo";
import { BudgetSummary } from "@/components/campaign/BudgetSummary";
import { QuizDetails } from "@/components/campaign/QuizDetails";
import { SurveyDetails } from "@/components/campaign/SurveyDetails";
import { PerformanceSummary } from "@/components/campaign/PerformanceSummary";
import EngagementChart from "@/components/AreaCharts";
import CampaignFeedbackForm from "../CampaignFeedbackForm";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function OverViewPage({ id }) {
  const [campaignData, setCampaignData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/routes/v1/campaignRoutes?action=getCampaignAgainstId",
        { id }
      );
      if (response.data.message === "Campaign Retrieved Successfully") {
        setCampaignData(response.data.campaign);
        setFeedbackData(response.data.feedback);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error occurred");
      console.error("Error fetching campaign:", error);
    }
  }, [id, setCampaignData, setFeedbackData]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign, id]);

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <CampaignHeader campaignData={campaignData} />

        <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
          <CampaignVideoInfo campaignData={campaignData} />
        </div>

        {campaignData?.status === "Completed" && (
          <CampaignFeedbackForm feedbackData={feedbackData} />
        )}

        <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
          <h2 className="text-lg font-semibold mb-2">Budget & Spending</h2>
          <BudgetSummary campaignData={campaignData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
            <QuizDetails
              quizQuestion={campaignData.quizQuestion}
              genderRatio={campaignData.genderRatio}
            />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
            <SurveyDetails
              surveyQuestion1={campaignData.surveyQuestion1}
              surveyQuestion2={campaignData.surveyQuestion2}
              engagements={campaignData.engagements}
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
          <h2 className="text-lg font-semibold mb-2">Performance Summary</h2>
          <PerformanceSummary campaignData={campaignData} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
          <h2 className="text-lg font-semibold mb-2">Engagement Chart</h2>
          <EngagementChart
            clicks={campaignData?.clickCount?.totalCount}
            videoWatchTime={campaignData?.videoWatchTime}
          />
        </div>
      </div>
    </main>
  );
}
