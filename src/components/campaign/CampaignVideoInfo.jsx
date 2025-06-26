"use client";
import { useState, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

export const CampaignVideoInfo = ({ campaignData }) => {
  const [duration, setDuration] = useState(null);
  const videoRef = useRef(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(Math.floor(videoRef.current.duration));
    }
  };

  const formatDateRange = () => {
    if (!campaignData?.campaignStartDate || !campaignData?.campaignEndDate) return "N/A";
    
    const startDate = new Date(campaignData.campaignStartDate).toLocaleDateString();
    const endDate = new Date(campaignData.campaignEndDate).toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  // Format the age range for display
  const formatAgeRange = () => {
    if (!campaignData?.ageRange || !Array.isArray(campaignData.ageRange)) return "N/A";
    return `${campaignData.ageRange[0]} - ${campaignData.ageRange[1]}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 w-full md:w-auto">
        <video
          ref={videoRef}
          src={campaignData?.campaignVideoUrl}
          controls
          className="rounded-lg object-cover w-full md:w-[170px] h-[200px]"
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-[24px] sm:text-2xl font-md text-gray-900">
            {campaignData?.campaignTitle || "No title"}
          </h2>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {campaignData?.status || "Unknown status"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg overflow-hidden bg-gray-50 md:bg-transparent p-2 md:p-0">
          <div className="text-[18px] text-gray-400">UTM Link:</div>
          <a className="flex-1 min-w-0 text-black text-[18px] break-all px-3 py-2">
            {campaignData?.websiteLink || "No link provided"}
          </a>
          <Copy className="text-blue-600 hover:text-blue-800 cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div className="space-y-2 text-[18px]">
            <div className="flex flex-wrap">
              <span className="min-w-[80px] text-gray-400">Duration:</span>
              <span>{duration ? `${duration} seconds` : "Loading..."}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="min-w-[130px] text-gray-400">
                Campaign Length:
              </span>
              <span>{formatDateRange()}</span>
            </div>
          </div>

          <div className="space-y-2 text-[18px]">
            <div className="flex flex-wrap">
              <span className="min-w-[160px] md:pl-10 text-gray-400">
                Target Audience Age:
              </span>
              <span>
                {formatAgeRange()}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="min-w-[160px] md:pl-10 text-gray-400">
                Target Audience Gender:{" "}
              </span>
              <span>{campaignData?.genderType === "male" 
                ? `${campaignData?.genderRatio || 0}% Male / ${100 - (campaignData?.genderRatio || 0)}% Female` 
                : `${100 - (campaignData?.genderRatio || 0)}% Male / ${campaignData?.genderRatio || 0}% Female`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};