import React from 'react'
import { Input } from "@/components/ui/input";
import {
  ListFilter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CampaignsTable from './CampaignsTable';

const CampaignDataTable = ({ setDateFilter,setStatusFilter,currentPage, fetchCampaign, handleAction, totalPages, dateFilter, statusFilter, resetFilters, paginatedCampaigns, filteredCampaigns, campaignData, openDialog, setCurrentPage }) => {
  return (
    <>
      <div className="bg-white rounded-2xl p-4 md:p-6 mb-4 border-none border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-[18px] font-md text-gray-400">
            ALL CAMPAIGNS
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1 w-full sm:w-auto"
                >
                  <ListFilter className="w-4 h-4 " /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-[16px] w-full sm:w-[343px] h-[296] p-[20px] gap-[24px] mr-10 mt-10">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[16px] gap-[16px] font-medium text-black mb-1">
                      Date
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={dateFilter.from}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            from: e.target.value,
                          })
                        }
                        className="w-full sm:w-[146px] h-[44px] rounded-full gap-[8px] text-xs"
                      />
                      <Input
                        type="date"
                        value={dateFilter.to}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            to: e.target.value,
                          })
                        }
                        className="w-full sm:w-[146px] h-[44px] rounded-full gap-[8px] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] gap-[16px] font-medium text-black mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-[11px]">
                      {["Active", "Pending", "Paused"].map((status) => (
                        <Button
                          key={status}
                          variant={
                            statusFilter === status ? "default" : "outline"
                          }
                          className="rounded-full text-[16px] font-md gap-[8px] p-[16px]"
                          onClick={() =>
                            setStatusFilter(
                              statusFilter === status ? "All" : status
                            )
                          }
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-[10px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="w-full sm:w-[154px] h-[48px] rounded-full border text-blue-600 bg-white hover:bg-blue-600 hover:text-white cursor-pointer"
                    >
                      Clear All
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        document.dispatchEvent(
                          new KeyboardEvent("keydown", { key: "Escape" })
                        )
                      }
                      className="w-full sm:w-[154px] h-[48px] rounded-full border text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CampaignsTable handleAction={handleAction} fetchCampaign={fetchCampaign} openDialog={openDialog} campaignData={campaignData} paginatedCampaigns={paginatedCampaigns}/>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-sm text-gray-500">
            Showing {filteredCampaigns.length} result
            {filteredCampaigns.length !== 1 && "s"}
          </p>
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className="bg-blue-500 text-white rounded-full"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CampaignDataTable