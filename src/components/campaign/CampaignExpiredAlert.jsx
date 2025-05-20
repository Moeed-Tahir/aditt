// components/campaign/CampaignExpiredAlert.jsx
"use client";
import { useState } from "react";
import { CircleAlert } from "lucide-react";

export const CampaignExpiredAlert = ({ 
  isCampaignExpired, 
  showExpiredAlert, 
  setShowExpiredAlert 
}) => {
  const handleEndCampaign = () => setShowExpiredAlert(false);
  const handleReactivateCampaign = () => setShowExpiredAlert(false);

  if (!isCampaignExpired || !showExpiredAlert) return null;

  return (
    <div className="bg-red-50 border-1 rounded-xl border-red-500 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-8 bg-red-100 rounded-full">
            <CircleAlert className="h-10 w-10 text-red-800" />
          </div>
          <div className="ml-3">
            <div className="flex items-center justify-between">
              <p className="text-xl text-gray-800">Campaign Duration Expired</p>
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
            className="px-10 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reactivate
          </button>
        </div>
      </div>
    </div>
  );
};