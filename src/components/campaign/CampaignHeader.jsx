"use client";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import CampaignActionsDropdown from "./CampaignActionsDropdown";

const CampaignHeader = ({ userId, openDialog, setFeedbackDialogOpen }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-4 sm:p-0">
    <Link
      href={`/${userId}/campaign-dashboard`}
      className="order-1 sm:order-none py-2 px-5 sm:ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
    >
      <ArrowLeft />
      Back
    </Link>

    <div className="order-3 sm:order-none text-[24px] font-md text-center text-gray-800 w-full sm:w-auto">
      Campaign Overview
    </div>

    <CampaignActionsDropdown
      openDialog={openDialog}
      onCompleteConfirm={() => setFeedbackDialogOpen(true)}
      customTrigger={
        <button
          type="button"
          className="order-2 sm:order-none flex items-center gap-2 py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition w-full sm:w-auto justify-center sm:justify-start"
        >
          Actions <ChevronDown className="w-4 h-4" />
        </button>
      }
    />
  </div>
);
export default CampaignHeader;