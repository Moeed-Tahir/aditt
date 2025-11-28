export const PerformanceSummary = ({ campaignData }) => {

  return (
    <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
      <div className="flex-1 bg-white rounded-xl p-6">
        <h2 className="text-[16px] text-gray-400 mb-2">
          VERIFIED RESPONSES
        </h2>
        <p className="text-[30px] font-md text-gray-800">
          {campaignData?.engagements?.totalCount ?? 0}
        </p>
      </div>

      <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

      <div className="flex-1 bg-white rounded-xl p-6">
        <h2 className="text-[16px] text-gray-400 mb-2">AD CLICKS</h2>
        <p className="text-[30px] font-md text-gray-800">
          {campaignData?.clickCount?.totalCount ?? 0}
        </p>
      </div>

    </div>
  );
};