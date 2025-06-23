"use client";
import { useState, useRef } from "react";
import Navbar2 from "@/components/Navbar2";
import EngagementChart from "@/components/AreaCharts";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import Cookies from "js-cookie";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import { CampaignVideoInfo } from "@/components/campaign/CampaignVideoInfo";
import { CampaignExpiredAlert } from "@/components/campaign/CampaignExpiredAlert";
import { BudgetSummary } from "@/components/campaign/BudgetSummary";
import { QuizDetails } from "@/components/campaign/QuizDetails";
import { SurveyDetails } from "@/components/campaign/SurveyDetails";
import { PerformanceSummary } from "@/components/campaign/PerformanceSummary";
import FeedbackDialog from "../campaign-dashboard/FeedbackDialog";

export default function CampaignDetailPage({ campaignData, campaignId }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [showExpiredAlert, setShowExpiredAlert] = useState(true);
  const userId = Cookies.get("userId");
  
  console.log("campaignData",campaignData);
  
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    smallText: "",
    confirmLabel: "",
    onConfirm: () => { },
  });

  const openDialog = (title, smallText, confirmLabel, onConfirm) => {
    setDialogConfig({ title, smallText, confirmLabel, onConfirm });
    setDialogOpen(true);
  };

  if (!campaignData) {
    return (
      <div className="p-10 text-center text-gray-500">Campaign not found</div>
    );
  }

  const isCampaignExpired = new Date(campaignData.date) < new Date();

  return (
    <>
      <Navbar2 />
      <main className="flex min-h-screen w-full max-w-[1440px] mx-auto flex-col">
        <div className="p-6 space-y-6">
          <CampaignHeader
            campaignId={campaignId}
            campaignData={campaignData}
            userId={userId}
            openDialog={openDialog}
            setFeedbackDialogOpen={setFeedbackDialogOpen}
          />

          <div className="bg-white p-4 sm:p-6 rounded-[24px]">
            <CampaignVideoInfo campaignData={campaignData} />
          </div>

          {campaignData.status === "Rejected" && campaignData.reason && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-[24px]">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Campaign Rejected</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Reason : {campaignData.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <CampaignExpiredAlert
            isCampaignExpired={isCampaignExpired}
            showExpiredAlert={showExpiredAlert}
            setShowExpiredAlert={setShowExpiredAlert}
          />

          <div>
            <h1 className="font-md text-[18px]">Budget & Spending</h1>
            <BudgetSummary campaignData={campaignData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuizDetails
              quizQuestion={campaignData.quizQuestion}
              genderRatio={campaignData.genderRatio}
            />
            <SurveyDetails
              surveyQuestion1={campaignData.surveyQuestion1}
              surveyQuestion2={campaignData.surveyQuestion2}
              engagements={campaignData.engagements}
            />
          </div>

          <div>
            <h1 className="font-md text-[18px]">Performance Summary</h1>
            <PerformanceSummary campaignData={campaignData} />
          </div>

          <div className="flex justify-center">
            <div className="w-full">
          <EngagementChart clicks={campaignData?.clickCount?.totalCount } videoWatchTime={campaignData?.videoWatchTime } />
            </div>
          </div>
        </div>

        <ConfirmationDialogue
          open={dialogOpen}
          title={dialogConfig.title}
          smallText={dialogConfig.smallText}
          confirmLabel={dialogConfig.confirmLabel}
          onConfirm={() => {
            dialogConfig.onConfirm();
            setDialogOpen(false);
          }}
          onCancel={() => setDialogOpen(false)}
        />

        <FeedbackDialog
          open={feedbackDialogOpen}
          onClose={() => setFeedbackDialogOpen(false)}
          onSubmit={(feedback) => {
            console.log("Feedback submitted:", feedback);
          }}
        />
      </main>
    </>
  );
}