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

export function OverViewPage({ variant = "campaign" }) {
  const isAds = variant === "ads";

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
    genderRatio: 60,
    surveyQuestion1: "Where did you hear about us?",
    surveyQuestion2: "Would you recommend our service?",
    engagements: 350,
    performance: {
      clicks: 180,
      impressions: 5000,
      conversions: 45,
    },
    surveyQuestion1: {
      questionText: "Where did you hear about us?",
      option1: "Social Media",
      option2: "Friend",
      option3: "Advertisement",
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
      totalCount: 300,
    },
  };
  

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <CampaignHeader />

        {/* Campaign Video Info */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
          <CampaignVideoInfo campaignData={campaignData} />
        </div>

        {!isAds && (
          <>
            <CampaignFeedbackForm />

            <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
              <h2 className="text-lg font-semibold mb-2">Budget & Spending</h2>
              <BudgetSummary campaignData={campaignData} />
            </div>
          </>
        )}

        {/* Quiz and Survey */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
            <QuizDetails
              quizQuestion={campaignData.quizQuestion}
              genderRatio={campaignData.genderRatio.male}
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

        {!isAds && (
          <>
            <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
              <h2 className="text-lg font-semibold mb-2">
                Performance Summary
              </h2>
              <PerformanceSummary campaignData={campaignData} />
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-[24px] shadow">
              <h2 className="text-lg font-semibold mb-2">Engagement Chart</h2>
              <EngagementChart />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
