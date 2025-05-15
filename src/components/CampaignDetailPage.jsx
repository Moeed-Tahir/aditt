"use client";

import Navbar2 from "@/components/Navbar2";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  CircleAlert,
  Coffee,
  Copy,
} from "lucide-react";
import Image from "next/image";
import BarCharts from "@/components/BarCharts";
import AreaCharts from "@/components/AreaCharts";
import ProgressBar from "@/components/ProgressBar";
import CampaignActionsDropdown from "@/components/CampaignActionsDropdown";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import Cookies from "js-cookie";

export default function CampaignDetailPage({ campaignData }) {
  const [duration, setDuration] = useState(null);
  const videoRef = useRef(null);
  const [showExpiredAlert, setShowExpiredAlert] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  if (!campaignData)
    return (
      <div className="p-10 text-center text-gray-500">Campaign not found</div>
    );

  const isCampaignExpired = new Date(campaignData.date) < new Date();

  const handleEndCampaign = () => {
    setShowExpiredAlert(false);
  };

  const handleReactivateCampaign = () => {
    setShowExpiredAlert(false);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(Math.floor(videoRef.current.duration));
    }
  };

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sliderValue, setSliderValue] = useState(5); // Default value is 5

  const FeedbackDialog = ({
    open,
    onClose,
    feedback,
    setFeedback,
    onSubmit,
  }) => {
    return (
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
          open ? "" : "hidden"
        }`}
      >
        <div className="bg-white w-full max-w-[679px] h-auto max-h-[90vh] md:h-[763px] border rounded-[20px] p-[18px] flex flex-col mx-4 overflow-y-auto">
          <div className="flex items-center p-[12px] justify-center">
            <Coffee className="w-[54px] h-[54px] text-blue-300 text-center flex items-center justify-center" />
          </div>

          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Campaign Feedback</h3>
          </div>

          <p className="text-sm text-gray-500 mb-4 text-center">
            We'd love to hear about your campaign's performance. Your feedback
            helps us improve!
          </p>

          {/* Scrollable content section */}
          <div className="flex-1 overflow-auto space-y-4">
            <div className="relative">
              <p className="text-[14px] mb-2 font-md">
                How many Conversions did your campaign have?
              </p>
              <input
                type="text"
                name="campaignFeedback"
                placeholder="Enter details..."
                className="w-full h-full p-[16px] border border-gray-300 rounded-full"
              />
            </div>

            <div className="relative">
              <p className="text-[14px] mb-2 font-md">
                How do you define conversions in this campaign (e.g. purchases,
                installs, followers, etc.)
              </p>
              <input
                type="text"
                name="campaignFeedback"
                placeholder="Enter details..."
                className="w-full h-full p-[16px] border border-gray-300 rounded-full"
              />
            </div>

            <div className="relative">
              <p className="text-[14px] font-md mb-2">
                How satisfied are you with your campaign?{" "}
              </p>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(e.target.value)}
                  className="w-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {sliderValue}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom fixed textarea and button */}
          <div className="mt-4">
            <p className="text-[14px] font-md mb-2">Feedback</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-[20px] mb-4 resize-none"
              rows={4}
              placeholder="Enter details..."
            />

            <div className="flex justify-end">
              <button
                onClick={() => {
                  onSubmit(feedback);
                  onClose();
                }}
                className="w-full h-[52px] text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar2 />

      <main className="flex min-h-screen w-full max-w-[1440px] mx-auto flex-col">
        <div className="p-6 space-y-6">
          {/* Header Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-4 sm:p-0">
            <Link
              href={`/${userId}/campaign-dashboard`}
              className="order-1 sm:order-none py-2 px-5 sm:ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <ArrowLeft />
              Back
            </Link>

            <div className="order-3 sm:order-none text-[24px] font-md text-center text-gray-800 w-full sm:w-auto">
              Campaign Overview
            </div>

            <CampaignActionsDropdown
              campaignId={campaignData.id}
              openDialog={openDialog}
              customTrigger={
                <button
                  type="button"
                  className="order-2 sm:order-none flex items-center gap-2 py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition w-full sm:w-auto justify-center sm:justify-start"
                >
                  Actions <ChevronDown className="w-4 h-4" />
                </button>
              }
            />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-[24px]">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Video Section - Unchanged but responsive */}
              <div className="flex-shrink-0 w-full md:w-auto">
                <video
                  ref={videoRef}
                  src={campaignData.campaignVideoUrl}
                  controls
                  className="rounded-lg object-cover w-full md:w-[170px] h-[180px]"
                  onLoadedMetadata={handleLoadedMetadata}
                />
              </div>

              {/* Campaign Info - Main container unchanged */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Title and Status - Exactly the same but responsive */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h2 className="text-[24px] sm:text-2xl font-md text-gray-900">
                    {campaignData.campaignTitle}
                  </h2>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {campaignData.status}
                  </span>
                </div>

                {/* UTM Link - Same styling but better mobile behavior */}
                <div className="flex flex-wrap items-center gap-2 rounded-lg overflow-hidden bg-gray-50 md:bg-transparent p-2 md:p-0">
                  <div className="text-[18px] text-gray-400">UTM Link:</div>
                  <a className="flex-1 min-w-0 text-black text-[18px] break-all px-3 py-2">
                    {campaignData.websiteLink}
                  </a>
                  <Copy className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                </div>

                {/* Campaign Details - Same layout but responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                  {/* Left Column - Unchanged styling */}
                  <div className="space-y-2 text-[18px]">
                    <div className="flex flex-wrap">
                      <span className="min-w-[80px] text-gray-400">
                        Duration:
                      </span>
                      <span>
                        {duration ? `${duration} seconds` : "Loading..."}
                      </span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="min-w-[130px] text-gray-400">
                        Campaign Length:
                      </span>
                      <span>
                        {`${new Date(
                          campaignData.campaignStartDate
                        ).toLocaleDateString()} - ${new Date(
                          campaignData.campaignEndDate
                        ).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Unchanged styling */}
                  <div className="space-y-2 text-[18px]">
                    <div className="flex flex-wrap">
                      <span className="min-w-[160px] md:pl-10 text-gray-400">
                        Target Audience Age:
                      </span>
                      <span>{`${campaignData.genderRatio} years`}</span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="min-w-[160px] md:pl-10 text-gray-400">
                        Target Audience Gender:
                      </span>
                      <span>{campaignData.genderType}</span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="min-w-[160px] md:pl-10 text-gray-400">
                        Target Audience Locations:
                      </span>
                      <span>AL, GA, FL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isCampaignExpired && showExpiredAlert && (
            <div className="bg-red-50 border-1 rounded-xl border-red-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-8 bg-red-100 rounded-full">
                    <CircleAlert className="h-10 w-10 text-red-800" />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xl text-gray-800">
                        Campaign Duration Expired
                      </p>
                    </div>
                    <p className="text-sm w-200 text-gray-600 mt-1">
                      Your set campaign duration has expired, but you still have
                      $600 remaining in your budget. The campaign will remain
                      paused until the full budget is spent. You can update the
                      campaign duration or pause it at any time.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={handleEndCampaign}
                    className="px-14 py-5 text-sm bg-white text-red-500 border-1 border-red-500 rounded-full hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    End
                  </button>
                  <button
                    onClick={handleReactivateCampaign}
                    className="px-10 py-2 text-sm  bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Reactivate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Budget Summary */}
          <div>
            <h1 className="font-md text-[18px]">Budget & Spending</h1>
          </div>

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
            <div className="flex-1 p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                ALLOCATED BUDGET
              </h2>
              <p className="text-[30px] font-md text-gray-800">$30,000</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className=" text-gray-400 text-[16px] mb-2">TOTAL SPENT</h2>
              <p className="text-[30px] font-md text-gray-800">
                {campaignData?.campaignBudget}
              </p>{" "}
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                REMAINING BUDGET
              </h2>
              <p className="text-[30px] font-md text-gray-800">
                {(30000 - campaignData.campaignBudget).toFixed(2)}
              </p>{" "}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quiz Details */}
            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-[18px] font-md text-gray-800 mb-4">
                Quiz details
              </h2>

              {/* Quiz Info */}
              <div className="mb-20">
                <h3 className="text-gray-500 text-[16px] mb-2">QUIZ INFO</h3>
                <div className="bg-[var(--bg-color-off-white)] p-10 rounded-xl">
                  <p className="text-gray-700 mb-4 text-[16px]">
                    {campaignData?.quizQuestion?.questionText}
                  </p>
                  <hr className="border-t border-gray-300" />

                  <ul className=" py-2 text-[16px] text-gray-600 space-y-1">
                    <li className="py-[12px]">
                      A. {campaignData?.quizQuestion?.option1}
                      <span className="float-right">0%</span>
                    </li>
                    <li className="py-[12px]">
                      B. {campaignData?.quizQuestion?.option2}
                      <span className="float-right">0%</span>
                    </li>
                    <li className="py-[12px]">
                      C. {campaignData?.quizQuestion?.option3}
                      <span className="float-right">0%</span>
                    </li>
                    <li className="py-[12px]">
                      D. {campaignData?.quizQuestion?.option4}
                      <span className="float-right">0%</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <BarCharts />

                <div className="grid grid-cols-1 sm:grid-cols-3 ml-4 sm:ml-20 text-sm text-gray-600 w-full max-w-md">
                  <div className="mb-2 sm:mb-0">
                    <span className="w-3 h-3 rounded-full bg-[#3653F7] inline-block mr-2" />{" "}
                    Male ({campaignData?.genderRatio}%)
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <span className="w-3 h-3 rounded-full bg-[#E670C7] inline-block mr-2" />
                    Female (0%)
                  </div>
                  <div>
                    <span className="w-3 h-3 rounded-full bg-[#15B79E] inline-block mr-2" />{" "}
                    Prefer Not to Say (0%)
                  </div>
                </div>
              </div>
            </div>

            {/* Survey Details */}
            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <h2 className="text-[16px] sm:text-[18px] font-md text-gray-800 mb-4">
                Survey details
              </h2>

              {/* Survey Question 1 */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between text-[14px] sm:text-[16px] text-gray-500 mb-1 gap-2 sm:gap-0">
                  <span>SURVEY QUESTION 1</span>
                  <span className="font-bold text-lg sm:text-xl text-gray-700">
                    {campaignData?.engagements?.totalCount} Responses
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-color-off-white)]">
                  <span className="text-[14px] sm:text-[16px] text-gray-800">
                    {campaignData?.surveyQuestion1?.questionText}
                  </span>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={25}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion1?.option1,
                        right: "0%",
                      }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={60}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion1?.option2,
                        right: "0%",
                      }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={45}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion1?.option3,
                        right: "0%",
                      }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={30}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion1?.option4,
                        right: "0%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Survey Question 2 */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between text-[13px] sm:text-[16px] text-gray-500 mb-1 gap-2 sm:gap-0">
                  <span>SURVEY QUESTION 2</span>
                  <span className="font-bold text-lg sm:text-xl text-gray-700">
                    {campaignData?.engagements?.totalCount} Responses
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-color-off-white)]">
                  <span className="text-[14px] sm:text-[16px] text-gray-800">
                    {campaignData?.surveyQuestion2?.questionText}
                  </span>

                  <div className="p-1 relative">
                    <ProgressBar
                      value={25}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion2?.option1,
                        right: "0%",
                      }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={60}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion2?.option2,
                        right: "0%",
                      }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={45}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion2?.option3,
                        right: "0%",
                      }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={30}
                      fill="bg-white rounded-xl"
                      text={{
                        left: campaignData?.surveyQuestion2?.option4,
                        right: "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="font-md text-[18px]">Performance Summary</h1>
          </div>

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
            <div className="flex-1 p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">IMPRESSIONS</h2>
              <p className="text-[30px] font-md text-gray-800">
                {campaignData.impressions}
              </p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                COMPLETED ENGAGEMENTS
              </h2>
              <p className="text-[30px] font-md text-gray-800">
                {campaignData.engagements?.totalCount}
              </p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">AD CLICKS</h2>
              <p className="text-[30px] font-md text-gray-800">30,000</p>
            </div>
            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400  mb-2">
                CLICK-THROUGH RATE
              </h2>
              <p className="text-[30px] font-md text-gray-800">40%</p>
            </div>
          </div>

          <div>
            <div className="flex justify-center">
              <div className="w-full">
                <AreaCharts />
              </div>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1  md:col-span-2 bg-white p-6 rounded-xl border">
              <BarCharts />
            </div>
            <div className="col-span-1  bg-white p-6 rounded-xl border">
              <h3 className="text-gray-600 text-xl font-bold mb-3">
                Gender breakdown
              </h3>
              <h3 className="text-gray-500 text-sm font-medium mb-3">
                Percentage of users based on gender
              </h3>
              <PieCharts />
              <div className="grid grid-cols-3 text-sm text-gray-600 w-full max-w-md">
                <div>🔵 Male</div>
                <div>🟣 Female</div>
                <div>🟢 Prefer Not to Say</div>
              </div>
            </div>
          </div> */}
        </div>

        <ConfirmationDialogue
          open={dialogOpen}
          title={dialogConfig.title}
          smallText={dialogConfig.smallText}
          confirmLabel={dialogConfig.confirmLabel}
          onConfirm={() => {
            dialogConfig.onConfirm(); // Perform your confirm action
            setDialogOpen(false); // Close confirmation dialog
            setFeedbackDialogOpen(true); // Open feedback dialog
          }}
          onCancel={() => setDialogOpen(false)}
        />
        <FeedbackDialog
          open={feedbackDialogOpen}
          onClose={() => setFeedbackDialogOpen(false)}
          feedback={feedback}
          setFeedback={setFeedback}
          onSubmit={(feedback) => {
            // Handle feedback submission here
            console.log("Feedback submitted:", feedback);
            // You might want to make an API call here
          }}
        />
      </main>
    </>
  );
}
