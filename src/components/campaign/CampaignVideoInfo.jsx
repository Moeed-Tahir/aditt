"use client";
import { useState, useRef, useEffect } from "react";
import { Copy, X } from "lucide-react";

export const CampaignVideoInfo = ({ campaignData }) => {
  const [duration, setDuration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const getStreamingUrl = () => {
    if (!campaignData?.videoUrlId) return "";
    return `/api/routes/v1/streamVideo?action=streamVideoFromS3&fileName=${encodeURIComponent(campaignData.videoUrlId)}`;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(Math.floor(videoRef.current.duration));
      setIsVideoLoading(false);
    }
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleLoadStart = () => {
    setIsVideoLoading(true);
  };

  const handleCanPlay = () => {
    setIsVideoLoading(false);
  };

  const handleRetry = () => {
    setVideoError(false);
    setIsVideoLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const formatDateRange = () => {
    if (!campaignData?.campaignStartDate) return "N/A";
    const startDate = new Date(campaignData.campaignStartDate).toLocaleDateString();
    if (!campaignData?.campaignEndDate) return `Starts on ${startDate}`;
    const endDate = new Date(campaignData.campaignEndDate).toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  const formatAgeRange = () => {
    if (!campaignData?.ageRange || !Array.isArray(campaignData.ageRange)) return "N/A";
    return `${campaignData.ageRange[0]} - ${campaignData.ageRange[1]}`;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0 w-full md:w-auto">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center text-gray-500">
                <p>Failed to load video</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src={getStreamingUrl()}
            onClick={() => setShowModal(true)}
            className={`rounded-lg object-cover w-full md:w-[170px] h-[200px] cursor-pointer ${isVideoLoading ? "opacity-50" : "opacity-100"
              }`}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            onLoadStart={handleLoadStart}
            onCanPlay={handleCanPlay}
            onWaiting={() => setIsVideoLoading(true)}
            onPlaying={() => setIsVideoLoading(false)}
            preload="metadata"
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
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

          <div className="flex flex-wrap items-center gap-2 bg-gray-50 md:bg-transparent p-2 md:p-0">
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
                <span className="min-w-[130px] text-gray-400">Campaign Length:</span>
                <span>{formatDateRange()}</span>
              </div>
            </div>

            <div className="space-y-2 text-[18px]">
              <div className="flex flex-wrap">
                <span className="min-w-[160px] md:pl-10 text-gray-400">Target Audience Age:</span>
                <span>{formatAgeRange()}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="min-w-[160px] md:pl-10 text-gray-400">Target Audience Gender:</span>
                <span>
                  {campaignData?.genderType === "male"
                    ? `${campaignData?.genderRatio || 0}% Male / ${100 - (campaignData?.genderRatio || 0)}% Female`
                    : `${100 - (campaignData?.genderRatio || 0)}% Male / ${campaignData?.genderRatio || 0}% Female`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl w-full">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-black z-10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <video
              src={getStreamingUrl()}
              controls
              autoPlay
              className="w-full h-[500px] object-contain"
              onError={handleVideoError}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};