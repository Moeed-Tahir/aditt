import React from 'react'

const CampaignMetricsDashboard = ({ transformedCampaigns, totalEngagementsAcrossAllCampaigns, campaignStats }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
        <div className="flex-1 p-6">
          <h2 className="text-[16px] text-gray-400 mb-2">
            📊 CAMPAIGNS CREATED
          </h2>
          <p className="font-md text-[30px]">
            {transformedCampaigns?.length}
          </p>
        </div>

        <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

        <div className="flex-1 bg-white rounded-xl p-6">
          <h2 className="text-[16px] text-gray-400 mb-2">
            🚀 ACTIVE CAMPAIGNS
          </h2>
          <p className="font-md text-[30px]">
            {
              transformedCampaigns?.filter((c) => c.status === "Active")
                .length
            }
          </p>
        </div>

        <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

        <div className="flex-1 bg-white rounded-xl p-6">
          <h2 className="text-[16px] text-gray-400 mb-2">
            🎉 TOTAL VERIFIED RESPONSE
          </h2>
          <p className="font-md text-[30px]">
            {totalEngagementsAcrossAllCampaigns}
          </p>
        </div>
      </div>

      {/* Second Row - 3 budget metrics */}
      <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
        <div className="flex-1 p-6">
          <h2 className="text-[16px] text-gray-400 mb-2">
            💰 TOTAL BUDGET
          </h2>
          <p className="font-md text-[30px]">
            ${campaignStats?.totalBudget?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

        <div className="flex-1 bg-white rounded-xl p-6">
          <h2 className="text-[16px] text-gray-400 mb-2">
            💸 TOTAL SPENT
          </h2>
          <p className="font-md text-[30px]">
            ${campaignStats?.totalSpent?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

        <div className="flex-1 bg-white rounded-xl p-6">
          <h2 className="text-[16px] text-gray-400 mb-2">
            ⚖️ REMAINING BUDGET
          </h2>
          <p className={`font-md text-[30px] ${campaignStats?.totalRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${campaignStats?.totalRemaining ? Math.abs(campaignStats.totalRemaining).toLocaleString() : '0'}
          </p>
        </div>
      </div>
    </>
  )
}

export default CampaignMetricsDashboard