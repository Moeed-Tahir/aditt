"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Sliders from "./Sliders";

export default function CampaignFeedbackForm({ feedbackData }) {
  const [conversions, setConversions] = useState(feedbackData?.conversion || "");
  const [conversionType, setConversionType] = useState(
    feedbackData?.conversionType || ""
  );
  const [satisfaction, setSatisfaction] = useState(
    feedbackData?.campaignRate ? [feedbackData.campaignRate] : [3]
  );
  const [feedback, setFeedback] = useState(
    feedbackData?.campaignFeedback || ""
  );

  useEffect(() => {
    if (feedbackData) {
      setConversions(feedbackData.conversion || "");
      setConversionType(feedbackData.conversionType || "");
      setSatisfaction(feedbackData.campaignRate ? [feedbackData.campaignRate] : [3]);
      setFeedback(feedbackData.campaignFeedback || "");
    }
  }, [feedbackData]);

  return (
    <div className="bg-white rounded-[24px] p-6 shadow space-y-6 w-full">
      <h2 className="text-[18px] font-semibold">
        Campaign Feedback From Advertiser
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-500">
          How many conversions did your campaign have?
        </label>
        <div className="w-full border border-gray-200 bg-gray-50 rounded-full pl-10 pr-4 py-2 md:py-3 text-gray-700">
          {conversions || "Not specified"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-500">
          How do you define conversions in this campaign (e.g. purchases, installs, followers, etc.)?
        </label>
        <div className="w-full border border-gray-200 bg-gray-50 rounded-full pl-10 pr-4 py-2 md:py-3 text-gray-700">
          {conversionType || "Not specified"}
        </div>
      </div>

      {/* Satisfaction Slider */}
      <div>
        <label className="block text-sm font-medium mb-2">
          How satisfied are you with your campaign?
        </label>
        <div className="relative w-full">
          <Sliders
            min={0}
            max={5}
            step={1}
            defaultValue={satisfaction}
          // onValueChange={(val) => setSatisfaction(val)}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1 px-1">
          {[0, 1, 2, 3, 4, 5].map((val) => (
            <span key={val}>{val}</span>
          ))}
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1 text-gray-500">Feedback</label>
        <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 overflow-hidden resize-none min-h-[100px] text-gray-700">
          {feedback || "No feedback provided"}
        </div>
      </div>
    </div>
  );
}