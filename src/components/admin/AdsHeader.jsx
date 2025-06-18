"use client";

export function AdsHeader({ campaignData }) {
  const joinDate = new Date(campaignData?.createdAt).toLocaleDateString('en-GB');
  
  return (
    <div>
      <h1 className="text-[24px] text-gray-700">{campaignData?.campaignTitle}</h1>
      
      <p className="text-xs text-gray-500">Joining Date: {joinDate}</p>
      
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-2">
        <p className="text-sm text-blue-600">
          Status: <span className="text-gray-600">{campaignData?.status}</span>
        </p>
        <p className="text-sm text-blue-600">
          Business Website:{" "}
          <span className="text-gray-600">{campaignData?.websiteLink}</span>
        </p>
        <p className="text-sm text-blue-600">
          Total Views: <span className="text-gray-600">{campaignData?.totalViews}</span>
        </p>
        <p className="text-sm text-blue-600">
          Campaign Budget: <span className="text-gray-600">${campaignData?.campaignBudget}</span>
        </p>
        <p className="text-sm text-blue-600">
          Target Gender: <span className="text-gray-600">{campaignData?.genderType} ({campaignData?.genderRatio}%)</span>
        </p>
        <p className="text-sm text-blue-600">
          Age Range: <span className="text-gray-600">{campaignData?.ageRange[0]} - {campaignData?.ageRange[1]}</span>
        </p>
      </div>
    </div>
  );
}