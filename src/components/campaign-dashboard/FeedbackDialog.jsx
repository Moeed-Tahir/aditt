"use client"

import { Coffee } from "lucide-react";
import React, { useState } from "react";

const FeedbackDialog = ({
  open,
  onClose,
  onSubmit,
  campaignId,
}) => {
  const [conversion, setConversion] = useState("");
  const [conversionType, setConversionType] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit({
      campaignId,
      conversion,
      conversionType,
      campaignRate: rating,
      campaignFeedback: feedback,
    });
    setConversion("");
    setConversionType("");
    setRating(5);
    setFeedback("");
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${open ? "" : "hidden"
        }`}
    >
   <div className="bg-white h-[95vh] border rounded-[20px] p-[18px] flex flex-col mx-4 w-[calc(100%-32px)] max-w-[679px] overflow-y-auto scrollbar-hide">        <div className="flex items-center p-[12px] justify-center">
          <Coffee className="w-[54px] h-[54px] text-blue-300 text-center flex items-center justify-center" />
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Campaign Feedback</h3>
        </div>

        <p className="text-sm text-gray-500 mb-4 text-center">
          We'd love to hear about your campaign's performance. Your feedback
          helps us improve!
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-[14px] mb-2 font-md">
              How many Conversions did your campaign have?
            </p>
            <input
              type="text"
              value={conversion}
              onChange={(e) => setConversion(e.target.value)}
              placeholder="Enter details..."
              className="w-full p-[16px] border border-gray-300 rounded-full"
            />
          </div>

          <div>
            <p className="text-[14px] mb-2 font-md">
              How do you define conversions in this campaign?
            </p>
            <input
              type="text"
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value)}
              placeholder="Enter details..."
              className="w-full p-[16px] border border-gray-300 rounded-full"
            />
          </div>

          <div>
            <p className="text-[14px] font-md mb-2">
              How satisfied are you with your campaign?{" "}
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {rating}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[14px] font-md mb-2">Feedback</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-[20px] resize-none"
              rows={4}
              placeholder="Enter details..."
            />
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="w-1/3 h-[52px] text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="w-2/3 h-[52px] text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDialog;