"use client";
import { Copy } from "lucide-react";

export const AdsVideoInfo = ({ campaignData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 w-full md:w-auto">
        <video
          src={campaignData?.campaignVideoUrl}
          controls
          className="rounded-lg object-cover w-full md:w-[170px] h-[200px]"
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-[24px] sm:text-2xl font-md text-gray-900">
            {campaignData?.campaignTitle}
          </h2>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            campaignData?.status === 'Active' ? 'bg-green-100 text-green-700' : 
            campaignData?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {campaignData?.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg overflow-hidden bg-gray-50 md:bg-transparent p-2 md:p-0">
          <div className="text-[18px] text-gray-400">Website Link:</div>
          <a 
            href={campaignData?.websiteLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 min-w-0 text-black text-[18px] break-all px-3 py-2"
          >
            {campaignData?.websiteLink}
          </a>
          <Copy 
            className="text-blue-600 hover:text-blue-800 cursor-pointer" 
            onClick={() => navigator.clipboard.writeText(campaignData?.websiteLink)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div className="space-y-2 text-[18px]">
            <div className="flex flex-wrap">
              <span className="min-w-[80px] text-gray-400">Brand:</span>
              <span>{campaignData?.brandName || 'N/A'}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="min-w-[130px] text-gray-400">
                Campaign Length:
              </span>
              <span>
                {formatDate(campaignData?.campaignStartDate)} - {campaignData?.campaignEndDate ? formatDate(campaignData?.campaignEndDate) : 'Ongoing'}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="min-w-[130px] text-gray-400">
                Campaign Budget:
              </span>
              <span>${campaignData?.campaignBudget}</span>
            </div>
          </div>

          <div className="space-y-2 text-[18px]">
            <div className="flex flex-wrap">
              <span className="min-w-[160px] md:pl-10 text-gray-400">
                Target Audience Age:
              </span>
              <span>{campaignData?.ageRange[0]} - {campaignData?.ageRange[1]} Years</span>
            </div>
            <div className="flex flex-wrap">
              <span className="min-w-[160px] md:pl-10 text-gray-400">
                Target Audience Gender: 
              </span>
              <span>{campaignData?.genderType} ({campaignData?.genderRatio}%)</span>
            </div>
            <div className="flex flex-wrap">
              <span className="min-w-[160px] md:pl-10 text-gray-400">
                Total Views: 
              </span>
              <span>{campaignData?.totalViews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};