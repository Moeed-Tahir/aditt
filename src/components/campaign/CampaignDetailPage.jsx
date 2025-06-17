"use client";
import { useState, useRef } from "react";
import Navbar2 from "@/components/Navbar2";
import EngagementChart  from "@/components/AreaCharts";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import Cookies from "js-cookie";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import {CampaignVideoInfo} from "@/components/campaign/CampaignVideoInfo";
import {CampaignExpiredAlert} from "@/components/campaign/CampaignExpiredAlert";
import {BudgetSummary} from "@/components/campaign/BudgetSummary";
import {QuizDetails} from "@/components/campaign/QuizDetails";
import {SurveyDetails} from "@/components/campaign/SurveyDetails";
import {PerformanceSummary} from "@/components/campaign/PerformanceSummary";
import FeedbackDialog from "../campaign-dashboard/FeedbackDialog";

export default function CampaignDetailPage({ campaignData,campaignId }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [showExpiredAlert, setShowExpiredAlert] = useState(true);
  const userId = Cookies.get("userId");

  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    smallText: "",
    confirmLabel: "",
    onConfirm: () => {},
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
              <EngagementChart />
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
